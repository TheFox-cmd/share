package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
	"github.com/joho/godotenv"
	"github.com/oracle/oci-go-sdk/v65/common"
	"github.com/oracle/oci-go-sdk/v65/objectstorage"
)

func main() {
	r := gin.Default()

	// CORS Middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// file upload endpoint
	r.POST("/upload", func(c *gin.Context) {

		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}

		// Access environment variables
		bucketName := os.Getenv("BUCKET_NAME")
		namespaceName := os.Getenv("NAMESPACE_NAME")

		// Generate a temporary file to store the uploaded file
		tempFile, err := generateTemporaryFile(c)
		if err != nil {
			return
		}

		// Reset the file pointer to the beginning
		tempFile.Seek(0, 0)
		defer tempFile.Close()

		// Upload the file to OCI Object Storage
		_, err = uploadFileToOCIObjectStorage(c, namespaceName, bucketName, tempFile)
		if err != nil {
			return
		}

		// Generate a tiny URL
		objectName := tempFile.Name()
		objectURL, err := getOCIObjectURL(c, namespaceName, bucketName, objectName)
		if err != nil {
			return
		}

		// Remove the temporary file after upload
		defer os.Remove(tempFile.Name())

		tinyURL, err := generateTinyURL(c, objectURL)
		if err != nil {
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully", "tinyURL": tinyURL})
	})

	r.Run(":8000")
}

func generateTemporaryFile(c *gin.Context) (*os.File, error) {
	// Request file
	file, _, err := c.Request.FormFile("file")

	if err != nil {
		c.JSON(400, gin.H{"error": fmt.Sprintf("No file is received: %v", err)})
		return nil, err
	}

	// Create temporary file to store the uploaded file (for chunking)
	tempFile, err := os.CreateTemp("", "upload-*.tmp")
	if err != nil {
		c.JSON(500, gin.H{"error": fmt.Sprintf("Failed to create temporary file: %v", err)})
		return nil, err
	}

	// Copy the uploaded file to the temporary file
	_, err = io.Copy(tempFile, file)
	if err != nil {
		c.JSON(500, gin.H{"error": fmt.Sprintf("Failed to copy file to temporary file: %v", err)})
		return nil, err
	}

	return tempFile, nil
}

func uploadFileToOCIObjectStorage(c *gin.Context, namespaceName string, bucketName string, tempFile *os.File) (string, error) {
	// OCI configuration setup
	configProvider := common.DefaultConfigProvider()
	objectStorageClient, err := objectstorage.NewObjectStorageClientWithConfigurationProvider(configProvider)

	if err != nil {
		c.JSON(500, gin.H{"error": fmt.Sprintf("Failed to create Object Storage client: %v", err)})
		return "", err
	}

	expirationTime := time.Now().Add(15 * time.Minute).Format(time.RFC3339)

	// Upload the file to OCI Object Storage with expiration time
	tempFileName := tempFile.Name()
	uploadRequest := objectstorage.PutObjectRequest{
		NamespaceName: &namespaceName,
		BucketName:    &bucketName,
		ObjectName:    &tempFileName,
		PutObjectBody: tempFile,
		ContentType:   common.String("application/octet-stream"),
		OpcMeta: map[string]string{
			"expirationTime": expirationTime,
		},
	}

	defer os.Remove(tempFile.Name())

	// Upload the file to OCI Object Storage
	ctx := c.Request.Context()
	_, err = objectStorageClient.PutObject(ctx, uploadRequest)
	if err != nil {
		c.JSON(500, gin.H{"error": fmt.Sprintf("Failed to upload file: %v", err)})
		return "", err
	}

	return "", nil
}

func getOCIObjectURL(c *gin.Context, namespaceName string, bucketName string, objectName string) (string, error) {
	provider := common.DefaultConfigProvider()

	// Get the region from the provider
	region, err := provider.Region()
	if err != nil {
		c.JSON(500, gin.H{"error": fmt.Sprintf("Failed to get region: %v", err)})
		return "", err
	}

	// Create Object Storage client
	objectStorageClient, err := objectstorage.NewObjectStorageClientWithConfigurationProvider(provider)
	if err != nil {
		c.JSON(500, gin.H{"error": fmt.Sprintf("Failed to create Object Storage client: %v", err)})
		return "", err
	}

	// Create a pre-authenticated request for the object
	expirationTime := common.SDKTime{Time: time.Now().Add(15 * time.Minute)}

	request := objectstorage.CreatePreauthenticatedRequestRequest{
		NamespaceName: &namespaceName,
		BucketName:    &bucketName,
		CreatePreauthenticatedRequestDetails: objectstorage.CreatePreauthenticatedRequestDetails{
			Name:        common.String("PreAuthRequest"),
			AccessType:  "ObjectRead",
			ObjectName:  &objectName,
			TimeExpires: &expirationTime,
		},
	}

	// Request the pre-authenticated URL
	response, err := objectStorageClient.CreatePreauthenticatedRequest(c.Request.Context(), request)
	if err != nil {
		c.JSON(500, gin.H{"error": fmt.Sprintf("Failed to create pre-authenticated request: %v", err)})
		return "", err
	}

	// Construct the full downloadable URL
	preAuthenticatedURL := *response.PreauthenticatedRequest.AccessUri
	fullURL := fmt.Sprintf("https://objectstorage.%s.oraclecloud.com%s", region, preAuthenticatedURL)

	return fullURL, nil
}

func generateTinyURL(c *gin.Context, originalURL string) (string, error) {
	type TinyURLResponse struct {
		ShortURL string `json:"shorturl"`
	}

	// Connect to the TinyURL API
	client := resty.New()

	tinyURLEndpoint := "https://tinyurl.ph/api/url/add"

	response, err := client.R().
		SetHeader("Authorization", "Bearer "+os.Getenv("TINY_URL_API")).
		SetHeader("Content-Type", "application/json").
		SetBody(map[string]interface{}{
			"url": originalURL,
		}).
		Post(tinyURLEndpoint)

	if err != nil {
		c.JSON(500, gin.H{"error": fmt.Sprintf("Failed to generate tiny URL: %v", err)})
		return "", err
	}

	// Retrieve the short URL from the response
	if response.StatusCode() != 200 {
		err = fmt.Errorf("failed to generate tiny URL: %s", response.Status())
		c.JSON(500, gin.H{"error": err})
		return "", err
	}

	var tinyURLResponse TinyURLResponse
	err = json.Unmarshal(response.Body(), &tinyURLResponse)
	if err != nil {
		c.JSON(500, gin.H{"error": fmt.Sprintf("Failed to parse tiny URL response: %v", err)})
		return "", err
	}

	return tinyURLResponse.ShortURL, nil
}

//TODO:
// 1. Fix tinyURL generation
// 2. OCI function to self destruct object using metadata
// 3. frontend UI
// 4. change production url
// 5. host service

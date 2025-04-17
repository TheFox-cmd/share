import { useContext } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Grid from "@mui/material/Grid";
import FileContext from "../contexts/FileContext";
import { DisplayFileObject, DisplayObject } from "../types/types";

const Upload = () => {
  const { displayFileArray, setDisplayFileArray } = useContext(FileContext);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files) return;
    handleFile(event.target.files);
  };

  const handleFileUpload = async () => {
    console.log("all files", displayFileArray);
    for (const fileObjectExtension of displayFileArray) {
      if (!fileObjectExtension) return;

      for (const fileObject of fileObjectExtension.fileObject) {
        const file = fileObject.object;
        const formData = new FormData();
        formData.append("file", file);

        const uploadEndpointURL = "http://127.0.0.1:8000/upload";
        try {
          const response = await axios.post(uploadEndpointURL, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          const extension = file.name.split(".").pop() || "unknown";
          handleFileURLUpdate(extension, file, response.data.tinyURL);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log("dropped files", event.dataTransfer.files);
    if (!event.dataTransfer.files) return;
    handleFile(event.dataTransfer.files);
  };

  const handleFile = (fileList: FileList) => {
    // Get the file objects that are already in the displayFileArray
    const newFileDisplayArray: DisplayFileObject[] = [...displayFileArray];

    // Get the file objects that are newly dropped
    for (const file of fileList) {
      const extension = file.name.split(".").pop() || "unknown";
      const fileDisplayObject: DisplayObject = {
        objectName: file.name,
        object: file,
        objectDownloadLink: "",
      };

      const cacheIndex: number = newFileDisplayArray.findIndex(
        (fileObject) => fileObject.extension === extension
      );

      const newFileObject: DisplayFileObject = {
        extension: extension,
        fileObject: [fileDisplayObject],
      };

      if (cacheIndex === -1) newFileDisplayArray.push(newFileObject);
      else newFileDisplayArray[cacheIndex].fileObject.push(fileDisplayObject);
    }

    console.log("new file display array: ", newFileDisplayArray);
    setDisplayFileArray(newFileDisplayArray);
  };

  const handleFileURLUpdate = (
    extension: string,
    file: File,
    downloadLink: string
  ) => {
    const newFileDisplayArray: DisplayFileObject[] = displayFileArray.map(
      (fileObject) => {
        if (fileObject.extension === extension) {
          const updatedFileObject = fileObject.fileObject.map((fileObj) => {
            if (fileObj.objectName === file.name) {
              return { ...fileObj, objectDownloadLink: downloadLink };
            }
            return fileObj;
          });
          return { ...fileObject, fileObject: updatedFileObject };
        }
        return fileObject;
      }
    );

    setDisplayFileArray(newFileDisplayArray);
    console.log("new file display array with link: ", newFileDisplayArray);
  };
  return (
    <>
      <Grid
        width="80%"
        borderColor="var(--primary-color)"
        borderRadius="16px"
        sx={{
          backgroundColor: "var(--tertiary-color)",
          borderStyle: "dashed",
        }}
      >
        <Grid>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
            gap="10px"
            padding="20px"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            <CloudUploadIcon
              sx={{ color: "var(--primary-color)", fontSize: "50px" }}
            />
            <Typography
              color="var(--secondary-text-color)"
              fontSize="14px"
              fontWeight="semibold"
              sx={{
                textTransform: "none",
              }}
            >
              Drag & Drop Files Here
            </Typography>
            <Typography
              color="var(--secondary-text-color)"
              fontSize="14px"
              sx={{
                textTransform: "none",
              }}
            >
              or
            </Typography>
            <Button
              fullWidth
              component="label"
              disableElevation
              disableRipple
              sx={{
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <Typography
                color="var(--primary-text-color)"
                fontSize="14px"
                sx={{
                  textTransform: "none",
                }}
              >
                Browse Files
              </Typography>
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                multiple
              />
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        width="80%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Button
          variant="outlined"
          disableRipple
          disableElevation
          sx={{
            borderColor: "var(--primary-color)",
            color: "var(--primary-color)",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disableRipple
          disableElevation
          onClick={handleFileUpload}
          sx={{
            backgroundColor: "var(--primary-color)",
            "&:hover": {
              backgroundColor: "var(--primary-color)",
            },
          }}
        >
          Upload
        </Button>
      </Grid>
    </>
  );
};

export default Upload;

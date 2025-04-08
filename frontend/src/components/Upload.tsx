import { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Grid from "@mui/material/Grid";

const Upload = () => {
  const [fileArray, setFileArray] = useState<File[]>([]);
  const [uploadURL, setUploadURL] = useState<string[]>([]);

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
    if (event.target.files) setFileArray(Array.from(event.target.files));
  };

  const handleFileUpload = async () => {
    console.log("Uploading files:", fileArray);
    for (const file of fileArray) {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const uploadEndpointURL = "http://127.0.0.1:8000/upload";
      try {
        const response = await axios.post(uploadEndpointURL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const newURLList = [...uploadURL, response.data.tinyURL];
        setUploadURL(newURLList);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files)
      setFileArray(Array.from(event.dataTransfer.files));
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

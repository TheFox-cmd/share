import { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Grid from "@mui/material/Grid";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadURL, setUploadURL] = useState<string>("");

  console.log("Upload URL:", uploadURL);

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
    if (event.target.files && event.target.files[0])
      setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
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

      setUploadURL(response.data.tinyURL);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
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
        <Button fullWidth component="label" disableElevation>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
            gap="10px"
            padding="20px"
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
            <Typography
              color="var(--primary-text-color)"
              fontSize="14px"
              sx={{
                textTransform: "none",
              }}
            >
              Browse Files
            </Typography>
          </Grid>
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
            multiple
          />
        </Button>
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
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disableRipple
          disableElevation
          onClick={handleFileUpload}
          sx={{ backgroundColor: "var(--primary-color)" }}
        >
          Upload
        </Button>
      </Grid>
    </>
  );
};

export default Upload;

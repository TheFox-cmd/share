import { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Grid from "@mui/material/Grid";
import FileContext from "../contexts/FileContext";
import { DisplayFileObject, DisplayObject } from "../types/types";

const Upload = () => {
  const { displayFileArray, setDisplayFileArray } = useContext(FileContext);
  const [tempFileArray, setTempFileArray] = useState<DisplayFileObject[]>([]);

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

  const handleFileOptimistic = () => {
    // Get the file objects that are already in the displayFileArray
    const newDisplayFileArray: DisplayFileObject[] = [...displayFileArray];

    // Get the file objects that are newly dropped
    for (const fileObject of tempFileArray) {
      const cacheIndex: number = newDisplayFileArray.findIndex(
        (file) => file.extension === fileObject.extension
      );

      if (cacheIndex === -1) newDisplayFileArray.push(fileObject);
      else
        newDisplayFileArray[cacheIndex].fileObject.push(
          ...fileObject.fileObject
        );
    }

    setDisplayFileArray(newDisplayFileArray);
    setTempFileArray([]);
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!event.dataTransfer.files) return;
    handleFile(event.dataTransfer.files);
  };

  const handleFile = (fileList: FileList) => {
    // Get the file objects that are already in the displayFileArray
    const newTempFileArray: DisplayFileObject[] = [...tempFileArray];

    // Get the file objects that are newly dropped
    for (const file of fileList) {
      const extension = file.name.includes(".")
        ? file.name.split(".").pop() || "unknown"
        : "unknown";
      const fileDisplayObject: DisplayObject = {
        objectName: file.name,
        object: file,
        objectDownloadLink: "",
        objectProgress: 0,
        objectSize: file.size,
        objectFailed: false,
      };

      const cacheIndex: number = newTempFileArray.findIndex(
        (fileObject) => fileObject.extension === extension
      );

      const newFileObject: DisplayFileObject = {
        extension: extension,
        fileObject: [fileDisplayObject],
      };

      if (cacheIndex === -1) newTempFileArray.push(newFileObject);
      else newTempFileArray[cacheIndex].fileObject.push(fileDisplayObject);

      setTempFileArray(newTempFileArray);
    }
  };

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        width="80%"
        height="240px"
        borderColor="var(--primary-color)"
        borderRadius="16px"
        sx={{
          backgroundColor: "var(--tertiary-color)",
          borderStyle: "dashed",
        }}
      >
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
      <Grid container width="80%" justifyContent="center">
        <Button
          fullWidth
          variant="contained"
          disableRipple
          disableElevation
          onClick={handleFileOptimistic}
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

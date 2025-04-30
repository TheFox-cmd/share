import Grid from "@mui/material/Grid";
import { useContext } from "react";
import FileContext from "../contexts/FileContext";
import Typography from "@mui/material/Typography";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import { DisplayFileObject } from "../types/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { DisplayObject } from "../types/types";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import IconButton from "@mui/material/IconButton";

interface QueueProps {
  handleComplete: () => void;
}

const Queue: React.FC<QueueProps> = ({ handleComplete }) => {
  const { displayFileArray, setDisplayFileArray } = useContext(FileContext);
  const [currentUpload, setCurrentUpload] = useState<DisplayObject | null>(
    null
  );

  useEffect(() => {
    // Start next upload if none is active
    if (!currentUpload) {
      const next = findNextUploadFile(displayFileArray);
      if (next) setCurrentUpload(next);
    }
  }, [displayFileArray, currentUpload]);

  const findNextUploadFile = (
    fileArray: DisplayFileObject[]
  ): DisplayObject | null => {
    for (const group of fileArray) {
      for (const file of group.fileObject) {
        if (!file.objectFailed && !file.objectDownloadLink) return file;
      }
    }
    return null;
  };

  const handleFileUpload = async (file: DisplayObject) => {
    const formData = new FormData();
    formData.append("file", file.object);
    const bytesPerSecond = 800;

    let simulatedProgress = 0;
    let uploadError = false;
    const interval =
      (100 * (bytesPerSecond * 1024)) / (file.objectSize + 4 * bytesPerSecond);

    const tick = () => {
      if (uploadError || simulatedProgress > 99) return;

      // Increase progress
      simulatedProgress += interval;
      updateProgress(file.objectName, Math.min(simulatedProgress, 99));

      const nextInterval = Math.random() * 1000 + 300;
      setTimeout(tick, nextInterval);
    };

    tick();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      simulatedProgress = 100;
      updateDownloadLink(file.objectName, response.data.tinyURL);
      updateProgress(file.objectName, 100);
      setCurrentUpload(null);
      handleComplete();
    } catch (error) {
      console.error("Upload error:", error);
      uploadError = true;
      updateFailed(file.objectName);
      updateProgress(file.objectName, 0);
      setCurrentUpload(null);
      handleComplete();
    }
  };

  const updateFailed = (fileName: string) => {
    setDisplayFileArray((prev) =>
      prev.map((group) => ({
        ...group,
        fileObject: group.fileObject.map((file) =>
          file.objectName === fileName ? { ...file, objectFailed: true } : file
        ),
      }))
    );
  };

  const updateProgress = (fileName: string, percent: number) => {
    setDisplayFileArray((prev) =>
      prev.map((group) => ({
        ...group,
        fileObject: group.fileObject.map((file) =>
          file.objectName === fileName
            ? { ...file, objectProgress: percent }
            : file
        ),
      }))
    );
  };

  const updateDownloadLink = (fileName: string, link: string) => {
    setDisplayFileArray((prev) =>
      prev.map((group) => ({
        ...group,
        fileObject: group.fileObject.map((file) =>
          file.objectName === fileName
            ? { ...file, objectDownloadLink: link }
            : file
        ),
      }))
    );
  };

  const handleCopy = async (downloadLink: string) => {
    try {
      await navigator.clipboard.writeText(downloadLink);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <Grid
      container
      direction="column"
      width="90%"
      borderColor="var(--primary-color)"
      borderRadius="16px"
      wrap="nowrap"
      overflow="auto"
      gap="8px"
      sx={{
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "rgba(0,0,0,0.1)",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-button": {
          display: "none",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(220,0,0,0.2)",
          borderRadius: "10px",
        },
      }}
    >
      {displayFileArray.map((fileExtensionObject, fileExtensionObjectIndex) => (
        <Grid
          key={fileExtensionObjectIndex}
          container
          direction="column"
          gap="8px"
        >
          <Typography fontWeight="bold">
            .{fileExtensionObject.extension}
          </Typography>
          {fileExtensionObject.fileObject.map((fileObject, fileObjectIndex) => (
            <Grid
              key={fileObjectIndex}
              container
              justifyContent="center"
              alignItems="center"
              direction="column"
              padding="8px"
              borderRadius="12px"
              sx={{
                overflow: "hidden",
                backgroundColor: "var(--primary-color)",
              }}
            >
              <LinearProgressWithLabel
                fileObject={fileObject}
                isActive={fileObject === currentUpload}
                onStartUpload={() => handleFileUpload(fileObject)}
              />
              {fileObject.objectDownloadLink && (
                <Grid
                  container
                  width="90%"
                  height="32px"
                  justifyContent="space-between"
                  alignItems="center"
                  padding="6px 8px"
                  borderRadius="0 0 10px 10px"
                  sx={{ backgroundColor: "var(--tertiary-color)" }}
                >
                  <Typography fontSize="14px" noWrap>
                    {fileObject.objectDownloadLink}
                  </Typography>

                  <IconButton
                    size="medium"
                    sx={{
                      padding: 0,
                      marginLeft: "8px",
                      "&:hover": {
                        color: "var(--button-highlight-color)",
                      },
                    }}
                    onClick={() => handleCopy(fileObject.objectDownloadLink)}
                  >
                    <AttachFileIcon fontSize="small" />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  );
};

export default Queue;

import Grid from "@mui/material/Grid";
import { useContext } from "react";
import FileContext from "../contexts/FileContext";
import Typography from "@mui/material/Typography";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import { DisplayFileObject } from "../types/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { DisplayObject } from "../types/types";

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

  return (
    <Grid
      container
      direction="column"
      width="80%"
      borderColor="var(--primary-color)"
      borderRadius="16px"
      wrap="nowrap"
      overflow="auto"
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
              direction="column"
              padding="4px 8px"
              sx={{ overflow: "hidden" }}
            >
              <LinearProgressWithLabel
                fileObject={fileObject}
                isActive={fileObject === currentUpload}
                onStartUpload={() => handleFileUpload(fileObject)}
              />
              <Typography>{fileObject.objectDownloadLink}</Typography>
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  );
};

export default Queue;

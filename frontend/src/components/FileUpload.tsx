import { startTransition, useContext, useOptimistic, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Upload from "./Upload";
import Queue from "./Queue";
import FileContext from "../contexts/FileContext";

const FileUpload = () => {
  const [uploadView, setUploadView] = useState(true);
  const { displayFileArray } = useContext(FileContext);

  const pending = displayFileArray.reduce((acc, group) => {
    return (
      acc +
      group.fileObject.filter(
        (file) => !file.objectFailed && !file.objectDownloadLink
      ).length
    );
  }, 0);
  const [optimisticPending, addOptimisticUpdate] = useOptimistic(pending);

  const handleComplete = () => {
    startTransition(() => {
      addOptimisticUpdate((curr) => curr - 1);
    });
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{
        backgroundColor: "var(--primary-color)",
      }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        minWidth="360px"
        height="fit-content"
        minHeight="360px"
        padding="20px"
        gap="20px"
        sx={{ backgroundColor: "var(--secondary-color)", borderRadius: "16px" }}
      >
        <Grid
          container
          width="80%"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid>
            <Button
              variant="text"
              disableRipple
              disableElevation
              onClick={() => setUploadView(true)}
              sx={{
                borderRadius: "12px",
                color: "var(--primary-text-color)",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <Typography
                fontWeight={uploadView ? "bold" : "Normal"}
                fontSize="16px"
              >
                Upload
              </Typography>
            </Button>
          </Grid>
          <Grid>
            <Button
              variant="text"
              disableRipple
              disableElevation
              onClick={() => setUploadView(false)}
              sx={{
                borderRadius: "12px",
                color: "var(--primary-text-color)",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <Typography
                fontWeight={uploadView ? "Normal" : "Bold"}
                fontSize="16px"
              >
                Queue({optimisticPending})
              </Typography>
            </Button>
          </Grid>
        </Grid>
        {uploadView ? <Upload /> : <Queue handleComplete={handleComplete} />}
      </Grid>
    </Grid>
  );
};

export default FileUpload;

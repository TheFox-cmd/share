import { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Upload from "./Upload";
import Queue from "./Queue";

const FileUpload = () => {
  const [uploadView, setUploadView] = useState(true);
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
        justifyContent="space-between"
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
                color: "var(--tertiary-text-color)",
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
                color: "var(--tertiary-text-color)",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <Typography
                fontWeight={uploadView ? "Normal" : "Bold"}
                fontSize="16px"
              >
                Queue
              </Typography>
            </Button>
          </Grid>
        </Grid>
        {uploadView ? <Upload /> : <Queue />}
      </Grid>
    </Grid>
  );
};

export default FileUpload;

//ToDo:
// 1. queue file show
// 2. Progerss bar
// 3. number file mui
// 4. show uploading
// 5. context

// cloud
// 1. fix self destruct funtion -- test

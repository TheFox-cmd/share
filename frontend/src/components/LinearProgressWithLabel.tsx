import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { DisplayObject } from "../types/types";
import { useEffect } from "react";

type LinearProgressWithLabelProps = {
  fileObject: DisplayObject;
  isActive: boolean;
  onStartUpload: () => void;
};

const LinearProgressWithLabel: React.FC<LinearProgressWithLabelProps> = ({
  fileObject,
  isActive,
  onStartUpload,
  ...props
}) => {
  useEffect(() => {
    if (isActive && !fileObject.objectDownloadLink) {
      onStartUpload();
    }
  }, [isActive, fileObject, onStartUpload]);

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        {...props}
        value={fileObject.objectProgress}
        sx={{
          height: 32,
          borderRadius: "16px",
          backgroundColor: "var(--progress-bg-color)",

          "& .MuiLinearProgress-bar": {
            backgroundColor: "var(--progress-contrast-color)",
          },
        }}
      />
      {/* Grid overlay for labels */}
      <Grid
        container
        borderRadius="16px"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          px: 1.5,
        }}
        flexWrap="nowrap"
        alignItems="center"
        justifyContent="space-between"
        gap="16px"
      >
        <Typography
          variant="body2"
          sx={{
            color: "var(--tertiary-text-color)",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {fileObject.objectName}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color:
              fileObject.objectProgress < 85
                ? "var(--progress-contrast-color)"
                : "var(--quaternary-text-color)",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          {`${Math.round(fileObject.objectProgress)}%`}
        </Typography>
      </Grid>
    </Box>
  );
};

export default LinearProgressWithLabel;

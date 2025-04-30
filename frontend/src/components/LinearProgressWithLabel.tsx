import LinearProgress from "@mui/material/LinearProgress";
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
    if (
      isActive &&
      !fileObject.objectFailed &&
      !fileObject.objectDownloadLink
    ) {
      onStartUpload();
    }
  }, [isActive, fileObject, onStartUpload]);

  return (
    <Grid
      position="relative"
      width="100%"
      padding="6px"
      sx={{ backgroundColor: "var(--primary-color)" }}
    >
      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        {...props}
        value={fileObject.objectProgress}
        sx={{
          height: 32,
          borderRadius: "8px",
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
            color: "var(--primary-text-color)",
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
            color: "var(--primary-text-color)",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          {`${Math.round(fileObject.objectProgress)}%`}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default LinearProgressWithLabel;

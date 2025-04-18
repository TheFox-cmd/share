import Grid from "@mui/material/Grid";
import { useState, useEffect, useContext } from "react";
import FileContext from "../contexts/FileContext";
import Typography from "@mui/material/Typography";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number; fileName: string }
) {
  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        {...props}
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
          {props.fileName}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color:
              props.value < 85
                ? "var(--progress-contrast-color)"
                : "var(--quaternary-text-color)",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          {`${Math.round(props.value)}%`}
        </Typography>
      </Grid>
    </Box>
  );
}

const Queue = () => {
  const { displayFileArray } = useContext(FileContext);

  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Grid width="80%" borderColor="var(--primary-color)" borderRadius="16px">
      {displayFileArray.map((fileExtensionObject, fileExtensionObjectIndex) => (
        <Grid
          key={fileExtensionObjectIndex}
          container
          justifyContent="center"
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
                value={currentProgress}
                fileName={fileObject.objectName}
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

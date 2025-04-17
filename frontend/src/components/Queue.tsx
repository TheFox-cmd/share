import Grid from "@mui/material/Grid";
import { useContext } from "react";
import FileContext from "../contexts/FileContext";
import Typography from "@mui/material/Typography";

const Queue = () => {
  const { displayFileArray } = useContext(FileContext);

  return (
    <Grid width="80%" borderColor="var(--primary-color)" borderRadius="16px">
      {displayFileArray.map((fileExtensionObject, fileExtensionObjectIndex) => (
        <Grid
          key={fileExtensionObjectIndex}
          container
          justifyContent="center"
          alignItems="center"
          direction="column"
          gap="10px"
          padding="20px"
        >
          <Typography>{fileExtensionObject.extension}</Typography>
          {fileExtensionObject.fileObject.map((fileObject, fileObjectIndex) => (
            <Grid
              key={fileObjectIndex}
              container
              justifyContent="center"
              alignItems="center"
              direction="column"
              gap="10px"
              padding="20px"
            >
              <Typography>{fileObject.objectName}</Typography>
              <Typography>{fileObject.objectDownloadLink}</Typography>
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  );
};

export default Queue;

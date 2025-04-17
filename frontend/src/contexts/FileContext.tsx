import { createContext } from "react";
import { DisplayFileObject } from "../types/types";

type FileContextType = {
  displayFileArray: DisplayFileObject[];
  setDisplayFileArray: React.Dispatch<
    React.SetStateAction<DisplayFileObject[]>
  >;
};

const FileContext = createContext<FileContextType>({
  displayFileArray: [],
  setDisplayFileArray: () => {},
});

export default FileContext;

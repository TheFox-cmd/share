import { useState } from "react";
import FileUpload from "./components/FileUpload";
import { DisplayFileObject } from "./types/types";
import FileContext from "./contexts/FileContext";

function App() {
  const [displayFileArray, setDisplayFileArray] = useState<DisplayFileObject[]>(
    []
  );

  return (
    <>
      <FileContext.Provider value={{ displayFileArray, setDisplayFileArray }}>
        <FileUpload />
      </FileContext.Provider>
    </>
  );
}

//TODO:
// *. ui
// *. handle multiple rounds of upload
// *. handle delete button
// *. handle copy button
// *. serverless self-destruct function
// *. deploy

export default App;

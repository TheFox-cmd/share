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
// *. handle error return ui
// *. handle delete button
// *. serverless self-destruct function
// *. deploy

export default App;

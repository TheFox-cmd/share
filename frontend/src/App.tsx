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
// *. on error still return
// *. ui
// *. severless self-destruct function
// *. handle multiple rounds of upload
// *. handle delete button
// *. deploy

export default App;

import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadURL, setUploadURL] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0])
      setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const uploadEndpointURL = "http://127.0.0.1:8000/upload";
    try {
      const response = await axios.post(uploadEndpointURL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadURL(response.data.tinyURL);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      {uploadURL && <div>{uploadURL}</div>}
    </div>
  );
};

export default FileUpload;

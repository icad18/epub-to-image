import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("epub", file);

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Ambil gambar hasil konversi dari response backend
      const { htmlFile } = response.data;
      const imageUrl = `http://localhost:5000/uploads/${htmlFile}`;

      setImageSrc(imageUrl);
      setLoading(false);
    } catch (err) {
      setError("Failed to upload or convert the file.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload EPUB and Convert to Image</h1>
      <form onSubmit={onSubmit}>
        <input type="file" accept=".epub" onChange={onFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload EPUB"}
        </button>
      </form>
      
      {error && <p style={{ color: "red" }}>{error}</p>}

      {imageSrc && <img src={imageSrc} alt="Converted Image" />}
    </div>
  );
}

export default App;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/UI/CustomButton/CustomButton";
import Title from "../components/UI/Title/Title";

const MainPage = () => {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState<string>("");

  // Типизация события изменения инпута
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="background-main">
      <div className="container">
        <div className="rectangle-reg fade-in">
          <Title>Upload your CSV file</Title>

          <div className="upload-section fade-in fade-in-delay">
            <input
              type="file"
              accept=".csv"
              id="fileInput"
              className="file-input"
              onChange={handleFileUpload}
            />
            <label htmlFor="fileInput" className="upload-file">
              Choose File
            </label>
            {fileName && <p className="file-name">📂 Selected: {fileName}</p>}
            {fileName && (
              <CustomButton onClick={() => navigate("/")}>
                Process ⚙️
              </CustomButton>
            )}
          </div>

          <div className="button-wrapper">
            <CustomButton onClick={() => navigate("/")}>Logout ↩</CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

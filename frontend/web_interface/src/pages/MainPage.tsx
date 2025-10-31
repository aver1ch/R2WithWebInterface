import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState<string>('');

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
        <div className="rectangle-black-reg fade-in">
          <h1 className="header-logreg">Upload your CSV file</h1>

          <div className="upload-section fade-in fade-in-delay">
            <input 
              type="file" 
              accept=".csv"
              id="fileInput"
              className="file-input"
              onChange={handleFileUpload}
            />
            <label htmlFor="fileInput" className="upload-button">
              Choose File
            </label>
          </div>

          {fileName && <p className="file-name">📂 Selected: {fileName}</p>}

          <div className="button-wrapper">
            <button 
              className="reg-button-black back-button"
              onClick={() => navigate('/')}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;

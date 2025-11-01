import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/UI/CustomButton/CustomButton";
import Title from "../components/UI/Title/Title";
import { useTranslation } from "react-i18next";
import { uploadCSVFile } from "../api/api";

const MainPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.log(file);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(null);
    setFileName("");
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        setError(t("mainPage.invalidFileType") || "Please select a CSV file");
        return;
      }

      setFileName(selectedFile.name);
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await uploadCSVFile(file);

      console.log("result:", result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "File upload error");
      console.error("Upload error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="background-main">
      <div className="container">
        <div className="rectangle-reg fade-in">
          <Title className="fade-in fade-in-delay">{t("mainPage.title")}</Title>

          <div className="upload-section fade-in fade-in-delay">
            <input
              type="file"
              accept=".csv"
              id="fileInput"
              className="file-input"
              onChange={handleFileUpload}
            />
            <label htmlFor="fileInput" className="upload-file">
              {t("mainPage.chooseFile")}
            </label>
            {error && <p style={{ color: "red", margin: "5px" }}>{error}</p>}
            {fileName && (
              <p className="file-name">
                📂 {t("mainPage.selected")}: {fileName}
              </p>
            )}
            {fileName && (
              <CustomButton onClick={handleProcess} disabled={isLoading}>
                {t("mainPage.process")}
              </CustomButton>
            )}
          </div>

          <div className="button-wrapper">
            <CustomButton
              className="fade-in fade-in-delay"
              onClick={() => navigate("/")}
            >
              {" "}
              {t("mainPage.logout")}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

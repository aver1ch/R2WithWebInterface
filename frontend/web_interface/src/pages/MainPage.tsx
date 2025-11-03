import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/UI/CustomButton/CustomButton";
import Title from "../components/UI/Title/Title";
import { useTranslation } from "react-i18next";
import { uploadCSVFile } from "../api/api";
import { useDropzone } from "react-dropzone";

const MainPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [parameter, setParameter] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        if (!selectedFile.name.endsWith(".csv")) {
          setError(t("mainPage.invalidFileType") || "Please select a CSV file");
          setFile(null);
          setFileName("");
          return;
        }

        setFileName(selectedFile.name);
        setFile(selectedFile);
        setError(null);
      }
    },
    [t]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
    maxFiles: 1,
  });

  console.log(file);

  const handleProcess = async () => {
    if (!file) return;
    if (!parameter) {
      setError(t("mainPage.parameterError"));
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const result = await uploadCSVFile(file, Number(parameter));

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
            <div
              {...getRootProps({ className: "dropzone" })}
              className="dnd-field"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>{t("mainPage.dropHere") || "Drop the file here..."}</p>
              ) : (
                <p>
                  {t("mainPage.dragHere") ||
                    "Drag & drop CSV here, or click to select"}
                </p>
              )}
            </div>
            {error && <p style={{ color: "red", margin: 5 }}>{error}</p>}
            {fileName && (
              <p className="file-name">
                📂 {t("mainPage.selected")}: {fileName}
              </p>
            )}

            <input
              type="text"
              list="values"
              placeholder={t("mainPage.enterParameter")}
              className="parameter-field"
              value={parameter}
              onChange={(e) => {
                setParameter(e.target.value);
              }}
            />
            <datalist id="values">
              <option>0.7</option>
              <option>0.8</option>
              <option>0.9</option>
            </datalist>
            {file && (
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
              {t("mainPage.logout")}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/UI/CustomButton/CustomButton";
import Title from "../components/UI/Title/Title";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import { CustomInput } from "../components/UI/CustomInput/CustomInput";
import Sidebar from "./Sidebar";
import { useTheme } from "../hooks/useTheme";

const MainPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [parameter, setParameter] = useState<string | number>("");
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        setFileName(selectedFile.name);
        setFile(selectedFile);
        setError(null);
      }
    },
    []
  );

  const onDropRejected = useCallback(
    (fileRejections: any[]) => {
      setError(t("mainPage.invalidFileType"));
      setFile(null);
      setFileName("");
    },
    [t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { "text/csv": [".csv"] },
    multiple: false,
    maxFiles: 1,
    onDragEnter: undefined,
    onDragOver: undefined,
    onDragLeave: undefined
  });

  const handleProcess = async () => {
    setIsLoading(false)
    console.log(error)
    if (!file) return;

    const value = Number(parameter)

    if (!Number.isFinite(value) || value < 0 || value > 1) {
      setError(t("mainPage.parameterError"));
      return;
    }
    setError(null);
    setIsLoading(true);
    // try {
    //   const result = await uploadCSVFile(file, Number(parameter));

    // } catch (e) {
    //   setError(e instanceof Error ? e.message : "File upload error");
    //   console.error("Upload error:", e);
    // } finally {
    //   setIsLoading(false);
    // }
  };
  return (
    <div className="background-main">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        title={t("mainPage.historyTitle")}
        items={["file1.csv", "file2.csv", "file3.csv"]}
      />

      <div className="container">
        <div className="rectangle-processing fade-in">
          <div className="title-processing-wrapper">
            <Title className="fade-in fade-in-delay" style={{ fontSize: '47px', fontWeight: '500', marginBottom: '7px' }}>{t("mainPage.title")}</Title>
            <div className="faq fade-in fade-in-delay">
              <img src="/faq.png" alt="FAQ" className="faq-icon" />
              <div className="faq-popover">
                <div className="faq-title">{t("mainPage.faqTitle")}</div>
                <div className="faq-text">{t("mainPage.faqDescription")}</div>
              </div>
            </div>
          </div>

          <div className="upload-section fade-in fade-in-delay">
            <div
              {...getRootProps({ className: "dropzone" })}
              className="dnd-field"
            >
              <input {...getInputProps()} type="file" />
              <img
                src={"/dndicon.png"}
                alt='File icon'
                width="30"
              />
              {isDragActive ? (
                <p>{t("mainPage.dropHere")}</p>
              ) : (
                <p>
                  {t("mainPage.dragHere")}
                </p>
              )}
            </div>
            {error && <p style={{ color: "red", margin: 5 }}>{error}</p>}
            {fileName && (
              <p className="file-name">
                📂 {t("mainPage.selected")}: {fileName}
              </p>
            )}
            {file && <p style={{ textAlign: 'left', alignSelf: 'flex-start', color: 'white', marginTop: '20px' }}>{t("mainPage.parameter")}</p>}
            {file && <CustomInput
              type="text"
              list="values"
              placeholder={t("mainPage.enterParameter")}
              className="parameter"
              value={parameter}
              onChange={(e) => {
                setParameter(e.target.value);
              }}
              style={{ width:"100%", marginBottom: '25px', height: '70px', textAlign: 'left' }}
            />}
            <datalist id="values">
              <option>0.7</option>
              <option>0.8</option>
              <option>0.9</option>
            </datalist>
            {file && (
              <CustomButton onClick={handleProcess} disabled={isLoading} style={{ fontWeight: '600' }}>
                {t("mainPage.process")}
              </CustomButton>
            )}
          </div>

          <div className="button-wrapper">
            <CustomButton
              className="fade-in fade-in-delay"
              onClick={() => navigate("/")}
              style={{ width: '465px', fontWeight: '500' }}
            >
              {t("mainPage.logout")}
            </CustomButton>
          </div>
        </div>
      </div>
      <button className="sidebar-icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <img src='/sidebar.png' alt='Sidebar' />
      </button>
    </div>
  );
};

export default MainPage;

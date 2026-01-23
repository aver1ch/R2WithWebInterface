import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Title from "../components/UI/Title/Title";
import CustomButton from "../components/UI/CustomButton/CustomButton";
import Sidebar from "./Sidebar";

const ResultPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // временно (потом заменишь на реальные данные)
    const historyItems = ["file1.csv", "file2.csv", "file3.csv"];

    const handleDownload = () => {
        // TODO: здесь будет скачивание файла/отчёта
        console.log("download");
    };

    return (
        <div className="background-main">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                title={t("resultPage.historyTitle") || t("mainPage.historyTitle")}
                items={historyItems}
            />

            <div className="container">
                <div className="rectangle-result fade-in">
                    <Title
                        className="fade-in fade-in-delay"
                        style={{ fontSize: "34px", fontWeight: "500", marginBottom: "20px" }}
                    >
                        {t("resultPage.title") || "RESULTS"}
                    </Title>

                    <div className="result-content">
                        <img
                            src="data:image/png;base64,{plot_base64}"
                            alt="Result plot"
                            className="result-plot"
                        />

                        <div className="result-formula">
                            {/* потом подставишь реальную формулу */}
                            y = … + … + …
                        </div>

                        <div className="result-buttons">
                            <CustomButton onClick={handleDownload} style={{ width: "220px" }}>
                                {t("resultPage.download") || "DOWNLOAD"}
                            </CustomButton>

                            <CustomButton
                                onClick={() => navigate("/MainPage")}
                                style={{ width: "220px", fontWeight: 500 }}
                            >
                                {t("resultPage.exit") || "EXIT"}
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* кнопка открытия сайдбара слева сверху */}
            <button
                className="sidebar-icon sidebar-icon-top"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Open sidebar"
            >
                <img src="/sidebar.png" alt="Sidebar" />
            </button>
        </div>
    );
};

export default ResultPage;

import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import CustomButton from "../components/UI/CustomButton/CustomButton";
import Title from "../components/UI/Title/Title";
import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "react-i18next";

const Welcome = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const { t, i18n } = useTranslation();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ru" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="background-main">
      <div className="container">
        <div className="rectangle fade-in">
          <Title className="fade-in fade-in-delay">{t("welcome.title")}</Title>
          <p className="text-main fade-in fade-in-delay">
            {t("welcome.description")}
          </p>
          <CustomButton
            className="fade-in fade-in-delay"
            onClick={() => navigate("/Login")}
          >
            {t("welcome.login")}
          </CustomButton>

          <p className="login-text fade-in fade-in-delay">
            {t("welcome.haveNotAccount")}
            <span className="login-link" onClick={() => navigate("/Register")}>
              {t("welcome.createAccount")}
            </span>
          </p>
          <button
            className="theme-button fade-in fade-in-delay"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <img
              src={theme === "dark" ? "/lighttheme.svg" : "/sun.png"}
              alt="Theme"
              className="theme-icon"
            />
          </button>
          <button
            className="language-button fade-in fade-in-delay"
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            {i18n.language === "en" ? "EN" : "RU"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

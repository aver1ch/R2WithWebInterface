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
        <div className="rectangle">
          {/* Левая колонка */}
          <div className="welcome-left">
            <Title
              className="fade-in fade-in-delay"
              style={i18n.language === "en" ? { fontSize: "55px" } : { fontSize: '48px' }}
            >
              {t("welcome.title")}
            </Title>

            <CustomButton
              className="welcome-button fade-in fade-in-delay"
              onClick={() => navigate("/Register")}
              style={{ minHeight: "71px", fontSize: '30px', maxHeight: '150px', height: '100%' }}
            >
              {t("welcome.createAccount")}
            </CustomButton>

            <p className="login-text fade-in fade-in-delay">
              {t("welcome.alreadyExists")}{" "}
              <span className="login-link" onClick={() => navigate("/Login")}>
                {t("welcome.signIn")}
              </span>
            </p>
          </div>

          {/* Правая колонка */}
          <div className="welcome-right fade-in fade-in-delay">
            <p
              className="text-main"
              style={i18n.language === "en" ? { fontSize: "24px" } : { fontSize: '24px' }}
            >
              {t("welcome.description")}
            </p>
          </div>
        </div>

        {/* Corner controls */}
        <div className="corner-controls fade-in fade-in-delay">
          <button
            className="corner-button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            type="button"
          >
            <img
              src={theme === "dark" ? "/lighttheme.svg" : "/sun.png"}
              alt="Theme"
              className="corner-icon"
            />
          </button>

          <button
            className="corner-label-button"
            onClick={toggleLanguage}
            aria-label="Toggle language"
            type="button"
          >
            {i18n.language === "en" ? "EN" : "RU"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import CustomButton from "../components/UI/CustomButton/CustomButton";
import Title from "../components/UI/Title/Title";
import { useTheme } from "../hooks/useTheme";

const Welcome = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  console.log(theme);

  return (
    <div className="background-main">
      <div className="container">
        <div className="rectangle fade-in">
          <Title className="fade-in fade-in-delay">
            Regression Model Fitting
          </Title>
          <p className="text-main fade-in fade-in-delay">
            Upload a CSV file with your data — and get an optimal regression
            curve with calculated weights and visualized graphs, all available
            for download.
          </p>
          <CustomButton
            className="fade-in fade-in-delay"
            onClick={() => navigate("/Register")}
          >
            Create an account
          </CustomButton>

          <p className="login-text fade-in fade-in-delay">
            Already exists?{" "}
            <span className="login-link" onClick={() => navigate("/Login")}>
              Sign In
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
        </div>
      </div>
    </div>
  );
};

export default Welcome;

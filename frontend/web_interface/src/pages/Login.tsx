import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/UI/CustomButton/CustomButton";
import { CustomInput } from "../components/UI/CustomInput/CustomInput";
import Title from "../components/UI/Title/Title";
import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "react-i18next";
import { loginUser } from "../api/api";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!login.trim() || !password.trim()) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await loginUser({ login, password });

      if (result.token) {
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      navigate("/MainPage");
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Ошибка входа";
      setError(errorMessage);
      console.error("Login error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="background-main">
      <div className="container">
        <div className="rectangle-reg fade-in">
          <Title
            style={{
              fontWeight: "300",
              color: theme === "dark" ? "#fff" : "#000",
            }}
          >
            {t("login.title")}
          </Title>
          <form onSubmit={handleSubmit} className="auth-field">
            <CustomInput
              type="text"
              placeholder={t("login.loginPlaceholder")}
              value={login}
              onChange={(e) => {
                setLogin(e.target.value);
                setError(null);
              }}
              required
              disabled={isLoading}
              className={theme === 'light' ? 'light' : 'dark'}

            />
            <div className="password-field">
              <CustomInput
                type={visible ? "text" : "password"}
                placeholder={t("login.passwordPlaceholder")}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                style={{ border: "none" }}
                onClick={() => setVisible(!visible)}
                aria-label={t("login.showPassword")}
                disabled={isLoading}
              >
                {theme === "light" ? (
                  <img
                    src={visible ? "/lighteye.svg" : "/lightclosedeye.svg"}
                    alt={t("login.showPassword")}
                    width="30"
                    className="show-password"
                  />
                ) : (
                  <img
                    src={visible ? "/darkeye.svg" : "/darkclosedeye.svg"}
                    alt={t("login.showPassword")}
                    width="30"
                    className="show-password"
                  />
                )}
              </button>
            </div>

            {error && (
              <p
                style={{ color: "red", marginTop: "10px", textAlign: "center" }}
              >
                {error}
              </p>
            )}

            <div className="button-wrapper">
              <CustomButton
                className="reg-button"
                type="submit"
                disabled={isLoading}
                style={{ fontWeight: 700, maxWidth: '361px', backgroundColor: theme === 'dark' ? "#fff" : "#005ADD", color: theme === 'dark' ? "#000" : "#fff" }}
              >
                {isLoading
                  ? t("login.processing") || "Processing..."
                  : t("login.signIn")}
              </CustomButton>
              <CustomButton
                className="reg-button back-button"
                onClick={() => navigate("/")}
                disabled={isLoading}
                style={{ maxWidth: '361px', backgroundColor: theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.1)', fontWeight: 500 }}
              >
                {t("login.back")}
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

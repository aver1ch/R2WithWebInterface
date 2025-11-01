import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/UI/CustomButton/CustomButton";
import { CustomInput } from "../components/UI/CustomInput/CustomInput";
import Title from "../components/UI/Title/Title";
import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "react-i18next";
import { registerUser } from "../api/api";

const Register = () => {
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

    if (!login.trim()) {
      setError("Пожалуйста, введите логин");
      return;
    }
    if (!password.trim()) {
      setError("Пожалуйста, введите пароль");
      return;
    }

    setIsLoading(true);
    setError(null);
    navigate("/MainPage"); // TODO убрать навигацию после того как бэк доделает авторизацию, сделано для теста страницы обработки

    try {
      const result = await registerUser({ login, password });

      if (result.token) {
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      navigate("/MainPage");
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Ошибка регистрации";
      setError(errorMessage);
      console.error("Registration error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="background-main">
      <div className="container">
        <div className="rectangle-reg fade-in">
          <Title>{t("register.title")}</Title>
          <form onSubmit={handleSubmit} className="auth-field">
            <CustomInput
              type="text"
              placeholder={t("register.loginPlaceholder")}
              value={login}
              onChange={(e) => {
                setLogin(e.target.value);
                setError(null);
              }}
              required
              disabled={isLoading}
            />
            <div className="password-field">
              <CustomInput
                type={visible ? "text" : "password"}
                placeholder={t("register.passwordPlaceholder")}
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
                aria-label={t("register.showPassword")}
                disabled={isLoading}
              >
                {theme === "light" ? (
                  <img
                    src={visible ? "/lighteye.svg" : "/lightclosedeye.svg"}
                    alt={t("register.showPassword")}
                    width="30"
                    className="show-password"
                  />
                ) : (
                  <img
                    src={visible ? "/darkeye.svg" : "/darkclosedeye.svg"}
                    alt={t("register.showPassword")}
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
              <CustomButton type="submit" disabled={isLoading}>
                {isLoading
                  ? t("register.processing") || "Processing..."
                  : t("register.signIn")}
              </CustomButton>
              <CustomButton onClick={() => navigate("/Welcome")}>
                {t("register.back")}
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

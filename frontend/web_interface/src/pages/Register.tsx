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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
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
      const result = await registerUser({ email, password });

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
          <Title
            style={{
              fontWeight: "300",
              fontSize: '45px',
              color: theme === "dark" ? "#fff" : "#000",
            }}
          >
            {t("register.title")}
          </Title>
          <form onSubmit={handleSubmit} className="auth-field">
            <CustomInput
              type="text"
              placeholder={t("register.loginPlaceholder")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              required
              disabled={isLoading}
              className={theme === 'light' ? 'light' : 'dark'}
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
                className={theme === 'light' ? 'light' : 'dark'}
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
              <CustomButton
                className="reg-button"
                type="submit"
                disabled={isLoading}
                style={{ fontWeight: 700, fontSize: '20px', maxWidth: '361px', backgroundColor: theme === 'dark' ? "#fff" : "#005ADD", color: theme === 'dark' ? "#000" : "#fff" }}

              >
                {isLoading
                  ? t("register.processing") || "Processing..."
                  : t("register.signIn")}
              </CustomButton>
              <CustomButton
                onClick={() => navigate("/Welcome")}
                style={{ maxWidth: '361px', backgroundColor: theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.1)', fontWeight: 400 }}

              >
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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/UI/CustomButton/CustomButton";
import { CustomInput } from "../components/UI/CustomInput/CustomInput";
import Title from "../components/UI/Title/Title";
import { useTheme } from "../hooks/useTheme";

const Register = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/MainPage");
  };

  return (
    <div className="background-main">
      <div className="container">
        <div className="rectangle-reg fade-in">
          <Title>Sign up</Title>
          <form onSubmit={handleSubmit}>
            <CustomInput
              type="text"
              placeholder="Enter your login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
            <div className="password-field">
              <CustomInput
                type={visible ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                style={{ border: "none" }}
                onClick={() => setVisible(!visible)}
              >
                {theme === "light" ? (
                  <img 
                    src={visible ? "/lighteye.svg" : "/lightclosedeye.svg"}
                    alt="Show password"
                    width="30"
                    className="show-password"
                  />
                ) : (
                  <img
                    src={visible ? "/darkeye.svg" : "/darkclosedeye.svg"}
                    alt="Show password"
                    width="30"
                    className="show-password"
                  />
                )}
              </button>
            </div>
            <div className="button-wrapper">
              <CustomButton type="submit">Sign In</CustomButton>
              <CustomButton onClick={() => navigate("/Welcome")}>
                Back
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

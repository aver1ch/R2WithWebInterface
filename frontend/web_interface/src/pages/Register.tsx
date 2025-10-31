import React from 'react'
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    // Здесь позже можно будет добавить отправку данных на backend
    navigate('/MainPage'); // Переход на страницу загрузки файлов
  };

  return (
    <div className='background-main'>
      <div className="container">
        <div className="rectangle-black-reg fade-in">
          <h1 className='header-logreg'>Registration</h1>

          <input 
            type="text" 
            placeholder="Enter your login" 
            className="input-field"
          />

          <input 
            type="password" 
            placeholder="Enter your password" 
            className="input-field"
          />

          <div className="button-wrapper">
            <button 
              className="reg-button-black" 
              onClick={handleRegister}
            >
              Sign Up
            </button>
            <button 
              className="reg-button-black back-button" 
              onClick={() => navigate('/Welcome')}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register;

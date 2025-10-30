import React from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className='background-main'>
      <div className="container">
        <div className="rectangle-black-reg fade-in">
          <h1 className='header-main'>Login</h1>

          {/* Поле логина */}
          <input 
            type="text" 
            placeholder="Enter your login" 
            className="input-field"
          />

          {/* Поле пароля */}
          <input 
            type="password" 
            placeholder="Enter your password" 
            className="input-field"
          />

          {/* Кнопки */}
          <div className="button-wrapper">
            <button className="reg-button-black">Sign In</button>
            <button 
              className="reg-button-black back-button" 
              onClick={() => navigate('/')}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

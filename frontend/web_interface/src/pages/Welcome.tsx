import React from 'react'
import '../styles/App.css'

const Login = () => {
  return (
    <div className='background-main'>
      <div className="container">
        <div className="rectangle-black">
          <h1 className='header-main fade-in'>Regression Model Fitting</h1>
          <p className='text-main-blacktheme fade-in fade-in-delay'>
            Upload a CSV file with your data — and get an optimal regression curve with calculated weights and visualized graphs, all available for download.
          </p>
          <div className="button-wrapper fade-in fade-in-delay">
  <button className="reg-button-black">Create an account</button>
</div>

          <p className="login-text fade-in fade-in-delay">
            Уже существует?{' '}
            <a href="#" className="login-link">Войти</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login;

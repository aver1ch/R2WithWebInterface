import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/App.css'

const Welcome = () => {
  const navigate = useNavigate();
  return (
    
    <div className='background-main'>
      <div className="container">
        <div className="rectangle-black fade-in">
          <h1 className='header-main fade-in'>Regression Model Fitting</h1>
          <p className='text-main-blacktheme fade-in fade-in-delay'>
            Upload a CSV file with your data — and get an optimal regression curve with calculated weights and visualized graphs, all available for download.
          </p>
          <div className="button-wrapper fade-in fade-in-delay" >
          <button className="reg-button-black" onClick={() => navigate('/Register')}>Create an account</button>
    </div>

           <p className="login-text fade-in fade-in-delay">
            Already exists?{' '}
            <span 
              className="login-link" 
              onClick={() => navigate('/Login')}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Welcome;

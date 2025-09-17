import React from 'react';
import './register.css'; 
import { Link, useNavigate } from 'react-router-dom';


function Register() {
     const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/congrats');
  };
  return (
    <div className="full-screen-container">
      <div className="register-card">
        <div className="title-container">
          <img src="https://res.cloudinary.com/dvucimldu/image/upload/v1758077450/popcorn-png-3_j8rfe9.png" alt="Left Icon" className="title-image" />
          <h1 className="register-title">Create Account</h1>
          <img src="https://res.cloudinary.com/dvucimldu/image/upload/v1758077450/popcorn-png-3_j8rfe9.png" alt="Right Icon" className="title-image" />
        </div>
        <div className="register-form">
          <input type="text" placeholder="Username" className="register-input" />
          <input type="email" placeholder="Email" className="register-input" />
          <input type="email" placeholder="Confirm Email" className="register-input" />
          <input type="password" placeholder="Password" className="register-input" />
          <input type="password" placeholder="Confirm Password" className="register-input" />
           <button className="register-button" onClick={handleRegisterClick}>
            Register
          </button>
        </div>
        <div className="register-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
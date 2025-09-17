import React from 'react';
import { Link } from 'react-router-dom';
import './welcomePage.css';

function WelcomePage() {
  return (
    <div className="full-screen-container">
      <div className="welcome-card">
        <h1 className="welcome-title">Welcome</h1>
        <div className="welcome-links">
          <Link to="/login" className="welcome-link">Login</Link>
          <span className="link-separator">|</span>
          <Link to="/register" className="welcome-link">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
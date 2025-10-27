import React from "react";
import "./congratsPage.css";
import { Link } from "react-router-dom";
import logo from "../logo512.png";

function CongratsPage() {
  return (
    <div className="congrats-container">
      <div className="congrats-card">
        <img src={logo} alt="Logo" className="congrats-logo" />

        <h1 className="congrats-title">Success!</h1>

        <div className="congrats-content">
          <img
            src="https://res.cloudinary.com/dvucimldu/image/upload/c_crop,w_1500,h_1500,ar_1:1/v1761579464/istockphoto-1449647446-612x612_h5snis.png"
            alt="Popcorn Character"
            className="popcorn-image"
          />
          <p className="congrats-message">
            Verification Email <br /> Sent Successfully 🎉
          </p>
        </div>

        <Link to="/login" className="login-button-link">
          <button className="congrats-button">Go to Login</button>
        </Link>
      </div>
      <div className="confetti"></div>
    </div>
  );
}

export default CongratsPage;

import React from "react";
import "./congratsPage.css";
import { Link } from "react-router-dom";
import logo from "../logo512.png";

function CongratsPage() {
  return (
    <div className="bodyDiv">
      <header className="mainHeader">
              <div className="headerDiv">
                <div className="logoDiv">
                  <img src={logo} alt="Logo" className="logo" />
                  <span className="spanner">Absolute Cinema</span>
                </div>
                <div className="navBar">
                  <a href="/movies" className="buttons">
                    Movies
                  </a>
                  <a href="/showtimes" className="buttons">
                    Showtimes
                  </a>
                  <a href="/theaters" className="buttons">
                    Theaters
                  </a>
                  <a href="/" className="buttons">
                    About
                  </a>
                </div>
                <div className="navDiv">
                  <a href="/login" className="buttons">
                    Sign In
                  </a>
                  <a href="/register" className="buttons">
                    Sign Up
                  </a>
                </div>
              </div>
            </header>
      <section className="contentSection">
        <section className="bodySection">
          <div className="bodyTextDiv">
            <div className="title-container">
              <h1 className="congrats-title">Success!</h1>
              <div className="congrats-content">
                <img
                  src="https://res.cloudinary.com/dvucimldu/image/upload/v1758078736/pngtree-cute-cartoon-popcorn-dancing-png-image_13755566_bcqr2z.png"
                  alt="Popcorn Character"
                  className="popcorn-image"
                />
                <p className="congrats-message">
                  Verification
                  <br />
                  Email Sent
                </p>
              </div>
              <Link to="/login" className="login-button-link">
                <button className="congrats-button">Login Page</button>
              </Link>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default CongratsPage;

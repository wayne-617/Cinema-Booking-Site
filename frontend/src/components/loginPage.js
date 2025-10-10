import React from "react";
import "./loginPage.css";
import logo from "../logo512.png";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div className="bodyDiv">
      <header className="mainHeader">
        <div className="headerDiv">
          <div className="logoDiv">
            <img src={logo} alt="Logo" className="logo" />
            <span className="spanner">Absolute Cinema</span>
          </div>
          <div className="navBar">
            <a href="/login" className="buttons">
              Movies
            </a>
            <a href="/login" className="buttons">
              Showtimes
            </a>
            <a href="/login" className="buttons">
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
              <h1 className="login-title">Login</h1>
              <Link to="/" className="home-icon-link">
                <img
                  src="https://res.cloudinary.com/dvucimldu/image/upload/v1758079916/25694_hes64r.png"
                  alt="Home"
                  className="home-icon"
                />
              </Link>
            </div>

            <div className="login-form">
              <input
                type="text"
                placeholder="Username"
                className="login-input"
              />
              <input
                type="password"
                placeholder="Password"
                className="login-input"
              />
              <button className="login-button">Sign In</button>
            </div>
            <div className="login-footer">
              Don’t have an account? <Link to="/register">Register</Link>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default LoginPage;

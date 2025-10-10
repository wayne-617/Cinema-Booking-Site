import React from "react";
import "./register.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/congrats");
  };
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
            <input
              type="text"
              placeholder="Username"
              className="register-input"
            />
            <input
              type="email"
              placeholder="Email"
              className="register-input"
            />
            <input
              type="email"
              placeholder="Confirm Email"
              className="register-input"
            />
            <input
              type="password"
              placeholder="Password"
              className="register-input"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="register-input"
            />
            <button className="register-button" onClick={handleRegisterClick}>
              Register
            </button>
          </div>
          <div className="bodyTextDiv">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </section>
      </section>
      <section className="bottomSection">
        <div className="primaryDiv">
          <footer className="mainFooter"></footer>
        </div>
      </section>
    </div>
  );
}
export default Register;

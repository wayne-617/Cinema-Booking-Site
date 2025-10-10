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

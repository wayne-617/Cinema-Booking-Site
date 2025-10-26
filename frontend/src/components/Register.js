import React from "react";
import "./register.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    const phone = document.getElementById("myPhone");
    const emailaddr = document.getElementById("myEmail");
    const pass = document.getElementById("myPass");
    const username = document.getElementById("myName");

    if (
      username.value === "admin" &&
      emailaddr.value === "admin@user.com" &&
      phone.value === "1234567890" &&
      pass.value === "masterkey"
    ) {
      navigate("/admin");
    } else {
      navigate("/congrats");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <img src={logo} alt="Logo" className="register-logo" />
        <h1 className="register-title">Create Your Account</h1>

        <div className="input-group">
          <input type="text" placeholder="Full Name" id="myName" />
          <input type="tel" placeholder="Phone Number" className="register-input" id="myPhone" />
          <input type="email" placeholder="Email Address" className="register-input" id="myEmail" />
          <input type="password" placeholder="Password" className="register-input" id="myPass" />
        </div>

        <button className="register-btn" onClick={handleRegisterClick}>
          Register
        </button>

        <p className="register-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

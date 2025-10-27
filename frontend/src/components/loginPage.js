import React, { useState } from "react";
import "./loginPage.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [shake, setShake] = useState(false);

 const handleLoginClick = async () => {
  const emailInput = document.getElementById("myEmail");
  const passInput = document.getElementById("myPass");

  const fetchLink = `http://localhost:9090/auth/login`;

  try {
    const response = await fetch(fetchLink, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: emailInput.value,
        password: passInput.value,
      }),
    });

    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (response.ok) {
      navigate("/customer");
    }else if (response.ok && emailInput === "admin@user.com") {
      navigate("/admindashboard");
    } else {
      // Show cleaner feedback
      const message =
        data.error === "Password incorrect"
          ? "Incorrect password."
          : "Incorrect username or password.";
      setErrorMessage(message);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  } catch (error) {
    // Only true connection errors go here
    setErrorMessage("Server unavailable. Please try again later.");
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }
};

  return (
    <div className="loginPage-container">
      {/* fade animation stays here */}
      <div className="loginPage-card">
        <img src={logo} alt="Logo" className="loginPage-logo" />
        <h1 className="loginPage-title">Welcome Back</h1>

        {errorMessage && <p className="loginPage-error">{errorMessage}</p>}

        {/* ✅ shake animation applied only to this section */}
        <div className={`loginPage-form ${shake ? "shake" : ""}`}>
          <input
            type="email"
            placeholder="Email"
            className="loginPage-input"
            id="myEmail"
          />
          <input
            type="password"
            placeholder="Password"
            className="loginPage-input"
            id="myPass"
          />
          <button className="loginPage-button" onClick={handleLoginClick}>
            Sign In
          </button>
        </div>

        <div className="loginPage-footer">
          <p>
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
          <p>
            <Link to="/forgetPassword">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

import React, { useState } from "react";
import "./loginPage.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


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

  console.log("Response status:", response.status);

  let text = await response.text(); // get raw response first
  console.log("Raw response text:", text);

  let data = {};
  try {
        data = JSON.parse(text);
        console.log("Parsed JSON data:", data);
      } catch (err) {
        console.error("Failed to parse JSON:", err);
      }

      if (response.ok) {
    const decoded = jwtDecode(data.token);
    console.log("Decoded token:", decoded);

    localStorage.setItem(
      "user",
      JSON.stringify({
        fullName: decoded.fullName || "User User",
        username: decoded.sub,  // 'sub' is often the email/username
        role: decoded.role,
        token: data.token,
      })
    );

    // Redirect based on role
    if (decoded.role === "ADMIN") {
      navigate("/admindashboard");
    } else {
      navigate("/customer");
    }

    setTimeout(() => window.location.reload(), 100);
    } else {
      const message =
        data.error === "Password incorrect"
          ? "Incorrect password."
          : "Incorrect username or password.";
      setErrorMessage(message);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  } catch (error) {
    console.error("Network or server error:", error);
    setErrorMessage("Server unavailable. Please try again later.");
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  };

  return (
    <div className="loginPage-container">
      <div className="loginPage-card">
        <img src={logo} alt="Logo" className="loginPage-logo" />
        <h1 className="loginPage-title">Welcome Back</h1>

        <div className={`loginPage-form ${shake ? "shake" : ""}`}>
          {errorMessage && <p className="loginPage-error">{errorMessage}</p>}
          <input type="email" placeholder="Email" className="loginPage-input" id="myEmail" />
          <input type="password" placeholder="Password" className="loginPage-input" id="myPass" />
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

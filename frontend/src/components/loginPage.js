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

      const text = await response.text();
      let data = {};

      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Could not parse JSON:", err);
      }

      if (!response.ok) {
        const message =
          data.error === "Password incorrect"
            ? "Incorrect password."
            : data.error;
        setErrorMessage(message);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }

      // ✅ decode JWT
      const decoded = jwtDecode(data.token);

    

      // 🔥 Also save user object
      const fullName = decoded.fullName || "User User";
      const firstName = fullName.split(" ")[0];

      localStorage.setItem(
        "user",
        JSON.stringify({
          fullName,
          firstName,
          username: decoded.sub,
          role: decoded.role,
          userId: decoded.userId,
          token: data.token // ✅ ADD THIS
        })
      );

      // 🧭 Redirect based on role
      if (decoded.role === "ADMIN") {
        navigate("/admindashboard");
      } else {
        navigate("/customer");
      }

      // refresh UI
      setTimeout(() => window.location.reload(), 100);

    } catch (err) {
      console.error("Network/server error:", err);
      setErrorMessage("Server unavailable. Try again later.");
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

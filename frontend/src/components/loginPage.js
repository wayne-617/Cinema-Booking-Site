import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import "./loginPage.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function LoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [shake, setShake] = useState(false);
  const { setUser, setAuth } = useAuth();

  const handleLoginClick = async () => {
    const email = document.getElementById("myEmail").value;
    const password = document.getElementById("myPass").value;

    try {
      const response = await fetch("http://localhost:9090/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      let raw = await response.text();
      let data = {};

      try {
        data = JSON.parse(raw);
      } catch {}

      if (response.ok) {
        const decoded = jwtDecode(data.token);
        
        const userObj = {
          fullName: decoded.fullName || "User User",
          firstName: (decoded.fullName || "").split(" ")[0],
          username: decoded.sub,
          role: decoded.role,
          userId: decoded.userId,
          token: data.token,
        };

        // Save to context
        setUser(userObj);
        setAuth(decoded.role);

        // Persist
        localStorage.setItem("user", JSON.stringify(userObj));

        // Routing
        if (decoded.role === "ADMIN") {
          navigate("/admindashboard");
        } else {
          navigate("/");
        }

      } else {
        setErrorMessage(data.error || "Login failed.");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }

    } catch (err) {
      console.error(err);
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

          <input type="email" id="myEmail" placeholder="Email" className="loginPage-input" />
          <input type="password" id="myPass" placeholder="Password" className="loginPage-input" />

          <button className="loginPage-button" onClick={handleLoginClick}>
            Sign In
          </button>
        </div>

        <div className="loginPage-footer">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
          <p><Link to="/forgetPassword">Forgot Password?</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

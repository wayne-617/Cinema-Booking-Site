import React from "react";
import "./loginPage.css";
import logo from "../logo512.png"; // ✅ same as register
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
 
  const navigate = useNavigate();

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

      const data = await response.json();

      if (response.ok) {
        navigate("/admindashboard");
      } else if (data.error === "Password incorrect") {
        navigate("/wrongPass");
      } else {
        navigate("/wrongLogin");
      }
    } catch (error) {
      navigate("/wrongLogin");
    }
  };

  return (
    <div className="loginPage-container">
      <div className="loginPage-card">
        <img src={logo} alt="Logo" className="loginPage-logo" /> {/* ✅ Added */}
        <h1 className="loginPage-title">Welcome Back</h1>

        <div className="loginPage-form">
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
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

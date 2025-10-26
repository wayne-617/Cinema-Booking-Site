import React from "react";
import "./forgotPass.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function ForgotPassword() {
  const navigate = useNavigate();

  const handleRequestClick = async () => {
    const email = document.getElementById("myEmail").value;

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:9090/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert("Password reset link sent! Please check your email.");
        navigate("/login");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to send reset link. Try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="bodyDiv">
      <section className="contentSection">
        <section className="bodySection">
          <div className="bodyTextDiv">
            <div className="title-container">
              <h1 className="login-title">Forgot</h1>
              <h1 className="login-title">Password</h1>
            </div>

            <div className="login-form">
              <p className="forgot-Desc">
                Enter your email to receive a password reset link
              </p>
              <input
                type="email"
                placeholder="Email"
                className="login-input1"
                id="myEmail"
              />
              <button className="login-button" onClick={handleRequestClick}>
                Request
              </button>
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

export default ForgotPassword;

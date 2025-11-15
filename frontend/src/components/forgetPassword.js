import React from "react";
import "./forgotPass.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function ForgotPassword() {
  const navigate = useNavigate();
  const [displayMessage, setDisplay] = useState("");
  const handleRequestClick = async () => {
    const emailaddr = document.getElementById("myEmail");
    const desc = document.getElementById("forgot-Desc");

    const fetchLink = `http://localhost:9090/auth/reset`;
    //make POST requst to /login to verify email exists first
    const fetchLink2 = `http://localhost:9090/auth/login`;
    // post request is made to the backend where the email  is verified with database
    const response1 = await fetch(fetchLink2, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: emailaddr.value,
      }),
    }).then(async (resp) => {
      const data = await resp.json();
      if (!resp.ok && emailaddr.value != "admin@user.com") {
        if (data.error === "Password incorrect") {
          // since there is no password provided since we're only sending email, as long as data.error === incorrect password,
          // we can ignore and continue to sending password link
          //if email is real then continue with initiating reset
          const response2 = await fetch(fetchLink, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: emailaddr.value,
            }),
          });
          const message = "Reset link sent";
          setDisplay(message);
        }
      } else if (!resp.ok) {
      }
    });

    //navigate("/customer", {state: {user: emailaddr.value}});
  };

  return (
    <div className="forgotPage-container">
      <div className="forgotPage-card">
        <img src={logo} alt="Logo" className="forgotPage-logo" />
        <h1 className="forgotPage-title">Forgot Password</h1>

        <div className="forgotPage-form">
          <p className="forgotPage-desc">
            Enter email to receive a new password reset link
          </p>
          {displayMessage && (
            <p className="forgotPage-message">{displayMessage}</p>
          )}
          <input
            type="email"
            placeholder="Email"
            className="forgotPage-input"
            id="myEmail"
          />
          <button className="forgotPage-button" onClick={handleRequestClick}>
            Request
          </button>
        </div>

        <div className="forgotPage-footer">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

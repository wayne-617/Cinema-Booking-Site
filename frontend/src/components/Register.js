import React from "react";
import "./register.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";
//import { text } from "stream/consumers";

function Register() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    const phone = document.getElementById("myPhone");
    const emailaddr = document.getElementById("myEmail");
    const pass = document.getElementById("myPass");
    const username = document.getElementById("myName");

    // Admin account check
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
    <div className="bodyDiv">
      <section className="contentSection">
        <section className="bodySection">
          <div className="bodyTextDiv">
            <input
              type="text"
              placeholder="Name"
              className="register-input"
              id = "myName"
            />
            <input
              type="number"
              placeholder="Phone Number"
              className="register-input"
              id = "myPhone"
            />
            <input
              type="email"
              placeholder="Email"
              className="register-input"
              id = "myEmail"
            />
            <input
              type="password"
              placeholder="password"
              className="register-input"
              id = "myPass"
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

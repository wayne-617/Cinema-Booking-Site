import React from "react";
import "./register.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";
//import { text } from "stream/consumers";

function Register() {
  const navigate = useNavigate();
  
  // will need to be modified at later date - checks to see if admin registration is valid
  const handleRegisterClick = () => {
    const phone = document.getElementById("myPhone");
    const emailaddr = document.getElementById("myEmail");
    const pass = document.getElementById("myPass");
    const username = document.getElementById("myName");
    if (username.value === "admin" && emailaddr.value === "admin@user.com" && phone.value === "1234567890" && pass.value === "masterkey") {
    navigate("/congrats");
    } else {
      navigate("/")
    }
  };
  return (
    <div className="bodyDiv">
      <section className="contentSection">
        <section className="bodySection">
          <div className="bodyTextDiv">
            <input
              type="text"
              placeholder="Name (required)"
              className="register-input"
              id = "myName"
            />
            <input
              type="tel"
              placeholder="Phone Number (required)"
              className="register-input"
              id = "myPhone"
            />
            <input
              type="email"
              placeholder="Email (required)"
              className="register-input"
              id = "myEmail"
            />
            <input
              type="password"
              placeholder="password (required)"
              className="register-input"
              id = "myPass"
            />
             <input
              type="address"
              placeholder="Address (optional)"
              className="register-input"
              id = "myAddress"
            />
             <input
              type="number"
              placeholder="Card Number (optional)"
              className="register-input"
              id = "myCard"
            />
             <input
              type="hidden"
              placeholder="Card Security Code (optional)"
              className="register-input"
              id = "mySC"
            />
             <input
              type="address"
              placeholder="Billing Address (optional)"
              className="register-input"
              id = "myBillingAddress"
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

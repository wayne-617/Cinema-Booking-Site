import React from "react";
import "./loginPage.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
   
    const emailaddr = document.getElementById("myEmail");
    const pass = document.getElementById("myPass");
   
    if (emailaddr.value === "admin@user.com" && pass.value === "masterkey") {
    navigate("/admin");
    } else {
      navigate("/login")
    }
  };

  return (
    <div className="bodyDiv">
      <section className="contentSection">
        <section className="bodySection">
          <div className="bodyTextDiv">
            <div className="title-container">
               <h1>Manage Promotions Page</h1>
            <input
                type="text"
                placeholder="Promotion Name"
                className="login-input"
                id = "promotionName"
              />
              <input
                type="time"
                placeholder="Expiration Date"
                className="login-input"
                id = "expireTime"
              />
               <input
                type="number"
                placeholder="Promotion Discount %"
                className="login-input"
                id = "discountPromotion"
              />
              <button className="login-button" onClick={handleRegisterClick}>Sign In</button>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default LoginPage;

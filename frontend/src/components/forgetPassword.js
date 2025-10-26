import React from "react";
import "./forgotPass.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";
import Userfront from "@userfront/core";
import {useState} from 'react';



function ForgotPassword() {
 
  const navigate = useNavigate();

  const handleRegisterClick = async () => {
   
    const emailaddr = document.getElementById("myEmail");
    const pass = document.getElementById("myPass");
   
    const fetchLink = `http://localhost:9090/auth/login`;
    // post request is made to the backend where the email and password is verified with database
    const response = await fetch(fetchLink, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
        username: emailaddr.value,
        password: pass.value  
        })
    }).then(async resp =>  {
      const data = await resp.json();
      if(resp.ok && emailaddr.value === "admin@user.com") {
        navigate("/admindashboard");
      } else if (resp.ok && emailaddr.value != "admin@user.com") {
        navigate("/customer");
      } else if (!resp.ok) {
       if (data.error === "Password incorrect") {
      navigate("/wrongPass");   
    } 
    return;
  }

  
    }).catch(err => {
     navigate("/wrongLogin"); 
    });

   


    //navigate("/customer", {state: {user: emailaddr.value}});
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
                <p1 className="forgot-Desc">Enter email to receive a new password reset link</p1>
              <input
                type="email"
                placeholder="Email"
                className="login-input1"
                id = "myEmail"
                
              />
              <button className="login-button" >Request</button>
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

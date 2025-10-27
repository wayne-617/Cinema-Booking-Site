import React from "react";
import "./forgotPass.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";
import {useState} from 'react';



function ForgotPassword() {
 
  const navigate = useNavigate();

  const handleRequestClick = async () => {
   
    const emailaddr = document.getElementById("myEmail");
    const desc = document.getElementById("forgot-Desc");
   
    const fetchLink = `http://localhost:9090/auth/reset`;
   //make POST requst to /login to verify email exists first
    const fetchLink2 = `http://localhost:9090/auth/login`;
    // post request is made to the backend where the email  is verified with database
    const response1 = await fetch(fetchLink2, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
        username: emailaddr.value,
        })
    }).then(async resp =>  {
      const data = await resp.json();
      if (!resp.ok && emailaddr.value != "admin@user.com") {
        if (data.error === "Password incorrect") { 
          
          // since there is no password provided since we're only sending email, as long as data.error === incorrect password, 
        // we can ignore and continue to sending password link
        //if email is real then continue with initiating reset
         const response2 = await fetch(fetchLink, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
        email: emailaddr.value,  
        })
    });
  }
      } else if (!resp.ok) {
      
    } 
  })

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
              <button className="login-button" onClick={handleRequestClick} >Request</button>
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

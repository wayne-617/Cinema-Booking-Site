import React from "react";
import "./forgotPass.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";
import Userfront from "@userfront/core";
import {useLocation} from 'react-router-dom';



function ResetPassword() {
 
  const navigate = useNavigate();
  const location = useLocation();
  const param = new URLSearchParams(location.search);
  const userEmail = param.get("email");

  const handleRequestClick = async () => {
   if (!userEmail) {
    alert("missing email");
   }
    const pass = document.getElementById("myPass");
   try{
      const response = await fetch("http://localhost:9090/auth/update", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
        username: "erich.hutchison@gmail.com",
        password: pass.value
        })
       
    }
    
)
     if (!response.ok) {
        const err = await response.text();
            console.error("update failed", err);
        } else {
            navigate("/login");
        }
    } catch (err) {
        console.error("Request error", err);
    }

   

   
  

  

   


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
                <p1 className="forgot-Desc">Create new password</p1>
              <input
                type="password"
                placeholder="New Password"
                className="login-input1"
                id = "myPass"
                
              />
              <button className="login-button" onClick={handleRequestClick}>Request</button>
            </div>
            <div className="login-footer">
              Don’t have an account? <Link to="/register">Reset</Link>
            </div>
            
          </div>
        </section>
      </section>
    </div>
  );
}

export default ResetPassword;

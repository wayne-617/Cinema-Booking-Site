import React from "react";
import "./loginPage.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";




function WrongLoginPage() {
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
      if(resp.ok) {
        navigate("/admindashboard");
      } else if (!resp.ok) {
       if (data.error === "Password incorrect") {
      navigate("/wrongPass");   
    } 
    return;
  }

  
    }).catch(err => {
     navigate("/wrongLogin"); 
    });
   



  };

  return (
    <div className="bodyDiv">
      <section className="contentSection">
        <section className="bodySection">
          <div className="bodyTextDiv">
            <div className="title-container">
              <h1 className="login-title">Login</h1>
            </div>
            <div className="wrong">
                Wrong user and password.
            </div>
            <div className="login-form">
              <input
                type="email"
                placeholder="Email"
                className="login-input1"
                id = "myEmail"
              />
              <input
                type="password"
                placeholder="Password"
                className="login-input2"
                id = "myPass"
              />
              <button className="login-button" onClick={handleRegisterClick}>Sign In</button>
            </div>
            <div className="login-footer">
              Don’t have an account? <Link to="/register">Register</Link>
            </div>
            <div className="login-footer">
              <Link>Forgot Password?</Link>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default WrongLoginPage;

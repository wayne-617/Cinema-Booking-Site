import React from "react";
import "./loginPage.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";
import  {useEffect} from 'react';

function EditProfilePage() {
  const navigate = useNavigate();

   
  const handleEdit = async () => {
    
    const pass = document.getElementById("passDisplay");
    
     const response = await fetch("http://localhost:9090/auth/admin@user.com", {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    
    });
   
    const data = await response.json()
     const hidden = "*".repeat(data.password.length)
    pass.textContent = `password: "${hidden}"`;
        console.log(data);
    };

   
      
   
      

  useEffect(()=> {handleEdit();}, []);
  

  
  return (
    <div className="bodyDiv">
      <section className="contentSection">
        <section className="bodySection">
          <div className="bodyTextDiv">
            <div className="title-container">
              <h1 className="login-title">Edit Profile</h1>
              
            </div>

            <div className="login-form">
                <a>User: Admin@User.com</a>
            </div>
            <div className="login-form">
                <a id="passDisplay"></a>
            </div>
            <input
                type="text"
                placeholder="Edit first name"
                className="edit"
                id = "new-first"
              />
              <input
                type="text"
                placeholder="Edit last name"
                className="edit"
                id = "new-last"
              />
             <input
                type="password"
                placeholder="Edit Password"
                className="edit"
                id = "new-pass"
              />
              <input
                type="number"
                placeholder="Edit Phone number"
                className="edit"
                id = "new-phone"
              />
              
            
            <div className="login-footer">
              Don’t have an account? <Link to="/register">Register</Link>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default EditProfilePage;

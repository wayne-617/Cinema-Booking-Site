import React from "react";
import "./congratsPage.css";
import { Link } from "react-router-dom";
import logo from "../logo512.png";

function CongratsPage() {
  return (
    <div className="bodyDiv">
      <section className="contentSection">
        <section className="bodySection">
          <div className="bodyTextDiv">
            <div className="title-container">
              <h1 className="congrats-title">Success!</h1>
              <div className="congrats-content">
                <img
                  src="https://res.cloudinary.com/dvucimldu/image/upload/v1758078736/pngtree-cute-cartoon-popcorn-dancing-png-image_13755566_bcqr2z.png"
                  alt="Popcorn Character"
                  className="popcorn-image"
                />
                <p className="congrats-message">
                  Verification
                  <br />
                  Email Sent
                </p>
              </div>
              <Link to="/login" className="login-button-link">
                <button className="congrats-button">Login Page</button>
              </Link>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default CongratsPage;

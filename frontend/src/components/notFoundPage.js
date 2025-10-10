import React from "react";
import logo from "../logo512.png";
import cinema from "../cinema.webp";
import "./notFoundPage.css";

export function notFoundPage() {
  return (
    <div className="bodyDiv">
      <header className="mainHeader">
        <div className="headerDiv">
          <div className="logoDiv">
            <img src={logo} alt="Logo" className="logo" />
            <span className="spanner">Absolute Cinema</span>
          </div>
          <div className="navBar">
            <a href="/movies" className="buttons">
              Movies
            </a>
            <a href="/showtimes" className="buttons">
              Showtimes
            </a>
            <a href="/theaters" className="buttons">
              Theaters
            </a>
            <a href="/" className="buttons">
              About
            </a>
          </div>
          <div className="navDiv">
            <a href="/login" className="buttons">
              Sign In
            </a>
            <a href="/register" className="buttons">
              Sign Up
            </a>
          </div>
        </div>
      </header>
      <section className="contentSection">
        <section className="bodySection">
          <div className="bodyTextDiv">
            <h1 className="headerText">The page you are looking for does not exist!</h1>
            <img src={cinema} alt="Absoulute Cinema"/>
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
export default notFoundPage;

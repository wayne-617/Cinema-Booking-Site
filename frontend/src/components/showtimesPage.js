import React from "react";
import logo from "../logo512.png";
import "./showtimesPage.css";

export function showtimesPage() {
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
            <h1 className="headerText">Showtimes</h1>
            <p className="smallerText">
              It's Showtime!
            </p>
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
export default showtimesPage;

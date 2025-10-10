import React from "react";
import logo from "../logo512.png";
import "./welcomePage.css";

export function welcomePage() {
  return (
    <div className="bodyDiv">
      <header className="mainHeader">
        <div className="headerDiv">
          <div className="logoDiv">
            <img src={logo} alt="Logo" className="logo" />
            <span className="spanner">Absolute Cinema</span>
          </div>
          <div className="navBar">
            <a href="/login" className="buttons">
              Movies
            </a>
            <a href="/login" className="buttons">
              Showtimes
            </a>
            <a href="/login" className="buttons">
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
            <h1 className="headerText">Experience Cinema Like Never Before</h1>
            <p className="smallerText">
              Immerse yourself in the latest blockbusters with state-of-the-art
              sound, crystal-clear visuals, and luxury seating that puts you
              right in the action.
            </p>
            <div className="bodyButtonDiv">
              <button className="bigButton">Book Tickets Now</button>
              <button className="bigButton">Watch Trailer</button>
            </div>
          </div>
        </section>
        <section className="bodySection">
          <div className="bodyTextDiv">
            <div className="primaryDiv">
              <h2 className="smallHeader">Why Choose Absolute Cinema?</h2>
              <p className="smallerText">
                Premium cinema experience with cutting-edge technology
              </p>
            </div>
            <div className="gridDiv">
              <div className="primaryDiv">
                <h3 className="smallHeader">Dolby Atmos Sound</h3>
                <p className="smallerText">
                  Immersive 3D audio that puts you right in the middle of the
                  action with crystal-clear sound quality.
                </p>
              </div>
              <div className="primaryDiv">
                <h3 className="smallHeader">4K Laser Projection</h3>
                <p className="smallerText">
                  Ultra-high definition visuals with vibrant colors and sharp
                  details that bring movies to life.
                </p>
              </div>
              <div className="primaryDiv">
                <h3 className="smallHeader">Luxury Reclining Seats</h3>
                <p className="smallerText">
                  Plush leather recliners with personal tables and cup holders
                  for maximum comfort during your movie.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="bodySection">
          <div className="bodyTextDiv">
            <div className="primaryDiv">
              <h2 className="headertext">Today's Showtimes</h2>
              <p className="smallertext">
                Select your preferred time and book instantly
              </p>
            </div>
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
export default welcomePage;

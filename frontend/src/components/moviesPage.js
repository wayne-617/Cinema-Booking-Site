import React from "react";
import logo from "../logo512.png";
import "./moviesPage.css";

export function moviesPage() {
  return (
    <div className="bodyDiv">
      <section className="contentSection">
        <section className="bodySection">
          <div className="bodyTextDiv">
            <h1 className="headerText">Movies</h1>
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
export default moviesPage;

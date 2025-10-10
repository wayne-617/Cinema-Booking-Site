import React from "react";
import logo from "../logo512.png";
import "./showtimesPage.css";

export function showtimesPage() {
  return (
 <div className="bodyDiv">
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

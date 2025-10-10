import React from "react";
import logo from "../logo512.png";
import cinema from "../cinema.webp";
import "./notFoundPage.css";

export function notFoundPage() {
  return (
    <div className="bodyDiv">
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

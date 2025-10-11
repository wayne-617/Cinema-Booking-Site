import React from "react";
import logo from "../logo512.png";
import "./dashboardPage.css";

export function dashboardPage() {
  return (
    <div className="bodyDiv">
      <section className="contentSection">
        <section className="bodySection">
          <div className="bodyTextDiv">
            <h1 className="headerText">Admin Page</h1>
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
export default dashboardPage;

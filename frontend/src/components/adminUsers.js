import React from "react";
import "./loginPage.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";


function AdminUsers() {
  const navigate = useNavigate();

  return (
    <div className="bodyDiv">
      <section className="contentSection">
        <section className="bodySection">
          <div className="bodyTextDiv">
            <div className="movie-input">
              <h1>Manage Users Page </h1>
            </div>
            </div>
        </section>
      </section>
    </div>
  );
}

export default AdminUsers;

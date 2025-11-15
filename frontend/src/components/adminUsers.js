import React from "react";
import "./loginPage.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useState, useEffect } from "react";

function AdminUsers() {
  const navigate = useNavigate();
  const { currentUser, userAuth, setUser, setAuth } = useAuth();
  useEffect(() => {
    if (userAuth == "ADMIN") {
      return;
    } else {
      navigate("/login");
    }
  }, [navigate]);
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

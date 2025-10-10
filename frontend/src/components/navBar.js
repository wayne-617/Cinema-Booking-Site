import React from "react";
import logo from "../logo512.png";
import { NavLink } from 'react-router-dom';
import "./navBar.css";

export function navBar() {
  return (
      <header className="mainHeader">
        <div className="headerDiv">
          <div className="logoDiv">
            <img src={logo} alt="Logo" className="logo" />
            <h1 className="logo">Absolute Cinema</h1>
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
  );
}
export default navBar;

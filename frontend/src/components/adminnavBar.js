import React from "react";
import "./adminnavBar.css";

export function adminnavBar() {
  return (
      <header className="mainHeader">
        <div className="headerDiv">
          <div className="logoDiv">
            <h1 className="logo">AC Admin</h1>
          </div>
          <div className="navBar">
            <a href="/adminmovies" className="buttons">
              Manage Movies
            </a>
            <a href="/adminpromotions" className="buttons">
              Mange Promotions
            </a>
            <a href="/admintheaters" className="buttons">
              Edit Theatres
            </a>
            <a href="/admin" className="buttons">
              Admin Dashboard
            </a>
          </div>
          <div className="navDiv">
            <a href="/" className="buttons">
              Sign out
            </a>
          </div>
            <a href ="/editProfile" className="buttons">
              Edit Profile
            </a>
        </div>
      </header>
  );
}
export default adminnavBar;

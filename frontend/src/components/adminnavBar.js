import React from "react";
import "./adminnavBar.css";
import { useNavigate } from "react-router-dom";

export function AdminNavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ Remove saved user info
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Optional: clear everything if you want
    // localStorage.clear();

    // ✅ Redirect to login page
    navigate("/login");
  };

  return (
    <header className="mainHeader">
      <div className="headerDiv">
        <div className="logoDiv">
          <h1 className="logo">AC Admin</h1>
        </div>

        <div className="navBar">
          <a href="/adminmovies" className="buttons">Manage Movies</a>
          <a href="/adminpromotions" className="buttons">Manage Promotions</a>
          <a href="/adminUsers" className="buttons">Edit Users</a>
          <a href="/admindashboard" className="buttons">Admin Dashboard</a>
        </div>

        <div className="navDiv">
          {/* 👇 Replace link with a logout button */}
          <button onClick={handleLogout} className="buttons">
            Log out
          </button>
        </div>

        <a href="/editProfile" className="buttons">
          Edit Profile
        </a>
      </div>
    </header>
  );
}

export default AdminNavBar;

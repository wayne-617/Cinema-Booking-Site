import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./adminnavBar.css"; // <-- Importing the new CSS file

export function AdminNavBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load user info on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If no user, boot them back to login
      navigate("/login");
    }
  }, [navigate]);

  // Effect to handle clicking outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close menu
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Handler to navigate and close dropdown
  const handleDropdownNavigate = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsDropdownOpen(false); // Close menu on logout
    navigate("/login"); // Go to login after admin logout
  };

  return (
    <>
      {/* All styles have been moved to adminnavBar.css */}
      <header className="mainHeader">
        <div className="headerDiv">
          <div className="logoDiv">
            {/* Admin-specific logo */}
            <h1 className="logo">AC Admin</h1>
          </div>

          <div className="navBar">
            {/* Admin-specific links */}
            <a href="/admindashboard" className="buttons">Dashboard</a>
            <a href="/adminmovies" className="buttons">Manage Movies</a>
            <a href="/adminpromotions" className="buttons">Manage Promotions</a>
            <a href="/adminUsers" className="buttons">Edit Users</a>
          </div>

          {/* --- User Menu Section (Copied from NavBar) --- */}
          <div className="navDiv">
            {user ? (
              <div className="userMenu" ref={dropdownRef}>
                <button
                  className={`userButton ${isDropdownOpen ? "menu-open" : ""}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{user.firstName}</span>
                  <div className="hamburger-icon">
                    <span></span>
                  </div>
                </button>

                <div className={isDropdownOpen ? "dropdownMenu show" : "dropdownMenu"}>
                  <button
                    onClick={() => handleDropdownNavigate("/editProfile")}
                    className="dropdownItem"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => handleDropdownNavigate("/")}
                    className="dropdownItem"
                  >
                    Main Site
                  </button>
                  {/* No need to check role, we are already in admin */}
                  <button
                    onClick={() => handleDropdownNavigate("/admindashboard")}
                    className="dropdownItem"
                  >
                    Admin Dashboard
                  </button>
                  <button onClick={handleLogout} className="dropdownItem divider">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              // No login/signup buttons, just empty if no user
              // The useEffect should redirect to /login anyway
              null
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default AdminNavBar;


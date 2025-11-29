// src/components/navBar.jsx
import React, { useState, useEffect, useRef } from "react";
import logo from "../logo512.png";
import { NavLink, useNavigate } from "react-router-dom";
import "./navBar.css";
import { fallbackMovies } from "../data/fallbackMovies";
import { useAuth } from "../AuthContext";

export function NavBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { setUser, setAuth, userAuth, isLoggedIn, currentUser, adminMode, toggleAdminMode } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load user info on mount
  useEffect(() => {
  const stored = localStorage.getItem("user");
  if (stored) {
    const parsed = JSON.parse(stored);
    setUser(parsed);
    setAuth(parsed.auth);

    // 👉 Automatically start admins in admin mode
    if (parsed.auth === "ADMIN") {
      setAdminMode(true);
    }
  }
}, []);

  // CUSTOMER prefix → /customer
  const prefix = userAuth === "CUSTOMER" ? "/customer" : "";
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setAuth(null);
    setIsDropdownOpen(false);
    navigate("/");
  };

  // SEARCH submit
  const handleSearchSubmit = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const trimmed = query.trim();
    navigate(trimmed === "" ? "/movies" : `/movies?search=${trimmed}`);
    setResults([]);
  };

  // LIVE SEARCH updates
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:9090/api/movies/search?query=${value}`
      );

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();
      setResults(
        data.length > 0
          ? data.map((m) => ({
              ...m,
              mpaaRating: m.mpaaRating || "Not Rated",
            }))
          : fallbackMovies.filter((movie) =>
              movie.title.toLowerCase().includes(value.toLowerCase())
            )
      );
    } catch {
      setResults(
        fallbackMovies.filter((movie) =>
          movie.title.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleSelectMovie = (movieId) => {
    setQuery("");
    setResults([]);
    navigate(`${prefix}/movieDescription/${movieId}`);
  };

  const handleDropdownNavigate = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  return (
    <header className="mainHeader">
      <div className="headerDiv">
        <NavLink to={prefix || "/"} className="logoDiv">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="logoText">Absolute Cinema</h1>
        </NavLink>

        {/* Top Nav Buttons */}
      <div className="navBar">

            {/* CUSTOMER or Admin-in-Customer-View */}
            {(userAuth !== "ADMIN" || !adminMode) && (
              <>
                <NavLink to="/movies" className="buttons">Movies</NavLink>
                <NavLink to="/showtimes" className="buttons">Showtimes</NavLink>
                <NavLink to="/theaters" className="buttons">Theaters</NavLink>
                <NavLink to="/" className="buttons">About</NavLink>
              </>
            )}

            {/* ADMIN VIEW (adminMode = true) */}
            {userAuth === "ADMIN" && adminMode && (
              <>
                <NavLink to="/admindashboard" className="buttons">Dashboard</NavLink>
                <NavLink to="/adminmovies" className="buttons">Movies</NavLink>
                <NavLink to="/adminpromotions" className="buttons">Promotions</NavLink>
                <NavLink to="/adminusers" className="buttons">Users</NavLink>
                <NavLink to="/admin/orders" className="buttons">Orders</NavLink>
              </>
            )}

          </div>

        {/* Search Bar */}
        <div className="searchBar">
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            onKeyDown={handleSearchSubmit}
            placeholder="Search movies..."
            className="searchInput"
          />
          {results.length > 0 && (
            <div className="searchResults">
              {results.map((movie) => (
                <div
                  key={movie.movieId}
                  className="searchResultItem"
                  onClick={() => handleSelectMovie(movie.movieId)}
                >
                  <img
                    src={
                      movie.poster_url ||
                      "https://via.placeholder.com/45x65?text=No+Image"
                    }
                    alt={movie.title}
                    className="searchPoster"
                  />
                  <div>
                    <h4>{movie.title}</h4>
                    <div className="ratingRow">
                      <span className="ratingText">
                        {movie.mpaaRating || "Not Rated"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Dropdown */}
          <div className="navDiv">
            {isLoggedIn ? (
              <div className="userMenu" ref={dropdownRef}>
                <button
                  className={`userButton ${isDropdownOpen ? "menu-open" : ""}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{currentUser?.fullName || currentUser?.username}</span>
                  <div className="hamburger-icon">
                    <span></span>
                  </div>
                </button>

                <div className={isDropdownOpen ? "dropdownMenu show" : "dropdownMenu"}>

                  {/* Edit Profile */}
                  <button
                    onClick={() =>
                      handleDropdownNavigate(
                        userAuth === "CUSTOMER"
                          ? "/customer/editProfile"
                          : "/editProfile"
                      )
                    }
                    className="dropdownItem"
                  >
                    Edit Profile
                  </button>

                  {/* My Orders — only for customers */}
                  {userAuth === "CUSTOMER" && (
                    <button
                      onClick={() => handleDropdownNavigate("/customer/orders")}
                      className="dropdownItem"
                    >
                      My Orders
                    </button>
                  )}

                  {/* ADMIN ONLY OPTIONS */}
                  {userAuth === "ADMIN" && (
                    <>
                      {/* Admin Mode Toggle */}
                      <button
                        onClick={toggleAdminMode}
                        className="dropdownItem"
                      >
                        {adminMode ? "Switch to Customer View" : "Switch to Admin View"}
                      </button>
                    </>
                  )}

                  {/* LOGOUT */}
                  <button onClick={handleLogout} className="dropdownItem divider">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <NavLink to="/login" className="buttons">Log In</NavLink>
                <NavLink to="/register" className="buttons">Sign Up</NavLink>
              </>
            )}
          </div>
      </div>
    </header>
  );
}

export default NavBar;

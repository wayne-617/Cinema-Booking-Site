// src/components/navBar.jsx
import React, { useState, useEffect, useRef } from "react";
import logo from "../logo512.png";
import { NavLink, useNavigate } from "react-router-dom";
import "./navBar.css";
import { fallbackMovies } from "../data/fallbackMovies";

export function NavBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load user + token
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    }
  }, []);

  const token = user?.token;

  // CUSTOMER → /customer
  // ADMIN → public routes (AdminNavBar should be used instead anyway)
  const prefix =
    user?.role === "CUSTOMER"
      ? "/customer"
      : "";

  // Close dropdown on outside click
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
    navigate("/");
  };

  // SEARCH submit
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = query.trim();
      navigate(
        trimmed === ""
          ? `${prefix}/movies`
          : `${prefix}/movies?search=${encodeURIComponent(trimmed)}`
      );
      setResults([]);
    }
  };

  // LIVE SEARCH
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:9090/api/movies/search?query=${encodeURIComponent(
          value
        )}`
      );
      const data = await res.json();

      setResults(
        Array.isArray(data) && data.length > 0
          ? data
          : fallbackMovies.filter((m) =>
              m.title.toLowerCase().includes(value.toLowerCase())
            )
      );
    } catch (err) {
      setResults(
        fallbackMovies.filter((m) =>
          m.title.toLowerCase().includes(value.toLowerCase())
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

        {/* MAIN NAV (customer or public) */}
        <nav className="navBar">
          <NavLink to={`${prefix}/movies`} className="buttons">Movies</NavLink>
          <NavLink to={`${prefix}/showtimes`} className="buttons">Showtimes</NavLink>
          <NavLink to={`${prefix}/theaters`} className="buttons">Theaters</NavLink>
          <NavLink to="/" className="buttons">About</NavLink>
        </nav>

        {/* SEARCH BAR */}
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
                    src={movie.poster_url || "https://via.placeholder.com/45x65"}
                    className="searchPoster"
                    alt=""
                  />
                  <h4>{movie.title}</h4>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* USER DROPDOWN */}
        <div className="navDiv">
          {user ? (
            <div className="userMenu" ref={dropdownRef}>
              <button
                className={`userButton ${isDropdownOpen ? "menu-open" : ""}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{user.firstName || "Account"}</span>
                <div className="hamburger-icon"><span></span></div>
              </button>

              <div className={isDropdownOpen ? "dropdownMenu show" : "dropdownMenu"}>

                {/* EDIT PROFILE */}
                <button
                  onClick={() =>
                    handleDropdownNavigate(
                      user.role === "CUSTOMER"
                        ? "/customer/editProfile"
                        : "/editProfile"
                    )
                  }
                  className="dropdownItem"
                >
                  Edit Profile
                </button>

                {/* CUSTOMER ONLY */}
                {user.role === "CUSTOMER" && (
                  <button
                    onClick={() => handleDropdownNavigate("/customer/orders")}
                    className="dropdownItem"
                  >
                    My Orders
                  </button>
                )}

                {/* ADMIN ONLY */}
                {user.role === "ADMIN" && (
                  <button
                    onClick={() => handleDropdownNavigate("/admindashboard")}
                    className="dropdownItem"
                  >
                    Admin Dashboard
                  </button>
                )}

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

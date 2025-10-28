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
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Load user info on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsDropdownOpen(false); // Close menu on logout
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
    e.preventDefault();
    const trimmed = query.trim();

    if (trimmed === "") {
      navigate("/movies");
    } else {
      navigate(`/movies?search=${trimmed}`);
    }

    setResults([]); // Clear dropdown results
  }
  };

  // (Your search function for dropdown suggestions)
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(`http://localhost:9090/api/movies/search?query=${value}`);
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      if (data && data.length > 0) {
        setResults(data.map((m) => ({ ...m, mpaaRating: m.mpaaRating || "Not Rated" })));
      } else {
        const localMatches = fallbackMovies.filter((movie) =>
          movie.title.toLowerCase().includes(value.toLowerCase())
        );
        setResults(localMatches);
      }
    } catch (err) {
      console.error("Error searching movies:", err);
    }
  };

  const handleSelectMovie = (movieId) => {
    setQuery("");
    setResults([]);
    navigate(`/movieDescription/${movieId}`);
  };

  const handleDropdownNavigate = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  return (
    <header className="mainHeader">
      <div className="headerDiv">
        <NavLink to="/" className="logoDiv">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="logoText">Absolute Cinema</h1>
        </NavLink>

        <div className="navBar">
          <a href="/movies" className="buttons">Movies</a>
          <a href="/showtimes" className="buttons">Showtimes</a>
          <a href="/theaters" className="buttons">Theaters</a>
          <a href="/" className="buttons">About</a>
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
                  key={movie.movie_id || movie.movieId}
                  className="searchResultItem"
                  onClick={() => handleSelectMovie(movie.movie_id || movie.movieId)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={movie.poster_url || "https://via.placeholder.com/45x65?text=No+Image"}
                    alt={movie.title}
                    className="searchPoster"
                  />
                  <div>
                    <h4>{movie.title}</h4>
                    <div className="ratingRow">
                      <span className="ratingText">{movie.mpaaRating || "Not Rated"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Menu Section */}
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
              <a href="/login" className="buttons">Log In</a>
              <a href="/register" className="buttons">Sign Up</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavBar;
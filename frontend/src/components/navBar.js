import React, { useState } from "react";
import logo from "../logo512.png";
import { NavLink, useNavigate } from "react-router-dom";
import "./navBar.css";
import { fallbackMovies } from "../data/fallbackMovies";


export function NavBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

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
        setResults(
          data.map((m) => ({
            ...m,
            mpaaRating: m.mpaaRating || "Not Rated",
          }))
        );
      } else {
        const localMatches = fallbackMovies.filter((movie) =>
          movie.title.toLowerCase().includes(value.toLowerCase())
        );
        setResults(localMatches);
      }
    } catch (err) {
      console.error("Error searching movies:", err);
      const localMatches = fallbackMovies.filter((movie) =>
        movie.title.toLowerCase().includes(value.toLowerCase())
      );
      setResults(localMatches);
    }
  };

  const handleSelectMovie = (movieId) => {
    // Clear search bar & close dropdown
    setQuery("");
    setResults([]);
    // Navigate to movie description page
    navigate(`/movieDescription/${movieId}`);
  };

  return (
      <header className="mainHeader">
        <div className="headerDiv">
          <NavLink to="/" className="logoDiv">
            <img src={logo} alt="Logo" className="logo" />
            <h1 className="logoText">Absolute Cinema</h1>
          </NavLink>
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

          <div className="searchBar">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim() !== "") {
                  navigate(`/movies?search=${encodeURIComponent(query.trim())}`);
                  setResults([]);
                }
              }}
            >
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (query.trim() === "") {
                  // Search bar empty → go to all movies
                  navigate("/movies");
                } else {
                  // Search bar has text → go to search results
                  navigate(`/movies?search=${encodeURIComponent(query.trim())}`);
                }
                setResults([]); // clear dropdown
              }
            }}
            placeholder="Search movies..."
            className="searchInput"
          />
          
            </form>

            {results.length > 0 && (
              <div className="searchResults">
                {results.map((movie) => (
                  <div
                    key={movie.movie_id || movie.movieId}
                    className="searchResultItem"
                    onClick={() =>
                      handleSelectMovie(movie.movie_id || movie.movieId)
                    }
                     style={{ cursor: "pointer" }}

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
                        <img
                          src="https://res.cloudinary.com/dvucimldu/image/upload/v1760226344/Motion_Picture_Association_logo_2019_pfwkrr.png"
                          alt="MPAA logo"
                          className="mpaaLogo"
                        />
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


          <div className="navDiv">
            <a href="/login" className="buttons">
              Log In
            </a>
            <a href="/register" className="buttons">
              Sign Up
            </a>
          </div>
        </div>
      </header>
  );
}

export default NavBar;

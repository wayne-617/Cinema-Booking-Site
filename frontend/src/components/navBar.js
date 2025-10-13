import React, { useState } from "react";
import logo from "../logo512.png";
import { NavLink } from 'react-router-dom';
import "./navBar.css";
import { fallbackMovies } from "../data/fallbackMovies";


export function NavBar() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

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
      //  Use only database movies if found
      setResults(
        data.map((m) => ({
          ...m,
          mpaaRating: m.mpaaRating || "Not Rated",
        }))
      );
    } else {
      //  Only use fallback if database returns nothing
      const localMatches = fallbackMovies.filter((movie) =>
        movie.title.toLowerCase().includes(value.toLowerCase())
      );
      setResults(localMatches);
    }
  } catch (err) {
    console.error("Error searching movies:", err);
    //  Fallback only when fetch fails
    const localMatches = fallbackMovies.filter((movie) =>
      movie.title.toLowerCase().includes(value.toLowerCase())
    );
    setResults(localMatches);
  }
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
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search movies..."
            className="searchInput"
          />
          {results.length > 0 && (
            <div className="searchResults">
              {results.map((movie) => (
                <a key={movie.movie_id} href={`/movies/${movie.movie_id}`} className="searchResultItem">
                  <img src={movie.poster_url} alt={movie.title} className="searchPoster" />
                  <div>
                    <h4>{movie.title}</h4>
                    <div className="ratingRow">
                      <img
                        src="https://res.cloudinary.com/dvucimldu/image/upload/v1760226344/Motion_Picture_Association_logo_2019_pfwkrr.png"
                        alt="MPAA logo"
                        className="mpaaLogo"
                      />
                      <span className="ratingText">{movie.mpaaRating || "Not Rated"}</span>
                    </div>
                  </div>
                </a>
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

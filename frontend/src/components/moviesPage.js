import React, { useEffect, useState } from "react";
import "./moviesPage.css";
import { useNavigate, useLocation } from "react-router-dom";



export default function MoviesPage() {
  
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();
  const query = useQuery();

  const searchTerm = query.get("search")?.toLowerCase() || "";


  // Fetch movies
  useEffect(() => {
    fetch("http://localhost:9090/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Error loading movies:", err));
  }, []);

  // Fetch showtimes
  useEffect(() => {
    fetch("http://localhost:9090/api/showtimes")
      .then((res) => res.json())
      .then((data) => setShowtimes(data))
      .catch((err) => console.error("Error loading showtimes:", err));
  }, []);

  // Filter showtimes for selected movie
  const getMovieShowtimes = (movieId) =>
    showtimes.filter((s) => s.movieId === movieId);

    const goToDetails = (movie) => {
      const id = movie.movieId;   
      navigate(`/movieDescription/${id}`);
    };

      const filteredMovies = searchTerm
    ? movies.filter((m) =>
        m.title.toLowerCase().includes(searchTerm)
      )
    : movies;
  

    return (
    <div className="moviesPageContainer">
      <h1 className="moviesHeader">🎬 Now Showing</h1>
      <p className="moviesSubheader">
        {searchTerm
          ? `Search results for “${searchTerm}”`
          : "Click a movie to view its showtimes"}
      </p>

      {filteredMovies.length === 0 ? (
        <p className="noResultsText">
          No movies found matching "{searchTerm}"
        </p>
      ) : (
        <div className="movieGrid">
          {filteredMovies.map((movie) => (
            <div
              key={movie.movieId}
              className={`movieCard ${
                selectedMovie === movie.movieId ? "active" : ""
              }`}
              onClick={() => goToDetails(movie)}
            >
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="moviePoster"
              />
              <h2 className="movieTitle">{movie.title}</h2>
              <p className="movieCategory">{movie.category}</p>
              <p className="movieRating">Rated: {movie.mpaaRating}</p>

              {selectedMovie === movie.movieId && (
                <div className="showtimeDropdown">
                  <h3>Showtimes</h3>
                  {getMovieShowtimes(movie.movieId).length > 0 ? (
                    <div className="showtimeContainer">
                      {getMovieShowtimes(movie.movieId).map((s) => (
                        <div key={s.showtimeId} className="showtimeBox">
                          <p className="showtimeDate">
                            📅 {new Date(s.showDate).toLocaleDateString()}
                          </p>
                          <p className="showtimeTime">
                            🕒{" "}
                            {new Date(
                              `1970-01-01T${s.showTime}`
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="noShowtimes">No showtimes available yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
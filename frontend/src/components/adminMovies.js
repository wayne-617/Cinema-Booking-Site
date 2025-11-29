import React, { useEffect, useState } from "react";
import "./adminMovies.css";
import { useNavigate } from "react-router-dom";

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedMovie, setExpandedMovie] = useState(null);

  const navigate = useNavigate();

  // Fetch movies
  useEffect(() => {
    fetch("http://localhost:9090/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Error loading movies:", err));
  }, []);

  /* ------------------------- CREATE MOVIE -------------------------- */
  const publishMovie = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const movie = Object.fromEntries(formData.entries());

    const response = await fetch("http://localhost:9090/api/movies/addMovies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movie)
    });

    if (response.ok) {
      alert("Movie published!");
      e.target.reset();
      setShowAddForm(false);
    }
  };

  /* ---------------------------- UPDATE MOVIE ----------------------------- */
  const updateMovie = async (movieId, movie) => {
    const response = await fetch(`http://localhost:9090/api/movies/${movieId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movie)
    });

    if (response.ok) {
      alert("Movie updated!");
    } else {
      alert("Update failed");
    }
  };

  /* ---------------------------- DELETE MOVIE ----------------------------- */
  const removeMovie = async (movieId) => {
    if (!window.confirm("Delete this movie?")) return;

    const response = await fetch(`http://localhost:9090/api/movies/${movieId}`, {
      method: "DELETE"
    });

    if (response.ok) {
      setMovies(movies.filter((m) => m.movieId !== movieId));
      alert("Movie deleted!");
    } else {
      alert("Delete failed");
    }
  };


  return (
    <div className="adminMovies-container">
      
      {/* Header */}
      <div className="adminMovies-header">
        <h1>🎬 Manage Movies</h1>
        <button className="addMovie-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Close Form" : "Add New Movie"}
        </button>
      </div>

      {/* Add Movie Form */}
      {showAddForm && (
        <form className="addMovie-form" onSubmit={publishMovie}>
          <h2>Add a New Movie</h2>

          <div className="formRow">
            <input name="title" placeholder="Title" required />
            <input name="director" placeholder="Director" />
          </div>

          <div className="formRow">
            <input name="producer" placeholder="Producer" />
            <input name="castMembers" placeholder="Cast" />
          </div>

          <div className="formRow">
            <select name="category">
              <option>Action</option>
              <option>Comedy</option>
              <option>Drama</option>
              <option>Horror</option>
              <option>Sci-Fi</option>
              <option>Romance</option>
            </select>

            <select name="mpaaRating">
              <option>G</option>
              <option>PG</option>
              <option>PG-13</option>
              <option>R</option>
              <option>NC-17</option>
            </select>
          </div>

          <textarea name="synopsis" placeholder="Synopsis" className="wideInput" />
          <textarea name="reviews" placeholder="Review" className="wideInput" />

          <div className="formRow">
            <input name="poster_url" placeholder="Poster URL" />
            <input name="trailer_video" placeholder="Trailer Link" />
          </div>

          <select name="status" className="wideInput">
            <option value="NOW_PLAYING">Now Playing</option>
            <option value="COMING_SOON">Coming Soon</option>
          </select>

          <button className="publishBtn">Publish Movie</button>
        </form>
      )}

{/* Movie List */}
<div className="moviesGrid">
  {movies.map((movie) => (
  <div
  className="movieCard"
    key={movie.movieId}
    onClick={() =>
      setExpandedMovie(expandedMovie === movie.movieId ? null : movie.movieId)
    }
    style={{ cursor: "pointer" }}
  >
    <div className="movieCard-header">
        <img src={movie.poster_url} alt={movie.title} className="movieThumbnail" />
        <div>
          <h3>{movie.title}</h3>
          <p>{movie.category} • {movie.mpaaRating}</p>
        </div>
      </div>

      {/* Expandable Details */}
      {expandedMovie === movie.movieId && (
        <div
          className="movieEditForm"
          onClick={(e) => e.stopPropagation()}
        >

          {/* TITLE + CATEGORY */}
          <div className="formGroup">
            <label>Title</label>
            <input
              defaultValue={movie.title}
              onChange={(e) => (movie.title = e.target.value)}
            />

            <label>Category</label>
            <select
              defaultValue={movie.category}
              onChange={(e) => (movie.category = e.target.value)}
            >
              <option>Action</option>
              <option>Comedy</option>
              <option>Drama</option>
              <option>Horror</option>
              <option>Sci-Fi</option>
              <option>Romance</option>
              <option>Documentary</option>
              <option>Thriller</option>
            </select>
          </div>

          {/* DIRECTOR & PRODUCER */}
          <div className="formGroup">
            <label>Director</label>
            <input
              defaultValue={movie.director}
              onChange={(e) => (movie.director = e.target.value)}
            />

            <label>Producer</label>
            <input
              defaultValue={movie.producer}
              onChange={(e) => (movie.producer = e.target.value)}
            />
          </div>

          {/* CAST & RATING */}
          <div className="formGroup">
            <label>Cast Members</label>
            <input
              defaultValue={movie.castMembers}
              onChange={(e) => (movie.castMembers = e.target.value)}
            />

            <label>MPAA Rating</label>
            <select
              defaultValue={movie.mpaaRating}
              onChange={(e) => (movie.mpaaRating = e.target.value)}
            >
              <option>G</option>
              <option>PG</option>
              <option>PG-13</option>
              <option>R</option>
              <option>NC-17</option>
            </select>
          </div>

          {/* SYNOPSIS */}
          <div className="formBlock">
            <label>Synopsis</label>
            <textarea
              defaultValue={movie.synopsis}
              onChange={(e) => (movie.synopsis = e.target.value)}
            />
          </div>

          {/* REVIEWS */}
          <div className="formBlock">
            <label>Reviews</label>
            <textarea
              defaultValue={movie.reviews}
              onChange={(e) => (movie.reviews = e.target.value)}
            />
          </div>

          {/* POSTER & TRAILER */}
          <div className="formGroup">
            <label>Poster URL</label>
            <input
              defaultValue={movie.poster_url}
              onChange={(e) => (movie.poster_url = e.target.value)}
            />

            <label>Trailer Link</label>
            <input
              defaultValue={movie.trailer_video}
              onChange={(e) => (movie.trailer_video = e.target.value)}
            />
          </div>

          {/* SHOWTIME & STATUS */}
          <div className="formGroup">
            <label>Showtime</label>
            <input
              type="datetime-local"
              defaultValue={movie.showtime}
              onChange={(e) => (movie.showtime = e.target.value)}
            />

            <label>Status</label>
            <select
              defaultValue={movie.status}
              onChange={(e) => (movie.status = e.target.value)}
            >
              <option value="NOW_PLAYING">Now Playing</option>
              <option value="COMING_SOON">Coming Soon</option>
            </select>
          </div>

          {/* Poster Preview */}
          <div className="posterPreviewContainer">
            <img
              src={movie.poster_url}
              alt="Poster Preview"
              className="posterPreview"
            />
          </div>

          {/* BUTTONS */}
          <div className="details-buttons">
            <button className="updateBtn" onClick={() => updateMovie(movie.movieId, movie)}>
              Update Movie
            </button>
            <button className="deleteBtn" onClick={() => removeMovie(movie.movieId)}>
              Delete Movie
            </button>
          </div>

        </div>
      )}
    </div>
  ))}
</div>

    </div>
  );
}

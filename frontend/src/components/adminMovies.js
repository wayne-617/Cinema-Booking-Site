import React, { useEffect, useState } from "react";
import "./adminMovies.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";


function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();


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

  const handleShowtimeClick = (showtimeId) => {
    navigate(`/seat-reservation/${showtimeId}`);
  };
  const publishMovie = async () => {
    
    
     
    const cast = document.getElementById("movieCast");
    const director = document.getElementById("movieDirector");
    const category = document.getElementById("movieCategory");
    const rating = document.getElementById("movieRating");
    const poster = document.getElementById("moviePoster");
    const producer = document.getElementById("movieProducer");
    const reviews = document.getElementById("movieReview");
    const showtime = document.getElementById("movieShowtime");
    const synopsis = document.getElementById("movieSynopsis");
    const title = document.getElementById("movieTitle");
    const trailerPic = document.getElementById("moviePoster");
    const trailerLink = document.getElementById("trailerVideo");
        const status = document.getElementById("movieStatus");
    
    const publishedMovie = {
    
      castMembers: cast.value,
      director: director.value,
      category: category.value,
      mpaaRating: rating.value,
      poster_url: poster.value,
      producer: producer.value,
      reviews: reviews.value,
      synopsis: synopsis.value,
      showtime: showtime.value,
      title: title.value,
      trailer_picture: trailerPic.value,
      trailer_video: trailerLink.value,
      status: status.value
  }
    
    const response = await fetch("http://localhost:9090/api/movies/addMovies", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(publishedMovie)
    }).then(response => {
      if (!response.ok) throw new Error("Publish movie failed.");
      
      return response.json()
     
    }).then(data => {console.log("Movie submitted to db");}).catch(
      error => {console.error("Error:", error);

      });
    document.getElementById("Mform").reset();
  };
  

  return (
    <div className="bodyDiv">
      <section className="contentSection">
        <section className="bodySection">
          <div className="bodyTextDiv">
             <h1>Add a New Movie</h1>
            <div className="movie-input">
              <form id="Mform">
              <textarea
                type="text"
                placeholder="Title"
                className="login-input"
                id = "movieTitle"
              />
              <textarea
                type="text"
                placeholder="Director"
                className="login-input"
                id = "movieDirector"
              />
               <textarea
                type="text"
                placeholder="Producer"
                className="login-input"
                id = "movieProducer"
              />
              <textarea
                type="text"
                placeholder="Synopsis"
                className="login-input"
                id = "movieSynopsis"
              />
               <textarea
                type="test"
                placeholder="Movie Review"
                className="login-input"
                id = "movieReview"
              />
              <textarea
                type="url"
                placeholder="Movie Poster"
                className="login-input"
                id = "moviePoster"
              />
               <textarea
                type="url"
                placeholder="Trailer Video"
                className="login-input"
                id = "trailerVideo"
              />
              <textarea
                type="text"
                placeholder="Rating"
                className="login-input"
                id = "movieRating"
              />
              <textarea
                type="datetime-local"
                placeholder="Showtime"
                className="login-input"
                id = "movieShowtime"
              />
              <textarea 
                type="text"
                placeholder="Cast"
                className="movie-input"
                id = "movieCast"
              />
              <textarea 
                type="text"
                placeholder="Catergory"
                className="movie-input"
                id = "movieCategory"
              />
<select id="movieStatus" name="Status">
  <option value="NOW_PLAYING">Now Playing</option>
  <option value="COMING_SOON">Coming Soon</option>
</select> 
              </form>
              <button className="login-button" onClick={publishMovie}>Publish Movie</button>
            </div>
            </div>
        </section>
        <section className="body-section">
        <div className="movieList">
        {movies.map((movie) => (
            <div className="movieEditItem" key={movie.movieId}>
              <form id="editMovie">
              <textarea
                type="text"
                value={movie.title}
                className="movieEdit"
                id = "movieName"
              />
              <textarea
                type="text"
                value={movie.category}
                className="movieEdit"
                id = "movieCategory"
              />
               <textarea
                type="text"
                value={movie.director}
                className="movieEdit"
                id = "movieDirector"
              />
               <textarea
                type="text"
                value={movie.producer}
                className="movieEdit"
                id = "movieProducer"
              />
               <textarea
                type="text"
                value={movie.castMembers}
                className="movieEdit"
                id = "castMembers"
              />
               <textarea
                type="text"
                value={movie.synopsis}
                className="movieEdit"
                id = "movieSynopsis"
              />
               <textarea
                type="text"
                value={movie.reviews}
                className="movieEdit"
                id = "movieReviews"
              />
               <textarea
                type="text"
                value={movie.trailer_picture}
                className="movieEdit"
                id = "movieTrailerPicture"
              />
               <textarea
                type="text"
                value={movie.trailer_video}
                className="movieEdit"
                id = "movieTrailerVideo"
              />
               <textarea
                type="text"
                value={movie.mpaaRating}
                className="movieEdit"
                id = "movieRating"
              />
               <textarea
                type="text"
                value={movie.showtime}
                className="movieEdit"
                id = "movieShowtime"
              />
               <textarea
                type="text"
                value={movie.poster_url}
                className="movieEdit"
                id = "moviePoster"
              />
               <textarea
                type="text"
                value={movie.status
                }
                className="movieEdit"
                id = "movieStatus"
              />
              </form>
               <button className="movieEditButton" onClick={publishMovie}>Update Movie</button>
                <button className="movieEditButton" onClick={publishMovie}>Remove Movie</button>
            </div>
        ))}
        </div>
    </section>
      </section>
    </div>
  );
}

export default AdminMovies;

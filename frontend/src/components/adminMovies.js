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
    const director = document.getElementById("movieDir");
    const category = document.getElementById("movieCat");
    const rating = document.getElementById("rating");
    const poster = document.getElementById("poster");
    const producer = document.getElementById("movieProd");
    const reviews = document.getElementById("reviews");
    const showtime = document.getElementById("showtime");
    const synopsis = document.getElementById("syn");
    const title = document.getElementById("movieTitle");
    const trailerPic = document.getElementById("movieTrailPic");
    const trailerLink = document.getElementById("trailLink");
    
    const publishedMovie = {
    
      castMembers: cast.value,
      director: director.value,
      mpaaRating: rating.value,
      poster_url: poster.value,
      producer: producer.value,
      reviews: reviews.value,
      showtime: showtime.value,
      synopsis: synopsis.value,
      title: title.value,
      trailer_picture: trailerPic.value,
      trailer_video: trailerLink.value

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
    document.getElementById("Mform2").reset();
    document.getElementById("Mform3").reset();
    document.getElementById("Mform4").reset();
      
  };
  

  return (
    <div className="bodyDiv">
      <section className="contentSection">
        <section className="bodySection">
          <div className="bodyTextDiv">
             <h1>Add a New Movie</h1>
            <div className="movie-input">
              <form id="Mform">
              <input
                type="text"
                placeholder="Title"
                className="login-input"
                id = "movieName"
              />
              <input
                type="text"
                placeholder="Director"
                className="login-input"
                id = "directorName"
              />
               <input
                type="text"
                placeholder="Producer"
                className="login-input"
                id = "producerName"
              />
              <input
                type="text"
                placeholder="Synopsis"
                className="login-input"
                id = "movieSynopsis"
              />
               <input
                type="test"
                placeholder="Movie Review"
                className="login-input"
                id = "movieReview"
              />
              <input
                type="url"
                placeholder="Trailer Picture"
                className="login-input"
                id = "trailerPicture"
              />
               <input
                type="url"
                placeholder="Trailer Video"
                className="login-input"
                id = "trailerVideo"
              />
              <input
                type="text"
                placeholder="Rating"
                className="login-input"
                id = "movieRating"
              />
              <input 
                type="text"
                placeholder="director"
                className="movie-input"
                id = "movieDir"
              />
              </form>
              <form id="Mform2">
                <input 
                type="text"
                placeholder="mpaa rating"
                className="movie-input"
                id = "rating"
              />
              <input 
                type="text"
                placeholder="poster url"
                className="movie-input"
                id = "poster"
              />
              <input 
                type="text"
                placeholder="producer"
                className="movie-input"
                id = "movieProd"
              />
              <input 
                type="text"
                placeholder="reviews"
                className="movie-input"
                id = "reviews"
              />
              </form>
              <form id="Mform3">
                <input 
                type="number"
                placeholder="showtime"
                className="movie-input"
                id = "showtime"
              />
              <input 
                type="text"
                placeholder="synopsis"
                className="movie-input"
                id = "syn"
              />
              <input 
                type="text"
                placeholder="title"
                className="movie-input"
                id = "movieTitle"
              />
              <input 
                type="text"
                placeholder="trailer Picture"
                className="movie-input"
                id = "movieTrailPic"
              />
              </form>
              <form id="Mform4">
                <input 
                type="text"
                placeholder="trailer link"
                className="movie-input"
                id = "trailLink"
              />
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
              <input
                type="text"
                value={movie.title}
                className="movieEdit"
                id = "movieName"
              />
              <input
                type="text"
                value={movie.category}
                className="movieEdit"
                id = "movieCategory"
              />
               <input
                type="text"
                value={movie.director}
                className="movieEdit"
                id = "movieDirector"
              />
               <input
                type="text"
                value={movie.producer}
                className="movieEdit"
                id = "movieProducer"
              />
               <input
                type="text"
                value={movie.castMembers}
                className="movieEdit"
                id = "castMembers"
              />
               <input
                type="text"
                value={movie.synopsis}
                className="movieEdit"
                id = "movieSynopsis"
              />
               <input
                type="text"
                value={movie.reviews}
                className="movieEdit"
                id = "movieReviews"
              />
               <input
                type="text"
                value={movie.trailer_picture}
                className="movieEdit"
                id = "movieTrailerPicture"
              />
               <input
                type="text"
                value={movie.trailer_video}
                className="movieEdit"
                id = "movieTrailerVideo"
              />
               <input
                type="text"
                value={movie.mpaaRating}
                className="movieEdit"
                id = "movieRating"
              />
               <input
                type="text"
                value={movie.showtime}
                className="movieEdit"
                id = "movieShowtime"
              />
               <input
                type="text"
                value={movie.poster_url}
                className="movieEdit"
                id = "moviePoster"
              />
               <input
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

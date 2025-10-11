import React from "react";
import "./loginPage.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";


function LoginPage() {
  const navigate = useNavigate();

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
            <div className="movie-input">
              <h1>Manage Movies Page</h1>
              <input
                type="text"
                placeholder="Movie Name"
                className="login-input"
                id = "movieName"
              />
              <input
                type="text"
                placeholder="Director Name"
                className="login-input"
                id = "directorName"
              />
               <input
                type="text"
                placeholder="Producer Name"
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
      </section>
    </div>
  );
}

export default LoginPage;

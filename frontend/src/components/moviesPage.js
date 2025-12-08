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

  const searchTerm1 = query.get("title")?.toLowerCase() || "";
  const searchTerm2 = query.get("category")?.toLowerCase() || "";
  const searchTerm3 = query.get("castMembers")?.toLowerCase() || "";
  const searchTerm4 = query.get("director")?.toLowerCase() || "";
  const searchTerm5 = query.get("producer")?.toLowerCase() || "";
  const searchTerm6 = query.get("synopsis")?.toLowerCase() || "";
  const searchTerm7 = query.get("reviews")?.toLowerCase() || "";
  const searchTerm8 = query.get("mpaaRating")?.toLowerCase() || "";
  const searchTerm9 = query.get("status")?.toLowerCase() || "";
  //const searchTerm10 = query.get("showtime")?.toLowerCase() || "";
 
  let currentTerm = searchTerm1 || searchTerm2 || searchTerm3 || searchTerm4 || searchTerm5 || searchTerm6 
  || searchTerm7 || searchTerm8 || searchTerm9;
  //let unique = null;

 /** 
  let currentTerm = null;
  let field = null;
 if (searchTerm1 != null) {
   currentTerm = searchTerm1;
   field = "title=";
  } else if (searchTerm2 != null) {
    searchTerm1 = null;
   currentTerm = searchTerm2;
   field = "category=";
  }
*/
  
  
 useEffect(() => {
  //unique = currentTerm;
 let url = "http://localhost:9090/api/movies";
//let unique = null

   
  if (searchTerm1 || searchTerm2 || searchTerm3 || searchTerm4 || searchTerm5|| searchTerm6 
  || searchTerm7 || searchTerm8 || searchTerm9) {
    
    const params = new URLSearchParams();

    if(searchTerm1) {
      params.append("title", searchTerm1);
    }

    if(searchTerm2) {
      params.append("category", searchTerm2);
    }

    if(searchTerm3) {
      params.append("castMembers", searchTerm3)
    }

    if(searchTerm4) {
      params.append("director", searchTerm4)
    }

    if(searchTerm5) {
      params.append("producer", searchTerm5)
    }

    if(searchTerm6) {
      params.append("synopsis", searchTerm6)
    }

    if(searchTerm7) {
      params.append("reviews", searchTerm7)
    }

    if(searchTerm8) {
      params.append("mpaaRating", searchTerm8)
    }

    if(searchTerm9) {
      params.append("status", searchTerm9)
    }

    

    url = `${url}?${params.toString()}`;
  }

  fetch(url)
  .then((res) => {
        if (!res.ok) throw new Error(`HTTP status: ${res.status}`);
        return res.json();
      })
      .then((data) => setMovies(data))
      .catch((err) => {
          console.error("Error loading movies:", err);
          setMovies([]); 
      });
    
 }, [searchTerm1, searchTerm2, searchTerm3, searchTerm4, searchTerm5, searchTerm6, searchTerm7, searchTerm8, searchTerm9]);

  // Fetch movies
 


  // Fetch showtimes
  // Fetch showtimes
  useEffect(() => {
    fetch("http://localhost:9090/api/showtimes")
      .then((res) => res.json())
      .then((data) => setShowtimes(data))
      .catch((err) => console.error("Error loading showtimes:", err));
  }, []);
  //const filteredMovies = movies;
  // Filter showtimes for selected movie
  const getMovieShowtimes = (movieId) =>
    showtimes.filter((s) => s.movieId === movieId);

  const goToDetails = (movie) => {
    const id = movie.movieId;
    navigate(`/movieDescription/${id}`);
  };

  
   const filteredMovies = movies.filter((m) => {

     if(!currentTerm) {
      return true;
     }
      
      if (searchTerm1 && m.title.toLowerCase().includes(currentTerm)) {
        return true;
      } 

      if(searchTerm2 && m.category.toLowerCase().includes(currentTerm)) {
       return true;
      }

      if(searchTerm3 && m.castMembers.toLowerCase().includes(currentTerm)) {
       return true;
      }

      if(searchTerm4 && m.director.toLowerCase().includes(currentTerm)) {
       return true;
      }

       if(searchTerm5 && m.producer.toLowerCase().includes(currentTerm)) {
       return true;
      }

      if(searchTerm6 && m.synopsis.toLowerCase().includes(currentTerm)) {
       return true;
      }

      if(searchTerm7 && m.reviews.toLowerCase().includes(currentTerm)) {
       return true;
      }

      if(searchTerm8 && m.mpaaRating.toLowerCase().includes(currentTerm)) {
       return true;
      }

      if(searchTerm9 && m.status.toLowerCase().includes(currentTerm)) {
       return true;
      }

     
      
    })
   

  return (
    <div className="moviesPageContainer">
      <h1 className="moviesHeader">Now Showing</h1>
      <p className="moviesSubheader">
        {currentTerm
          ? `Search results for “${currentTerm}”`
          : "Click a movie to view its showtimes"}
      </p>

      {filteredMovies.length === 0 && currentTerm? (
        <p className="noResultsText">No movies found matching "{currentTerm}"</p>
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
                            {new Date(s.showDate).toLocaleDateString()}
                          </p>
                          <p className="showtimeTime">
                            {" "}
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

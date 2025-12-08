import React, { useEffect, useState } from "react";
import "./moviesPage.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function MoviesPageShows() {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
 
  const navigate = useNavigate();
  const query = useQuery();

  
  const searchTerm10 = query.get("showtime")?.toLowerCase() || "";
  let url1 = "http://localhost:9090/api/movies/";
  let currentTerm = searchTerm10;
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
  let unique = null;
 let url2 = "http://localhost:9090/api/showtimes";
    if (!searchTerm10) {
        setMovies([]);
      return;
    }
      const start1 = searchTerm10;
      const end1 = start1;
      const params = new URLSearchParams({
        start: start1,
        end: end1
      });
   
     url2 = `${url2}?${params.toString()}`;
      let movId = null;
    fetch(url2)
      .then((res) => res.json())
      .then((data) => { setShowtimes(data);
       unique = Array.from(new Map(data.map(item=>[item.movieId, {
        movieId: item.movieId,
        title: item.title,
        poster_url: item.posterUrl,
        category: item.category || 'N/A',
        mpaaRating: 'N/A'
      }])
    ).values());
      movId = unique.movieId; 
      console.log("Showtime Fetch Status. Total Movies Found:", unique.length);
      setMovies(unique);
      })
      .catch((err) => console.error("Error loading showtimes:", err));

   
      
    
     
    
      
     

  }, [searchTerm10]);
  // Fetch movies
  /** 
  useEffect(() => {
    fetch("http://localhost:9090/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Error loading movies:", err));
  }, []);
*/
  // Fetch showtimes
  
    
    
  //const filteredMovies = movies;
  // Filter showtimes for selected movie
  const getMovieShowtimes = (movieId) =>
    showtimes.filter((s) => s.movieId === movieId);

  const goToDetails = (movie) => {
    const id = movie.movieId;
    navigate(`/movieDescription/${id}`);
  };

  
   const filteredMovies = movies;
    
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

import logo from "../logo512.png"; 
import "./welcomePage.css";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const fallbackMovies = [
  {
    movie_id: 1,
    title: "Demon Slayer: Infinity Castle",
    poster_url:
      "https://res.cloudinary.com/dvucimldu/image/upload/v1759469874/onesheet_qz7tj5.jpg",
  },
  {
    movie_id: 2,
    title: "Weapons",
    poster_url:
      "https://res.cloudinary.com/dvucimldu/image/upload/v1759469930/MV5BNTBhNWJjZWItYzY3NS00M2NkLThmOWYtYTlmNzBmN2UxZWFjXkEyXkFqcGc._V1_FMjpg_UX1000__fsm2p4.jpg",
  },
  {
    movie_id: 3,
    title: "The Conjuring",
    poster_url:
      "https://res.cloudinary.com/dvucimldu/image/upload/v1759469900/new-poster-for-the-conjuring-last-rites-v0-4a68gyttrsif1_x6jhgi.webp",
  },
];

export default function WelcomePage() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    // Try fetching from backend API
    fetch("http://localhost:9090/api/movies")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network error");
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setMovies(data);
        } else {
          console.warn("No movies found in database — using fallback data.");
          setMovies(fallbackMovies);
        }
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setMovies(fallbackMovies);
      });
  }, []);
   
  return (
    <div className="bodyDiv">
      <section className="contentSection">
        <section className="bodySection">
          <div className="bodyTextDiv">
            <h1 className="headerText">Experience Cinema Like <span>Never</span>  Before</h1>
            <p className="smallerText">
              Immerse yourself in the latest blockbusters with state-of-the-art
              sound, crystal-clear visuals, and luxury seating that puts you
              right in the action.
            </p>
            <div className="bodyButtonDiv">
              <a className="bigButton" href="/login">Book Tickets Now</a>
              <a className="bigButton" href="/movies">Watch Trailers</a>
            </div>
          </div>
        </section>

        {/* Caleb Currently Showing Movie Carousel */}
        <section className="dualCarouselSection">
          {/* Now Showing */}
          <div className="carouselBox">
            <h2 className="carouselHeader">Now Showing</h2>
            <Swiper
              spaceBetween={30}
              centeredSlides={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              className="movieSwiper"
            >
              {movies.map((movie) => (
                <SwiperSlide key={movie.movie_id}>
                  <div className="carouselSlide">
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="carouselImage"
                    />
                    <h3 className="carouselTitle">{movie.title}</h3>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Upcoming Movies placeholder */}
          <div className="carouselBox">
            <h2 className="carouselHeader">Upcoming Movies</h2>
            <div className="carouselPlaceholder">
              <p>Coming Soon...</p>
            </div>
          </div>
        </section>
        <section className="bodySection">
          <div className="bodyTextDiv">
            <div className="primaryDiv">
              <h2 className="smallHeader">Why Choose Absolute Cinema?</h2>
              <p className="smallerText">
                Premium cinema experience with cutting-edge technology
              </p>
            </div>
            <div className="gridDiv">
              <div className="primaryDiv">
                <h3 className="smallHeader">Dolby Atmos Sound</h3>
                <p className="smallerText">
                  Immersive 3D audio that puts you right in the middle of the
                  action with crystal-clear sound quality.
                </p>
              </div>
              <div className="primaryDiv">
                <h3 className="smallHeader">4K Laser Projection</h3>
                <p className="smallerText">
                  Ultra-high definition visuals with vibrant colors and sharp
                  details that bring movies to life.
                </p>
              </div>
              <div className="primaryDiv">
                <h3 className="smallHeader">Luxury Reclining Seats</h3>
                <p className="smallerText">
                  Plush leather recliners with personal tables and cup holders
                  for maximum comfort during your movie.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="bodySection">
          <div className="bodyTextDiv">
            <div className="primaryDiv">
              <h2 className="headertext">Today's Showtimes</h2>
              <p className="smallertext">
                Select your preferred time and book instantly
              </p>
            </div>
          </div>
        </section>
      </section>
      <section className="bottomSection">
        <div className="primaryDiv">
          <footer className="mainFooter"></footer>
        </div>
      </section>
    </div>
  );
}


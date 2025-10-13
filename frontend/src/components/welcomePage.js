import logo from "../logo512.png"; 
import "./welcomePage.css";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { fallbackMovies } from "../data/fallbackMovies";
import Modal from "react-modal";
Modal.setAppElement("#root"); 



export default function WelcomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTrailer, setCurrentTrailer] = useState("");
  const [showtimes, setShowtimes] = useState([]);


const handleWatchTrailer = (url) => {
    if (url) {
      setCurrentTrailer(url);
      setModalOpen(true);
    } else {
      alert("Trailer not available for this movie.");
    }
  };
  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("embed")) return url;
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/") + "?autoplay=1";
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/") + "?autoplay=1";
    return url;
  };
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
   
    const nowShowing = movies.filter((m) => m.status === "NOW_PLAYING");
  const comingSoon = movies.filter((m) => m.status === "COMING_SOON");
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
            </div>
          </div>
        </section>

        {/* Featured Trailers Section */}
      <section className="trailerSection">
        <h2 className="carouselHeader">Featured Trailers</h2>
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{ delay: 8000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="trailerSwiper"
        >
          {movies
            .filter((m) => m.trailer_video)
            .map((movie) => (
              <SwiperSlide key={movie.movie_id}>
                <div className="trailerSlide">
                  <img
                    className="trailerImage"
                    src={movie.trailer_picture || movie.poster_url}
                    alt={movie.title}
                  />
                  <div className="trailerOverlay">
                    <h2 className="trailerTitle">{movie.title}</h2>
                    <p className="trailerCategory">{movie.category}</p>
                    <button
                      className="watchButton"
                      onClick={() => handleWatchTrailer(movie.trailer_video)}
                    >
                      ▶ Watch Trailer
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </section>
       {/* Modal for YouTube trailer */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Trailer Modal"
        className="trailerModal"
        overlayClassName="trailerOverlayModal"
        shouldFocusAfterRender={true} // adjust as needed
      >
        <button className="watchButton" onClick={() => setModalOpen(false)}>
          ✕ Close
        </button>
        {currentTrailer && (
          <iframe
            width="100%"
            height="480"
            src={getEmbedUrl(currentTrailer)}
            title="YouTube trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </Modal>

        {/* Caleb Currently Showing Movie Carousel */}
        <section className="dualCarouselSection">
          {/* Now Showing */}
          <div className="carouselBox">
            <h2 className="carouselHeader">Now Showing</h2>
            {nowShowing.length > 0 ? (
              <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="movieSwiper"
              >
                {nowShowing.map((movie) => (
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
            ) : (
              <div className="carouselPlaceholder">
                <p>No movies currently showing.</p>
              </div>
            )}
          </div>


          {/* Upcoming Movies placeholder */}
          <div className="carouselBox">
            <h2 className="carouselHeader">Coming Soon</h2>
            {comingSoon.length > 0 ? (
              <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="movieSwiper"
              >
                {comingSoon.map((movie) => (
                  <SwiperSlide key={movie.movie_id}>
                    <div className="carouselSlide" data-movie-id={movie.movie_id}>
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
            ) : (
              <div className="carouselPlaceholder">
                <p>Coming Soon...</p>
              </div>
            )}
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
      </section>
      <section className="bottomSection">
        <div className="primaryDiv">
          <footer className="mainFooter"></footer>
        </div>
      </section>
    </div>
  );
}


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
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

export default function WelcomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTrailer, setCurrentTrailer] = useState("");
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  // prefix for customer vs public user
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const prefix = ""; 
  const handleWatchTrailer = (url) => {
    if (!url) return alert("Trailer not available");
    setCurrentTrailer(url);
    setModalOpen(true);
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("embed")) return url;
    if (url.includes("watch?v="))
      return url.replace("watch?v=", "embed/") + "?autoplay=1";
    if (url.includes("youtu.be/"))
      return url.replace("youtu.be/", "www.youtube.com/embed/") + "?autoplay=1";
    return url;
  };

  useEffect(() => {
    fetch("http://localhost:9090/api/movies")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) setMovies(data);
        else setMovies(fallbackMovies);
      })
      .catch(() => setMovies(fallbackMovies));
  }, []);

  const nowShowing = movies.filter((m) => m.status === "NOW_PLAYING");
  const comingSoon = movies.filter((m) => m.status === "COMING_SOON");

  return (
    <div className="bodyDiv">
      <section className="contentSection">

        {/* HERO SECTION */}
        <section className="bodySection">
          <div className="bodyTextDiv">
            <h1 className="headerText">
              Experience Cinema Like <span>Never</span> Before
            </h1>
            <p className="smallerText">
              Immerse yourself in the latest blockbusters with state-of-the-art
              sound, crystal-clear visuals, and luxury seating.
            </p>

            <button
              className="bigButton"
              onClick={() => navigate("/movies")}>
            
              Book Tickets Now
            </button>
          </div>
        </section>

        {/* FEATURED TRAILERS */}
        <section className="trailerSection">
          <h2 className="carouselHeader">Featured Trailers</h2>
          <Swiper
            spaceBetween={30}
            centeredSlides
            autoplay={{ delay: 8000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            modules={[Autoplay, Pagination, Navigation]}
            className="trailerSwiper"
          >
            {movies
              .filter((m) => m.trailer_video)
              .map((movie) => (
                <SwiperSlide key={movie.movieId}>
                  <div className="trailerSlide">
                    <img
                      className="trailerImage"
                      src={movie.trailer_picture || movie.poster_url}
                      onClick={() => navigate(`/movieDescription/${movie.movieId}`)}

                      style={{ cursor: "pointer" }}
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

        {/* TRAILER MODAL */}
        <Modal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          className="trailerModal"
          overlayClassName="trailerOverlayModal"
        >
          <button className="watchButton" onClick={() => setModalOpen(false)}>
            ✕ Close
          </button>
          {currentTrailer && (
            <iframe
              width="100%"
              height="480"
              src={getEmbedUrl(currentTrailer)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </Modal>

        {/* NOW SHOWING + COMING SOON */}
        <section className="dualCarouselSection">

          {/* NOW SHOWING */}
          <div className="carouselBox">
            <h2 className="carouselHeader">Currently Running</h2>
            {nowShowing.length > 0 ? (
              <Swiper
                spaceBetween={30}
                centeredSlides
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation
                modules={[Autoplay, Pagination, Navigation]}
                className="movieSwiper"
              >
                {nowShowing.map((movie) => (
                  <SwiperSlide key={movie.movieId}>
                    <div className="carouselSlide">
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="carouselImage"
                        onClick={() => navigate(`/movieDescription/${movie.movieId}`)}
                        style={{ cursor: "pointer" }}
                      />
                      <h3 className="carouselTitle">{movie.title}</h3>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p>No movies currently showing.</p>
            )}
          </div>

          {/* COMING SOON */}
          <div className="carouselBox">
            <h2 className="carouselHeader">Coming Soon</h2>
            {comingSoon.length > 0 ? (
              <Swiper
                spaceBetween={30}
                centeredSlides
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation
                modules={[Autoplay, Pagination, Navigation]}
                className="movieSwiper"
              >
                {comingSoon.map((movie) => (
                  <SwiperSlide key={movie.movieId}>
                    <div className="carouselSlide" data-movie-id={movie.movieId}>
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="carouselImage"
                        onClick={() => navigate(`/movieDescription/${movie.movieId}`)}

                        style={{ cursor: "pointer" }}
                      />
                      <h3 className="carouselTitle">{movie.title}</h3>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p>Coming Soon…</p>
            )}
          </div>
        </section>

        {/* BOTTOM SECTION */}
        <section className="bodySection">
          <div className="bodyTextDiv">
            <div className="primaryDiv">
              <h2 className="smallHeader">Why Choose Absolute Cinema?</h2>
              <p className="smallerText">
                Premium cinema experience with cutting-edge tech.
              </p>
            </div>

            <div className="gridDiv">
              <div className="primaryDiv">
                <h3 className="smallHeader">Dolby Atmos Sound</h3>
                <p className="smallerText">Immersive 3D audio.</p>
              </div>
              <div className="primaryDiv">
                <h3 className="smallHeader">4K Laser Projection</h3>
                <p className="smallerText">Ultra-high definition visuals.</p>
              </div>
              <div className="primaryDiv">
                <h3 className="smallHeader">Luxury Recliners</h3>
                <p className="smallerText">Maximum comfort seating.</p>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="bottomSection">
        <footer className="mainFooter"></footer>
      </section>
    </div>
  );
}

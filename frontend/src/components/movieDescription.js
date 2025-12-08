import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./movieDescription.css"; // reuse your styles

const API = "http://localhost:9090";



// helpers
function groupByDate(list) {
  return list.reduce((acc, s) => {
    const key = s.showDate; // "YYYY-MM-DD"
    (acc[key] = acc[key] || []).push(s);
    return acc;
  }, {});
}
function fmtDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
function fmtTime(t) {
  const hhmm = t.length === 5 ? `${t}:00` : t;
  const d = new Date(`1970-01-01T${hhmm}`);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function youtubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

export default function MovieDescription() {
  const { id } = useParams(); // /movies/:id
  const nav = useNavigate();

  const [movie, setMovie] = useState(null);
  const [mState, setMState] = useState({ loading: true, error: null });

  const [showtimes, setShowtimes] = useState([]);
  const [sState, setSState] = useState({ loading: true, error: null });
  const goToShowtime = (id) => {
    nav(`/seat-selection/${id}`);
  };

  // fetch the movie
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setMState({ loading: true, error: null });
      try {
        const res = await fetch(`${API}/api/movies/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setMovie(data);
          setMState({ loading: false, error: null });
        }
      } catch (e) {
        if (!cancelled)
          setMState({
            loading: false,
            error: e.message || "Failed to load movie",
          });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // fetch showtimes (optional UI)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setSState({ loading: true, error: null });
      try {
        const res = await fetch(
          `${API}/api/showtimes?start=2000-01-01&end=2100-01-01`
        );        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setShowtimes(Array.isArray(data) ? data : []);
          setSState({ loading: false, error: null });
        }
      } catch (e) {
        if (!cancelled)
          setSState({
            loading: false,
            error: e.message || "Failed to load showtimes",
          });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // normalize fields
  const poster =
    movie?.poster_url || "https://via.placeholder.com/600x900?text=No+Poster";
  const title = movie?.title || "Movie";
  const rating =
    movie?.rating ?? movie?.mpaaRating ?? movie?.mpaa_rating ?? "NR";
  const genre = movie?.genre ?? movie?.category ?? "—";
  const cast = movie?.cast ?? movie?.castMembers ?? "—";
  const trailer = movie?.trailer_url ?? movie?.trailer_video ?? "";
  const trailerYt = youtubeId(trailer);
  const trailerThumb = movie?.trailer_picture || poster;

  // filter + group showtimes for this movie
  const myShowtimes = useMemo(() => {
    const movieId = movie?.movieId ?? movie?.movie_id ?? Number(id);
    return showtimes.filter((s) => (s.movieId ?? s.movie_id) === movieId);
  }, [showtimes, movie, id]);
  const grouped = useMemo(() => {
    const g = groupByDate(myShowtimes);
    Object.values(g).forEach((arr) =>
      arr.sort((a, b) => (a.showTime || "").localeCompare(b.showTime || ""))
    );
    return g;
  }, [myShowtimes]);
  const dateKeys = useMemo(() => Object.keys(grouped).sort(), [grouped]);
  dateKeys.map((d) => console.log(fmtDate(d)));
  // loading / error states
  if (mState.loading) {
    return (
      <div className="moviesPageContainer">
        <div
          className="movie-card skeleton"
          style={{ height: 180, borderRadius: 12 }}
        />
      </div>
    );
  }
  if (mState.error) {
    return (
      <div className="moviesPageContainer">
        <div className="alert alert-danger">
          Failed to load movie: {mState.error}
        </div>
        <button className="btn btn-outline-light" onClick={() => nav(-1)}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="moviesPageContainer" style={{ background: "#000" }}>
      {/* Trailer first */}
      <div className="movieDetailSection">
        <div className="trailerWrap">
          {trailerYt ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailerYt}`}
              title="Trailer"
              allowFullScreen
            />
          ) : trailer ? (
            <div className="trailerFallback">
              <a href={trailer} target="_blank" rel="noreferrer">
                Open trailer
              </a>
            </div>
          ) : (
            <div className="trailerFallback">
              <img src={trailerThumb} alt={title} />
            </div>
          )}
        </div>

        <div className="detailContent">
          <h1 className="detailTitle">{title}</h1>
          <div className="detailMeta">
            <span>{rating}</span>
            <span className="dot">•</span>
            <span>{genre}</span>
          </div>

          <div className="detailsGrid">
            <div className="detailBlock">
              <h3>Overview</h3>
              <div className="detailText">
                {movie?.synopsis || "No synopsis provided."}
              </div>
            </div>
            <div className="detailBlock">
              <h3>Credits</h3>
              <div>
                <span className="detailLabel">Director:</span>{" "}
                <span className="detailText">{movie?.director || "—"}</span>
              </div>
              <div>
                <span className="detailLabel">Producer:</span>{" "}
                <span className="detailText">{movie?.producer || "—"}</span>
              </div>
              <div>
                <span className="detailLabel">Cast:</span>{" "}
                <span className="detailText">{cast}</span>
              </div>
            </div>
          </div>

          <div className="showtimesSection">
            <h2 className="showtimesHeader">Showtimes</h2>
            {sState.loading ? (
              <div className="noShowtimes">Loading showtimes…</div>
            ) : dateKeys.length === 0 ? (
              <div className="noShowtimes">No showtimes available.</div>
            ) : (
              <div className="showtimesGrid">
                {dateKeys.map((d) => (
                  <div className="showDateCol" key={d}>
                    <h4>{fmtDate(d)}</h4>
                    {grouped[d].map((s) => (
                      <button
                        key={s.showtimeId}
                        className="timeBtn"
                        type="button"
                        onClick={() => goToShowtime(s.showtimeId)}
                      >
                        {fmtTime(s.showTime || s.time)}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="btn btn-outline-light" onClick={() => nav(-1)}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

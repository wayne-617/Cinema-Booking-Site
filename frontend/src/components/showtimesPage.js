import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./showtimesPage.css";


function ShowtimesPage() {
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const start = "2025-10-14";
    const end = "2025-10-18";

    fetch(`http://localhost:9090/api/showtimes?start=${start}&end=${end}`)
      .then((res) => res.json())
      .then((data) => {
        setShowtimes(data);
        if (data.length > 0) setSelectedDate(data[0].showDate);
      })
      .catch((err) => console.error("Error fetching showtimes:", err));
  }, []);

  // Group showtimes by date
  const grouped = showtimes.reduce((acc, s) => {
    if (!acc[s.showDate]) acc[s.showDate] = [];
    acc[s.showDate].push(s);
    return acc;
  }, {});

  // Convert SQL-style HH:mm:ss to readable 12-hour time
  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // When user clicks a showtime card
  const handleShowtimeClick = (showtimeId) => {
    if (window.location.pathname.includes("/customer")) {



    navigate(`/customer/seat-selection/${showtimeId}`);
    } else {
       navigate(`/seat-selection/${showtimeId}`);
    }
  };

  return (
    <div className="showtimes-container">
      <h1>🎬 Showtimes</h1>

      {/* Date Buttons */}
      <div className="day-selector">
        {Object.keys(grouped).map((date) => (
          <button
            key={date}
            className={`day-btn ${selectedDate === date ? "active" : ""}`}
            onClick={() => setSelectedDate(date)}
          >
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </button>
        ))}
      </div>

      {/* Showtimes for selected day */}
      <div className="times-grid">
        {selectedDate && grouped[selectedDate] ? (
          grouped[selectedDate].map((st, index) => (
            <div
              key={index}
              className="movie-card"
              onClick={() => handleShowtimeClick(st.showtimeId)}
            >
              <img
                src={st.posterUrl}
                alt={st.title}
                className="movie-poster"
              />
              <h3>{st.title}</h3>
              <p className="time-text">{formatTime(st.showTime)}</p>
              <p className="click-text">🎟 Click to reserve seats</p>
            </div>
          ))
        ) : (
          <p>No showtimes available for this date.</p>
        )}
      </div>
    </div>
  );
}

export default ShowtimesPage;

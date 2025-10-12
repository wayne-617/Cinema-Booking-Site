import React, { useEffect, useState } from "react";
import "./showtimesPage.css";

function ShowtimesPage() {
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // Adjust your date range here
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

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="showtimes-container">
      <h1>🎬 Showtimes</h1>

      {/* Date buttons */}
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

      {/* Display times for selected date */}
      <div className="times-grid">
        {selectedDate && grouped[selectedDate] ? (
          grouped[selectedDate].map((st, index) => (
            <div key={index} className="movie-card">
              <img src={st.posterUrl} alt={st.title} />
              <h3>{st.title}</h3>
              <p className="time-text">{formatTime(st.showTime)}</p>
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

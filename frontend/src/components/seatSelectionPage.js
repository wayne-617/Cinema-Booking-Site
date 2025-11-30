import React, { useState, useEffect } from "react";
import axios from "axios";
import "./seatSelection.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function SeatSelection() {
   const { showtimeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.userId;
  const token = storedUser?.token;

  const [selected, setSelected] = useState([]);  
  const [seats, setSeats] = useState([]);

  useEffect(() => {
  const fromState = location.state?.selectedSeats;
  const fromSession = JSON.parse(sessionStorage.getItem("orderData"))?.selectedSeats;

  if (fromState) {
    setSelected(fromState);
  } else if (fromSession) {
    setSelected(fromSession);
  }
}, [location.state]);
  
  // Load seats for this showtime
  useEffect(() => {
    if (!showtimeId) return;

   axios
  .get(`http://localhost:9090/api/seats/showtime/${showtimeId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
      .then((res) => {
        console.log("Loaded seats:", res.data);
        setSeats(res.data);
      })
      .catch((err) => {
        console.error("Seat load error:", err);
        alert("Unable to load seats.");
      });
  }, [showtimeId, token]);

  // Toggle seat selection
  const toggleSeat = (seatId) => {
    setSelected((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  // Continue → Order Summary
  const goToOrderSummary = () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    sessionStorage.setItem(
      "orderData",
      JSON.stringify({
        selectedSeats: selected,
        showtimeId,
        userId,
      })
    );

    navigate("/order-summary", {
      state: {
        selectedSeats: selected,
        showtimeId,
        userId,
      },
    });
  };

  return (
    <div className="seat-container">
      <h2 className="title">Seat Selection</h2>

      <div className="screen-section">
        <div className="screen">SCREEN</div>
      </div>

      <div className="seat-layout">
        {["A", "B", "C", "D", "E", "F"].map((row) => {
          const rowSeats = seats.filter((s) => s.seatRow === row);

          return (
            <div key={row} className="seat-row">
              <span className="row-label">{row}</span>

              {rowSeats.map((seat) => {
                const isSelected = selected.includes(seat.seatId);

                const img = seat.isBooked
                  ? "https://res.cloudinary.com/dvucimldu/image/upload/v1762966397/ClosedSeeat_ubht9m.png"
                  : isSelected
                  ? "https://res.cloudinary.com/dvucimldu/image/upload/v1762966397/SelectedSeat_r95h3g.png"
                  : "https://res.cloudinary.com/dvucimldu/image/upload/v1762966397/GreenOpenSeat_duzwwx.png";

                return (
                  <img
                    key={seat.seatId}
                    src={img}
                    className="seat-img"
                    onClick={() => !seat.isBooked && toggleSeat(seat.seatId)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      <button onClick={goToOrderSummary} disabled={selected.length === 0}>
        Continue ({selected.length} selected)
      </button>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./seatSelection.css";
import { useParams, useNavigate } from "react-router-dom";

export default function SeatSelection() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();

  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.userId;
  const token = storedUser?.token;

  // Redirect if not logged in
  useEffect(() => {
    if (!storedUser || !token) {
      navigate("/login");
    }
  }, []);

  // Load seats for this showtime
  useEffect(() => {
    if (!showtimeId) return;

    axios
      .get(`http://localhost:9090/api/seats/showtime/${showtimeId}`, {
        headers: { Authorization: `Bearer ${token}` } // ✅ FIXED
      })
      .then((res) => {
        setSeats(res.data);
      })
      .catch((err) => {
        console.error("Error loading seats:", err);
        alert("Unable to load seats.");
      });
  }, [showtimeId]);

  // Select / deselect a seat
  const toggleSeat = (seatId) => {
    setSelected((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  // Continue to Order Summary
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

  navigate("/customer/order-summary", {
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

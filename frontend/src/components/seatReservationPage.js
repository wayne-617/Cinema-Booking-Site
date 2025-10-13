import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./seatReservationPage.css";

function SeatReservationPage() {
  const { showtimeId } = useParams();

  const rows = 6;
  const cols = 8;

  // Mock API call or backend fetch for reserved seats
  const [reservedSeats, setReservedSeats] = useState(["B3", "B4", "C5", "D2"]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seatId) => {
    if (reservedSeats.includes(seatId)) return; // cannot select reserved seat
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleReserve = () => {
    alert(`You reserved: ${selectedSeats.join(", ")}`);
    // Here you’d POST to your backend to confirm reservation
  };

  const renderSeats = () => {
    const seats = [];
    for (let r = 0; r < rows; r++) {
      const rowLabel = String.fromCharCode(65 + r);
      const rowSeats = [];
      for (let c = 1; c <= cols; c++) {
        const seatId = `${rowLabel}${c}`;
        const isReserved = reservedSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);
        rowSeats.push(
          <div
            key={seatId}
            className={`seat ${
              isReserved
                ? "reserved"
                : isSelected
                ? "selected"
                : "available"
            }`}
            onClick={() => toggleSeat(seatId)}
          >
            {seatId}
          </div>
        );
      }
      seats.push(
        <div key={rowLabel} className="seatRow">
          {rowSeats}
        </div>
      );
    }
    return seats;
  };

  return (
    <div className="seatPageContainer">
      <h1 className="seatTitle">Seat Reservation</h1>
      <p className="showtimeInfo">Showtime ID: {showtimeId}</p>

      <div className="screen">SCREEN</div>

      <div className="seatsContainer">{renderSeats()}</div>

      <div className="legend">
        <div className="legendItem">
          <span className="seat available"></span> Available
        </div>
        <div className="legendItem">
          <span className="seat selected"></span> Selected
        </div>
        <div className="legendItem">
          <span className="seat reserved"></span> Unavailable
        </div>
      </div>

      <button className="reserveButton" onClick={handleReserve}>
        Confirm Reservation
      </button>
    </div>
  );
}

export default SeatReservationPage;

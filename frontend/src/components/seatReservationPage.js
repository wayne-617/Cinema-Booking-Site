import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./seatReservationPage.css";


function SeatReservationPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();

  const rows = 6;
  const cols = 8;

  // Mock reserved seats — this could later come from your DB
  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [tickets, setTickets] = useState([]);
  

  // Fake "fetch" of reserved seats based on showtimeId
  useEffect(() => {
    // In real app, you’d call:
    // fetch(`/api/showtimes/${showtimeId}/reserved-seats`)
    //   .then(res => res.json())
    //   .then(data => setReservedSeats(data));
    // Simulate different reserved seats for different showtimes:
    const mockData =
      showtimeId === "1"
        ? ["A2", "B3", "B4"]
        : showtimeId === "2"
        ? ["C5", "C6"]
        : ["D1", "E4"];
    setReservedSeats(mockData);
  }, [showtimeId]);

  // Handle seat selection toggle
  const toggleSeat = (seatId) => {
    if (reservedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
      setTickets(tickets.filter((t) => t.seatId !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
      setTickets([
        ...tickets,
        { seatId, ageType: "Adult", price: 12 }, // default adult
      ]);
    }
  };

  const handleAgeChange = (seatId, newAgeType) => {
    const newTickets = tickets.map((t) =>
      t.seatId === seatId
        ? { ...t, ageType: newAgeType, price: getPrice(newAgeType) }
        : t
    );
    setTickets(newTickets);
  };

  const getPrice = (ageType) => {
    switch (ageType) {
      case "Child":
        return 8;
      case "Senior":
        return 10;
      default:
        return 12;
    }
  };

  const total = tickets.reduce((sum, t) => sum + t.price, 0);

  const handleDeleteTicket = (seatId) => {
    setTickets(tickets.filter((t) => t.seatId !== seatId));
    setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
  };

  const handleCheckout = () => {
   
    
   
    
    const order = { tickets, total, showtimeId }; // <-- include showtimeId
    if (window.location.pathname.includes('/customer')) {
      navigate("/customer/checkout", { state: { order } });
    } else {
      navigate("/login");
    }
};

  // Seat grid renderer
  const renderSeats = () => {
    const seatGrid = [];
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
      seatGrid.push(
        <div key={rowLabel} className="seatRow">
          {rowSeats}
        </div>
      );
    }
    return seatGrid;
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

      {/* Ticket Summary */}
      {tickets.length > 0 && (
        <div className="orderSummary">
          <h2>Order Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Seat</th>
                <th>Age Type</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.seatId}>
                  <td>{t.seatId}</td>
                  <td>
                    <select
                      value={t.ageType}
                      onChange={(e) =>
                        handleAgeChange(t.seatId, e.target.value)
                      }
                    >
                      <option value="Child">Child</option>
                      <option value="Adult">Adult</option>
                      <option value="Senior">Senior</option>
                    </select>
                  </td>
                  <td>${t.price}</td>
                  <td>
                    <button
                      className="deleteButton"
                      onClick={() => handleDeleteTicket(t.seatId)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Total: ${total}</h3>

          <div className="orderActions">
            <button onClick={() => setTickets([])}>Update Order</button>
            <button onClick={handleCheckout}>Continue to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SeatReservationPage;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./seatReservationPage.css"; // Re-added your CSS import

function SeatReservationPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();

  // --- Auth & Loading State ---
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start in loading state

  const rows = 6;
  const cols = 8;

  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [tickets, setTickets] = useState([]);

  // --- Authentication Check Effect ---
  // This runs first to check if the user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      // Not logged in, redirect to login page
      navigate("/login");
    } else {
      // User is logged in, parse their data, stop loading
      setUser(JSON.parse(storedUser));
      setIsLoading(false);
    }
  }, [navigate]);

  // "Fetch" reserved seats based on showtimeId
  useEffect(() => {
    // Don't run this if we are still loading or haven't set the user
    if (isLoading || !user) return;

    // In real app, you’d call:
    // const { token } = user;
    // fetch(`/api/showtimes/${showtimeId}/reserved-seats`, {
    //   headers: { "Authorization": `Bearer ${token}` }
    // })
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
  }, [showtimeId, isLoading, user]); // Added dependencies

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
    if (!user) {
      // Use a custom modal or message component in a real app
      console.error("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    const order = {
      tickets,
      total,
      showtimeId,
      userId: user.userId, // <-- Add user ID for backend
      token: user.token, // <-- Add token for backend auth
    };
    navigate("/checkout", { state: { order } });
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
              isReserved ? "reserved" : isSelected ? "selected" : "available"
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

  // Show a loading screen while we check auth
  if (isLoading) {
    return (
      // Use your own CSS classes for centering/styling
      <div className="seatPageContainer" style={{ justifyContent: "center" }}>
        <h2 className="seatTitle">Loading...</h2>
      </div>
    );
  }

  // --- Main component render ---
  // This part only renders if the user is logged in
  return (
    <>
      {/* All inline styles have been removed */}
      <div className="seatPageContainer">
        <h1 className="seatTitle">Seat Reservation</h1>
        <p className="showtimeInfo">
          {/* You can now display user info if you want */}
          {/* User: {user.firstName} | Showtime ID: {showtimeId} */}
        </p>

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
              <button onClick={() => {
                setSelectedSeats([]);
                setTickets([]);
              }}>Clear Selection</button>
              <button onClick={handleCheckout}>Continue to Checkout</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SeatReservationPage;


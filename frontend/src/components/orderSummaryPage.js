import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./orderSummary.css";

export default function OrderSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get seat data from navigation OR session storage fallback
  const stateData = location.state || {};
  const sessionData = JSON.parse(sessionStorage.getItem("orderData")) || {};

  const showtimeId = stateData.showtimeId || sessionData.showtimeId;
  const selectedSeats = stateData.selectedSeats || sessionData.selectedSeats || [];

  // Read logged-in user
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;
  const storedUserId = storedUser?.userId; // ✅ FIXED — correct field

  const userId =
    stateData.userId ||
    sessionData.userId ||
    storedUserId; // fallback

  const [billing, setBilling] = useState(null);
  const [ticketTypes, setTicketTypes] = useState({});
  const [total, setTotal] = useState(0);

  // Redirect if not logged in
  useEffect(() => {
    if (!storedUser || !token) {
      alert("You must be logged in.");
      navigate("/login");
    }
  }, []);

  // Fetch billing
  useEffect(() => {
    if (!userId || !token) return;

    axios
      .get(`http://localhost:9090/billing/get/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBilling(res.data))
      .catch((err) => {
        console.error("Billing fetch failed:", err);
        alert("Unable to load billing information.");
      });
  }, [userId]);

  // Auto-calc total
  useEffect(() => {
    const calc = selectedSeats.reduce((sum, seatId) => {
      const type = ticketTypes[seatId] || "ADULT";
      return sum + (type === "CHILD" ? 8 : type === "SENIOR" ? 10 : 12.5);
    }, 0);
    setTotal(calc);
  }, [ticketTypes, selectedSeats]);

  // Create order
  const handleConfirm = async () => {
    try {
      const tickets = selectedSeats.map((seatId) => ({
        seatId,
        type: ticketTypes[seatId] || "ADULT",
      }));

      const res = await axios.post(
        `http://localhost:9090/api/orders/create`,
        tickets,
        {
          params: { userId, showtimeId },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/order-confirmation", {
        state: { bookingId: res.data.bookingNo },
      });
    } catch (err) {
      console.error("Order creation failed:", err);
      alert("Error creating order.");
    }
  };

  return (
    <div className="summary-container">
      <h2>Your Order Summary</h2>

      <div className="seats-card">
        <h3>Selected Seats</h3>
        <ul className="seats-list">
          {selectedSeats.map((id) => (
            <li key={id} className="seat-item">
              <span>Seat {id}</span>
              <select
                className="ticket-select"
                value={ticketTypes[id] || "ADULT"}
                onChange={(e) =>
                  setTicketTypes((prev) => ({
                    ...prev,
                    [id]: e.target.value,
                  }))
                }
              >
                <option value="ADULT">ADULT — $12.50</option>
                <option value="CHILD">CHILD — $8.00</option>
                <option value="SENIOR">SENIOR — $10.00</option>
              </select>
              
            </li>
          ))}
        </ul>
        <button
        className="edit-seats-btn"
        onClick={() =>
          navigate(`/seat-selection/${showtimeId}`, {
            state: {
              selectedSeats,
              showtimeId,
              userId,
              fromOrderSummary: true 
            },
          })
        }
      >
        Edit Seats
      </button>
      </div>

      <div className="billing-card">
        <h3>Billing Information</h3>

        {billing ? (
          <>
            <p><strong>Card:</strong> {billing.cardType} **** **** **** {billing.cardNumber?.slice(-4)}</p>
            <p><strong>Name:</strong> {billing.firstName} {billing.lastName}</p>
            <p><strong>Address:</strong> {billing.street}, {billing.city}, {billing.state} {billing.zip}</p>
          </>
        ) : (
          <p>No billing information found.</p>
        )}

        <button
          className="edit-billing-btn"
          onClick={() => navigate("/editProfile")}   // Send user to edit profile page
        >
          {billing ? "Update Billing" : "Add Billing"}
        </button>
      </div>

      <div className="total-card">
        <h2>Total: ${total.toFixed(2)}</h2>
      </div>
    
      
      

      <button className="confirm-btn" onClick={handleConfirm}>
        Proceed to Checkout
      </button>
    </div>
  );
}

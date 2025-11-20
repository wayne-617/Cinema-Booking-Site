import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./orderConfirmationPage.css";

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { bookingId } = location.state || {};
  const [order, setOrder] = useState(null);
  const [seats, setSeats] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;

  // Load main review info
  useEffect(() => {
    if (!bookingId || !token) return;

    axios
      .get(`http://localhost:9090/api/orders/review/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrder(res.data))
      .catch((err) => console.error("Failed loading order review:", err));
  }, [bookingId, token]);

  // Load seat list
  useEffect(() => {
  if (!bookingId || !token) return;

  axios
    .get(`http://localhost:9090/api/orders/${bookingId}/seats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setSeats(res.data))
    .catch((err) => console.error("Failed loading seat list:", err));
}, [bookingId, token]);

  if (!order) return <p>Loading order confirmation...</p>;

  return (
    <div className="confirmation-container">
      <h1>🎉 Order Confirmed!</h1>
      <p>Your booking was successful.</p>

      <h3>Movie</h3>
      <p>{order.movieTitle}</p>

      <h3>Purchase Date</h3>
      <p>{new Date(order.purchaseDate).toLocaleString()}</p>

      <h3>Billing</h3>
      <p>**** **** **** {order.lastFour}</p>

      <h3>Your Seats</h3>
      {seats.length > 0 ? (
        <ul>
          {seats.map((s) => (
            <li key={s.seatId}>
              Row {s.seatRow} — Seat {s.seatNumber}
            </li>
          ))}
        </ul>
      ) : (
        <p>No seat information available.</p>
      )}

      <h2>Total Paid: ${order.totalAmount?.toFixed(2)}</h2>

      <button className="bigButton" onClick={() => navigate("/movies")}>
        Back to Movies
      </button>
    </div>
  );
}

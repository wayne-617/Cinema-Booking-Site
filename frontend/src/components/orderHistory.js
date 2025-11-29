import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./orderHistory.css";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.userId;   // ✅ FIXED
  const token = storedUser?.token;

  useEffect(() => {
    if (!userId || !token) return;

    axios
      .get(`http://localhost:9090/api/bookings/history/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("History fetch error:", err));
  }, [userId, token]);

  return (
    <div className="history-container">
      <h1>Your Order History</h1>

      {orders.length === 0 ? (
        <p className="empty">No past purchases found.</p>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.bookingNo} className="order-card">

              <div className="order-header">
                <h3>{order.movieTitle}</h3>
                <span className="date">
                  {new Date(order.purchaseDate).toLocaleString()}
                </span>
              </div>

              <p><strong>Tickets:</strong> {order.tixNo}</p>
              <p><strong>Total Paid:</strong> ${order.totalAmount.toFixed(2)}</p>
              <p><strong>Last 4:</strong> {order.lastFour}</p>

              <button
                className="view-btn"
                onClick={() =>
                  navigate("/customer/order-confirmation", {
                    state: { bookingId: order.bookingNo }
                  })
                }
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

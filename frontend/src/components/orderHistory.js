import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./orderHistory.css";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.userId;
  const token = storedUser?.token;
  const role = storedUser?.role; // "ADMIN" or "CUSTOMER"

  useEffect(() => {
    if (!token) return;

    const endpoint =
      role === "ADMIN"
        ? "http://localhost:9090/api/bookings/admin/all"
        : `http://localhost:9090/api/bookings/history/${userId}`;

    axios
      .get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("History fetch error:", err));
  }, [role, userId, token]);

  const deleteOrder = (bookingNo) => {
    if (!window.confirm("Delete this order?")) return;

    axios
      .delete(`http://localhost:9090/api/bookings/admin/${bookingNo}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setOrders((prev) =>
          prev.filter((order) => order.bookingNo !== bookingNo)
        );
      })
      .catch((err) => console.error("Delete error:", err));
  };

  return (
    <div className="history-container">
      <h1>{role === "ADMIN" ? "All Orders (Admin)" : "Your Order History"}</h1>

      {orders.length === 0 ? (
        <p className="empty">No orders found.</p>
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
              {/* ONLY ADMINS SEE CUSTOMER NAME */}
              {role === "ADMIN" && order.customerName && (
                <p className="customer-name">
                  <strong>Customer:</strong> {order.customerName}
                </p>
              )}

              <p className="order-number">
                <strong>Order #:</strong> {order.bookingNo}
              </p>

              

              

              <p>
                <strong>Tickets:</strong> {order.tixNo ?? order.ticketCount ?? 1}
              </p>

              <p>
                <strong>Total Paid:</strong> ${order.totalAmount.toFixed(2)}
              </p>

              <p>
                <strong>Last 4:</strong> {order.lastFour ?? "N/A"}
              </p>

          

              {role === "ADMIN" && (
                <button
                  className="delete-btn"
                  onClick={() => deleteOrder(order.bookingNo)}
                >
                  Delete Order
                </button>
              )}

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

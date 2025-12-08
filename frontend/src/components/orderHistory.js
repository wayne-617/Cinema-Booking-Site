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

  const deleteCustomerOrder = async (bookingNo) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await axios.delete(
        `http://localhost:9090/api/bookings/customer/${bookingNo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            userId: storedUser.userId
          }
        }
      );

      setOrders(prev =>
        prev.filter(order => order.bookingNo !== bookingNo)
      );

    } catch (err) {
      console.error("Customer delete error:", err);
    }
  };

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

              {/* Title + Purchase Date */}
              <div className="order-header">
                <h3>{order.movieTitle}</h3>
                <span className="date">
                  Purchased: {new Date(order.purchaseDate).toLocaleString()}
                </span>
              </div>

              {/* ADMIN — Show customer */}
              {role === "ADMIN" && order.customerName && (
                <p className="customer-name">
                  <strong>Customer:</strong> {order.customerName}
                </p>
              )}

              {/* Booking Number */}
              <p>
                <strong>Booking #:</strong> {order.bookingNo}
              </p>

              {/* Ticket Number */}
              <p>
                <strong>Ticket #:</strong> {order.tixNo ?? "Not Assigned"}
              </p>

             

              {/* Total Paid */}
              <p>
                <strong>Total Paid:</strong> ${order.totalAmount.toFixed(2)}
              </p>

              {/* Last 4 Digits */}
              <p>
                <strong>Card:</strong> **** **** **** {order.lastFour ?? "N/A"}
              </p>

            
              {/* Booking Time */}
              <p>
                <strong>Show:</strong> {new Date(order.showDateTime).toLocaleString()}
              </p>

              {/* View Seats (optional) */}
              {order.seats && (
                <details className="seats-details">
                  <summary>View Seats</summary>
                  <ul>
                    {order.seats.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </details>
              )}


              {/* ACTION BUTTONS */}

              {/* CUSTOMER delete button */}
              {role === "CUSTOMER" && (
                <button
                  className="delete-btn"
                  onClick={() => deleteCustomerOrder(order.bookingNo)}
                >
                  Cancel Order
                </button>
              )}

              {/* ADMIN delete button */}
              {role === "ADMIN" && (
                <button
                  className="delete-btn admin"
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
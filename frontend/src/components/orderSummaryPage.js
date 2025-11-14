import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./orderSummary.css";

export default function OrderSummaryPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const prices = { adult: 12, child: 8, senior: 10 };

  useEffect(() => {
    const stored = localStorage.getItem("order");
    if (stored) setOrder(JSON.parse(stored));
  }, []);

  if (!order) return <p>No order found.</p>;

  const handleDelete = (type) => {
    const updatedTickets = { ...order.tickets, [type]: 0 };
    const total = Object.keys(updatedTickets).reduce(
      (sum, t) => sum + updatedTickets[t] * prices[t],
      0
    );
    const updatedOrder = { ...order, tickets: updatedTickets, total };
    setOrder(updatedOrder);
    localStorage.setItem("order", JSON.stringify(updatedOrder));
  };

  return (
    <div className="summary-container">
      <h1>🧾 Order Summary</h1>

      <table>
        <thead>
          <tr>
            <th>Ticket Type</th>
            <th>Quantity</th>
            <th>Price Each</th>
            <th>Subtotal</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(order.tickets).map(([type, qty]) =>
            qty > 0 ? (
              <tr key={type}>
                <td>{type}</td>
                <td>{qty}</td>
                <td>${prices[type].toFixed(2)}</td>
                <td>${(prices[type] * qty).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleDelete(type)}>🗑️</button>
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>

      <h2>Total: ${order.total.toFixed(2)}</h2>

      <div className="buttons">
        <button onClick={() => navigate("/checkout")}>
          Continue to Checkout
        </button>
        <button onClick={() => navigate("/showtimes")}>Cancel</button>
      </div>
    </div>
  );
}

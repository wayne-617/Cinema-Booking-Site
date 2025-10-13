import React, { useEffect, useState } from "react"; 
import { useNavigate, useLocation } from "react-router-dom";
import "./orderConfirmation.css";

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState({ tickets: [], total: 0 });
  const [info, setInfo] = useState({ name: "" });

  useEffect(() => {
    const stateOrder = location.state?.order;
    const storedOrder = stateOrder || JSON.parse(localStorage.getItem("order")) || { tickets: [], total: 0 };
    setOrder(storedOrder);

    const storedInfo = location.state?.formData || JSON.parse(localStorage.getItem("checkoutInfo")) || { name: "" };
    setInfo(storedInfo);
  }, [location.state]);

  return (
    <div className="confirmation-container">
      <h1> Order Confirmed!</h1>
      <p>Thank you, {info.name || "Guest"}!</p>

      <h3>Your Tickets:</h3>
      {order.tickets.length > 0 ? (
        <ul>
          {order.tickets.map((t) => (
            <li key={t.seatId}>
              Seat {t.seatId} — {t.ageType} (${t.price})
            </li>
          ))}
        </ul>
      ) : (
        <p>No tickets found.</p>
      )}

      <h2>Total Paid: ${order.total?.toFixed(2) || "0.00"}</h2>

      <button className="bigButton" onClick={() => navigate("/movies")}>
        Back to Movies
      </button>
    </div>
  );
}

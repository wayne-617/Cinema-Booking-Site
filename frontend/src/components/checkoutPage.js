import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./checkoutPage.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1️⃣ Receive order from navigation state or fallback to localStorage
  const initialOrder = location.state?.order || JSON.parse(localStorage.getItem("order")) || {
    tickets: [],
    total: 0,
    showtimeId: null,
  };
  const [order, setOrder] = useState(initialOrder);

  // Save order to localStorage whenever it changes
  useEffect(() => {
    if (order) localStorage.setItem("order", JSON.stringify(order));
  }, [order]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    card: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirm = () => {
    if (!formData.name || !formData.email || !formData.card) {
      alert("Please fill all required fields.");
      return;
    }

    localStorage.setItem("checkoutInfo", JSON.stringify(formData));
    navigate("/order-confirmation", { state: { order, formData } });
  };

  const handleCancel = () => {
    if (!order?.showtimeId) {
      navigate("/movies");
    } else {
      navigate(`/seat-reservation/${order.showtimeId}`);
    }
  };

  // Safe tickets and total
  const tickets = order?.tickets || [];
  const total = order?.total || 0;

  if (!order) {
    return (
      <div className="bodyDiv contentSection">
        <div className="bodyTextDiv">
          <h2 className="headerText">No order found</h2>
          <button className="bigButton" onClick={() => navigate("/movies")}>
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bodyDiv contentSection">
      <div className="bodyTextDiv">
        <h1 className="headerText">💳 Checkout</h1>
        <p className="smallerText">Your total: ${total.toFixed(2)}</p>

        <table style={{ width: "100%", marginBottom: "1rem" }}>
          <thead>
            <tr>
              <th>Seat</th>
              <th>Age Type</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((t) => (
                <tr key={t.seatId}>
                  <td>{t.seatId}</td>
                  <td>{t.ageType}</td>
                  <td>${t.price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No tickets selected.</td>
              </tr>
            )}
          </tbody>
        </table>

        <form className="bodyButtonDiv">
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="card"
            placeholder="Card Number"
            value={formData.card}
            onChange={handleChange}
          />
          <input
            name="expiry"
            placeholder="MM/YY"
            value={formData.expiry}
            onChange={handleChange}
          />
          <input
            name="cvv"
            placeholder="CVV"
            value={formData.cvv}
            onChange={handleChange}
          />

          <div className="checkout-buttons">
            <button type="button" className="bigButton" onClick={handleConfirm}>
              ✅ Confirm Order
            </button>
            <button type="button" className="bigButton" onClick={handleCancel}>
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

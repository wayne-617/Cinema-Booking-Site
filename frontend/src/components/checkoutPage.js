import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./checkoutPage.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = location.state || {};

  const [order, setOrder] = useState(null);
  const [processing, setProcessing] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;

  // Load order review DTO
  useEffect(() => {
    if (!bookingId || !token) return;

    axios
      .get(`http://localhost:9090/api/orders/review/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrder(res.data))
      .catch(() => alert("Unable to load order details."));
  }, [bookingId, token]);

  const handleConfirm = async () => {
    try {
      setProcessing(true);

      await axios.post(
        `http://localhost:9090/api/orders/confirm/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("order-confirmation", { state: { bookingId } });
    } catch (err) {
      alert("Error confirming order.");
      setProcessing(false);
    }
  };

  if (!order) return <p>Loading order details...</p>;

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="order-details">
        <p><strong>Movie:</strong> {order.movieTitle}</p>
        <p><strong>Total:</strong> ${order.totalAmount?.toFixed(2)}</p>
        <p><strong>Date:</strong> {new Date(order.purchaseDate).toLocaleString()}</p>
      </div>

      <div className="payment-summary">
        <p><strong>Billing:</strong> **** **** **** {order.lastFour}</p>
        <p><strong>Status:</strong> Pending confirmation</p>
      </div>

      <button onClick={handleConfirm} disabled={processing}>
        {processing ? "Processing..." : "Confirm & Place Order"}
      </button>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./checkoutPage.css"; // Using your external CSS file

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- Auth & Loading State ---
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start in loading state
  const [message, setMessage] = useState({ text: "", isError: false });

  // 1️⃣ Receive order from navigation state or fallback to localStorage
  const initialOrder =
    location.state?.order ||
    JSON.parse(localStorage.getItem("order")) || {
      tickets: [],
      total: 0,
      showtimeId: null,
    };
  const [order, setOrder] = useState(initialOrder);

  // 2️⃣ Form data state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    card: "",
    expiry: "",
    cvv: "",
  });

  // --- Authentication Check Effect ---
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      // Not logged in, redirect to login page
      navigate("/login");
    } else {
      // User is logged in, parse data, stop loading
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Pre-populate form with user's data
      setFormData((prev) => ({
        ...prev,
        name: parsedUser.fullName || "",
        email: parsedUser.username || "", // Your login page saves email as 'username'
      }));
      setIsLoading(false);
    }
  }, [navigate]);

  // Save order to localStorage whenever it changes
  useEffect(() => {
    if (order) localStorage.setItem("order", JSON.stringify(order));
  }, [order]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirm = async (e) => {
    e.preventDefault(); // It's a form, prevent default
    
    if (!formData.name || !formData.email || !formData.card || !formData.expiry || !formData.cvv) {
      setMessage({ text: "Please fill all required payment fields.", isError: true });
      return;
    }
    if (!user) {
      setMessage({ text: "Authentication error. Please log in again.", isError: true });
      return;
    }

    setMessage({ text: "Processing your order...", isError: false });

    // --- This is what a REAL backend submission would look like ---
    const bookingPayload = {
      userId: user.userId,
      token: user.token,
      showtimeId: order.showtimeId,
      tickets: order.tickets,
      total: order.total,
      paymentInfo: { // This info should be sent to a payment gateway (like Stripe), NOT your server
        name: formData.name,
        card: formData.card,
        expiry: formData.expiry,
        cvv: formData.cvv,
      },
    };

    // console.log("Submitting to backend:", bookingPayload);

    // --- MOCK API CALL & NAVIGATION ---
    // Simulating a 1-second network delay
    setTimeout(() => {
      // In a real app, you'd navigate only on a successful API response
      
      // Clear the temporary order from localStorage
      localStorage.removeItem("order"); 
      
      // Navigate to confirmation page
      navigate("/order-confirmation", { state: { order, formData } });
    }, 1000);
  };

  const handleCancel = () => {
    if (!order?.showtimeId) {
      navigate("/movies"); // Go back to movies if showtimeId is lost
    } else {
      // Go back to the specific seat page
      navigate(`/seat-reservation/${order.showtimeId}`);
    }
  };

  // Safe tickets and total
  const tickets = order?.tickets || [];
  const total = order?.total || 0;

  // Show a loading screen while we check auth
  if (isLoading) {
    return (
      // Using classes from your CSS file
      <div className="checkout-container" style={{ justifyContent: "center", alignItems: "center" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  // --- Main component render (user is logged in) ---
  return (
    <>
      {/* All inline <style> tags are removed */}

      {/* JSX updated to use new class names */}
      <div className="checkout-container">
        <h1>💳 Checkout</h1>
        <div className="checkout-summary">
            Your total: ${total.toFixed(2)}
        </div>

        <table className="checkout-table">
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
                  <td>${t.price.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr className="no-tickets">
                <td colSpan={3}>No tickets selected.</td>
              </tr>
            )}
          </tbody>
        </table>

        <form className="checkout-form" onSubmit={handleConfirm}>
          {/* --- Message Bar --- */}
          {message.text && (
            <div className={`message-bar ${message.isError ? 'error' : 'success'}`}>
              {message.text}
            </div>
          )}
          
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="card"
            placeholder="Card Number"
            value={formData.card}
            onChange={handleChange}
            required
          />
          {/* Using .row class for expiry and cvv */}
          <div className="row">
            <input
              name="expiry"
              placeholder="MM/YY"
              value={formData.expiry}
              onChange={handleChange}
              required
            />
            <input
              name="cvv"
              placeholder="CVV"
              value={formData.cvv}
              onChange={handleChange}
              required
            />
          </div>

          <div className="checkout-buttons">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              ❌ Cancel
            </button>
            <button type="submit" className="confirm-btn">
              {message.text === "Processing your order..." ? "Processing..." : "✅ Confirm Order"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}


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
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0); // grand total after fees/discounts
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(null); // {code, discount}
  const [promoError, setPromoError] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const hasValidBilling = (b) => {
    if (!b) return false;

    // no card saved
    if (!b.cardNumber || b.cardNumber === "****" || b.cardNumber.trim() === "") {
      return false;
    }

    // missing address
    if (!b.street || !b.city || !b.state || !b.zip) {
      return false;
    }

    return true;
  };


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
    setSubtotal(calc);
  }, [ticketTypes, selectedSeats]);

  // Recompute fees/discount/total when subtotal or promo changes
  useEffect(() => {
    const discountPct = promoApplied && promoApplied.discount ? Number(promoApplied.discount) : 0;
    const discount = +(subtotal * (discountPct / 100)).toFixed(2);
    setDiscountAmount(discount);
    const grand = +(subtotal - discount).toFixed(2);
    setTotal(grand >= 0 ? grand : 0);
  }, [subtotal, promoApplied]);

  // Create order
 const handleConfirm = async () => {
    if (!hasValidBilling(billing)) {
      alert("Please enter your billing and payment information before checking out.");
      navigate("/editProfile");
      return;
    }

    try {
      const tickets = selectedSeats.map((seatId) => ({
        seatId,
        type: ticketTypes[seatId] || "ADULT",
      }));

      const res = await axios.post(
        `http://localhost:9090/api/orders/create`,
        tickets,
        {
          params: { userId, showtimeId, promoCode: promoApplied?.code },
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

  const applyPromo = async () => {
    setPromoError(null);
    if (!promoCode || promoCode.trim() === "") {
      setPromoError("Enter a promo code");
      setPromoApplied(null);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:9090/api/promotions/code/${encodeURIComponent(promoCode.trim())}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const promo = res.data;
      if (!promo || promo.discount == null) {
        setPromoError("Promo code not valid");
        setPromoApplied(null);
        return;
      }
      setPromoApplied(promo);
      setPromoError(null);
    } catch (err) {
      console.error("Promo lookup failed:", err);
      setPromoApplied(null);
      setPromoError("Promo code not found");
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
              {/* CARD NUMBER */}
              <p>
                <strong>Card:</strong>{" "}
                {billing.cardNumber && billing.cardNumber.startsWith("****")
                  ? `${billing.cardType} ${billing.cardNumber}`
                  : "No card on file"}
              </p>

              {/* NAME */}
              <p>
                <strong>Name:</strong> {billing.firstName} {billing.lastName}
              </p>

              {/* ADDRESS */}
              <p>
                <strong>Address:</strong>{" "}
                {billing.street && billing.city && billing.state && billing.zip
                  ? `${billing.street}, ${billing.city}, ${billing.state} ${billing.zip}`
                  : "No billing address added"}
              </p>
            </>
          ) : (
            <p>No billing information found.</p>
          )}

          <button
            className="edit-billing-btn"
            onClick={() => navigate("/editProfile")}
          >
            {billing ? "Update Billing" : "Add Billing"}
          </button>
        </div>
        <div className="promo-card">
          <h3>Promo Code</h3>
          <div className="promo-row">
            <input
              className="promo-input"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button className="apply-promo-btn" onClick={applyPromo}>
              Apply
            </button>
          </div>
          {promoError && <p className="promo-error">{promoError}</p>}
          {promoApplied && (
            <p className="promo-success">Applied: {promoApplied.code} — {promoApplied.discount}% off</p>
          )}
        </div>

        <div className="breakdown-card">
          <h3>Price Summary</h3>
          <div className="breakdown-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          {discountAmount > 0 && (<div className="breakdown-row"><span>Discount</span><span>-${discountAmount.toFixed(2)}</span></div>)}
          <div className="breakdown-total"><strong>Total</strong><strong>${total.toFixed(2)}</strong></div>
        </div>
    
      
      

      <button className="confirm-btn" onClick={handleConfirm}>
        Proceed to Checkout
      </button>
    </div>
  );
}

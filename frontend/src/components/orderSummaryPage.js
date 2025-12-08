import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./orderSummary.css";

export default function OrderSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Restore navigation or session stored selection
  const stateData = location.state || {};
  const sessionData = JSON.parse(sessionStorage.getItem("orderData")) || {};

  const showtimeId = stateData.showtimeId || sessionData.showtimeId;
  const selectedSeats = stateData.selectedSeats || sessionData.selectedSeats || [];

  // User data
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;
  const userId =
    stateData.userId ||
    sessionData.userId ||
    storedUser?.userId;

  // State
  const [billing, setBilling] = useState(null);
  const [ticketTypes, setTicketTypes] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [basePrice, setBasePrice] = useState(null); // IMPORTANT: start as null so UI waits

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedBilling, setSelectedBilling] = useState(null);

  // Helper
  const hasValidBilling = (b) => {
    if (!b) return false;
    if (!b.cardNumber || b.cardNumber === "****") return false;
    if (!b.street || !b.city || !b.state || !b.zip) return false;
    return true;
  };

  // Ensure logged in
  useEffect(() => {
    if (!storedUser || !token) {
      alert("You must be logged in.");
      navigate("/login");
    }
  }, []);

  // Load billing
  useEffect(() => {
    if (!userId || !token) return;
      axios.get(`http://localhost:9090/billing/all/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setPaymentMethods(res.data);
      setSelectedBilling(res.data.find(x => x.default) ?? res.data[0]);
    })
    .catch((err) => console.error("Billing fetch failed:", err));
    }, [userId]);

    useEffect(() => {
    if (!showtimeId) return;

    axios
      .get(`http://localhost:9090/api/showtimes/showtime/${showtimeId}`)
      .then((res) => {
        setBasePrice(res.data.ticketPrice); // <— THE IMPORTANT PART
      })
      .catch((err) => console.error("Failed to load showtime:", err));
  }, [showtimeId]);



  // Reset promo discount when price changes
  useEffect(() => {
    if (promoApplied) {
      setPromoApplied(null);
      setPromoError(null);
    }
  }, [basePrice]);

  // Initialize ticketTypes to ADULT for each seat (only once)
  useEffect(() => {
    if (selectedSeats.length > 0 && Object.keys(ticketTypes).length === 0) {
      const initial = {};
      selectedSeats.forEach((id) => (initial[id] = "ADULT"));
      setTicketTypes(initial);
    }
  }, [selectedSeats]);

  // Compute subtotal
  useEffect(() => {
    if (!selectedSeats.length || basePrice == null) return;

    const calc = selectedSeats.reduce((sum, seatId) => {
      const type = ticketTypes[seatId] || "ADULT";

      const price =
        type === "CHILD"
          ? basePrice * 0.65
          : type === "SENIOR"
          ? basePrice * 0.80
          : basePrice;

      return sum + price;
    }, 0);

    setSubtotal(calc);
  }, [ticketTypes, selectedSeats, basePrice]);

  // Compute total after discount
  useEffect(() => {
    const discountPct = promoApplied?.discount || 0;
    const discount = +(subtotal * (discountPct / 100)).toFixed(2);
    setDiscountAmount(discount);

    const finalTotal = +(subtotal - discount).toFixed(2);
    setTotal(finalTotal >= 0 ? finalTotal : 0);
  }, [subtotal, promoApplied]);

  // Apply promo
  const applyPromo = async () => {
    setPromoError(null);

    if (!promoCode.trim()) {
      setPromoError("Enter a promo code");
      setPromoApplied(null);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:9090/api/promotions/code/${encodeURIComponent(
          promoCode.trim()
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const promo = res.data;

      if (!promo || promo.discount == null || !promo.active) {
        setPromoError("Promo code not valid");
        setPromoApplied(null);
        return;
      }

      setPromoApplied(promo);
    } catch (err) {
      setPromoApplied(null);
      setPromoError("Promo code not found");
    }
  };

  // Create order
  const handleConfirm = async () => {
    if (!selectedBilling) {
      alert("Please select a payment method.");
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
        params: {
          userId,
          showtimeId,
          billingId: selectedBilling.id,
          promoCode: promoApplied?.code,
        },
        headers: { Authorization: `Bearer ${token}` },
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

  // ⏳ Wait until price loads
  if (basePrice == null) {
    return <div className="summary-container">Loading prices...</div>;
  }

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
                key={id + "-" + basePrice}
                value={ticketTypes[id] || "ADULT"}
                onChange={(e) =>
                  setTicketTypes((prev) => ({
                    ...prev,
                    [id]: e.target.value,
                  }))
                }
              >
                <option value="ADULT">ADULT — ${basePrice.toFixed(2)}</option>
                <option value="CHILD">
                  CHILD — ${(basePrice * 0.65).toFixed(2)}
                </option>
                <option value="SENIOR">
                  SENIOR — ${(basePrice * 0.80).toFixed(2)}
                </option>
              </select>
            </li>
          ))}
        </ul>

        <button
          className="edit-seats-btn"
          onClick={() =>
            navigate(`/seat-selection/${showtimeId}`, {
              state: { selectedSeats, showtimeId, userId, fromOrderSummary: true },
            })
          }
        >
          Edit Seats
        </button>
      </div>

      {/* Billing Section */}
    <div className="billing-card">
      <h3>Billing Information</h3>

      {selectedBilling ? (
        <>
          <p>
            <strong>Card:</strong> {selectedBilling.cardType} — {selectedBilling.maskedNumber}
          </p>

          <p>
            <strong>Expires:</strong> {selectedBilling.expMonth}/{selectedBilling.expYear}
          </p>

          {selectedBilling.default && (
            <p><em>(Default payment method)</em></p>
          )}
        </>
      ) : (
        <p>No billing information found.</p>
      )}

      <h3>Payment Method</h3>
      <select
        className="billing-select"
        value={selectedBilling?.id}
        onChange={(e) => {
          const chosen = paymentMethods.find(pm => pm.id == e.target.value);
          setSelectedBilling(chosen);
        }}
      >
        {paymentMethods.map(pm => (
          <option key={pm.id} value={pm.id}>
            {pm.cardType} — {pm.maskedNumber} (Exp {pm.expMonth}/{pm.expYear})
            {pm.default ? " — Default" : ""}
          </option>
        ))}
      </select>

      <button className="edit-billing-btn" onClick={() => navigate("/editProfile")}>
        {selectedBilling ? "Update Billing" : "Add Billing"}
      </button>
    </div>

      {/* Promo Section */}
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
          <p className="promo-success">
            Applied: {promoApplied.code} — {promoApplied.discount}% off
          </p>
        )}
      </div>

      {/* Totals */}
      <div className="breakdown-card">
        <h3>Price Summary</h3>
        <div className="breakdown-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="breakdown-row">
            <span>Discount</span>
            <span>- ${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="breakdown-total">
          <strong>Total</strong>
          <strong>${total.toFixed(2)}</strong>
        </div>
      </div>

      <button className="confirm-btn" onClick={handleConfirm}>
        Proceed to Checkout
      </button>
    </div>
  );
}

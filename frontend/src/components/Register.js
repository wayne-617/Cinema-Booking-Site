import React, { useState } from "react";
import "./register.css";
import logo from "../logo512.png";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [shake, setShake] = useState(false);

  // Input states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [homeAddress, setHomeAddress] = useState(""); // ✅ new field
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateUS, setStateUS] = useState("");
  const [zip, setZip] = useState("");
  const [cardType, setCardType] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [promoOptIn, setPromoOptIn] = useState(false);

  // Collapsible sectionsfin
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegisterClick = async (e) => {
    e.preventDefault();

    // --- Validation ---
    if (!name.trim()) {
      setErrorMessage("Name cannot be blank.");
    } else if (!phone.trim()) {
      setErrorMessage("Phone number cannot be blank.");
    } else if (!email.trim()) {
      setErrorMessage("Email cannot be blank.");
    } else if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
    } else if (!password.trim()) {
      setErrorMessage("Password cannot be blank.");
    } else if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
    } else {
      setErrorMessage("");

      // --- Build payload ---
      const payload = {
        username: email,
        password: password,
        fullName: name,
        phone: phone,
        promoOptIn: promoOptIn,
        homeAddress: homeAddress, // ✅ send to backend
      };

      if (street || city || stateUS || zip) {
        payload.address = {
          street,
          city,
          state: stateUS,
          zip,
        };
      }

      if (cardType || cardNumber || expMonth || expYear) {
        payload.paymentInfo = {
          cardType,
          cardNumber,
          expMonth: expMonth ? parseInt(expMonth, 10) : null,
          expYear: expYear ? parseInt(expYear, 10) : null,
        };
      }

      // --- API Call ---
      try {
        const response = await fetch("http://localhost:9090/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          navigate("/verify", {
            state: {
              email: email,
              message:
                "Registration successful! A verification code has been sent to your email.",
            },
          });
        } else {
          const data = await response.json();
          setErrorMessage(data.error || "Registration failed");
        }
      } catch (err) {
        setErrorMessage("An error occurred. Please try again later.");
      }

      return;
    }

    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <img src={logo} alt="Logo" className="register-logo" />
        <h1 className="register-title">Create Your Account</h1>

        {errorMessage && <p className="register-error">{errorMessage}</p>}

        <form
          className={`register-form ${shake ? "shake" : ""}`}
          onSubmit={handleRegisterClick}
        >
          {/* --- Basic Info --- */}
          <input
            type="text"
            placeholder="Full Name"
            className="register-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="register-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password (min. 8 characters)"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ✅ New Home Address Field */}
          <input
            type="text"
            placeholder="Home Address (e.g., 123 Main St, City, State ZIP)"
            className="register-input"
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
          />

          {/* --- Collapsible Address Section --- */}
          <button
            type="button"
            className="collapsible-btn"
            onClick={() => setIsAddressOpen(!isAddressOpen)}
          >
            Billing Address (Optional)
            <span>{isAddressOpen ? "−" : "+"}</span>
          </button>

          {isAddressOpen && (
            <div className="collapsible-content">
              <input
                type="text"
                placeholder="Street"
                className="register-input"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
              <input
                type="text"
                placeholder="City"
                className="register-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <input
                type="text"
                placeholder="State"
                className="register-input"
                value={stateUS}
                onChange={(e) => setStateUS(e.target.value)}
              />
              <input
                type="text"
                placeholder="Zip Code"
                className="register-input"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </div>
          )}

          {/* --- Collapsible Payment Section --- */}
          <button
            type="button"
            className="collapsible-btn"
            onClick={() => setIsPaymentOpen(!isPaymentOpen)}
          >
            Payment Details (Optional)
            <span>{isPaymentOpen ? "−" : "+"}</span>
          </button>

          {isPaymentOpen && (
            <div className="collapsible-content">
              <input
                type="text"
                placeholder="Card Type (e.g., Visa)"
                className="register-input"
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
              />
              <input
                type="text"
                placeholder="Card Number"
                className="register-input"
                maxLength="19"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(e.target.value.replace(/\D/g, ""))
                }
              />
              <input
                type="text"
                placeholder="Exp. Month (MM)"
                className="register-input"
                value={expMonth}
                onChange={(e) => setExpMonth(e.target.value)}
              />
              <input
                type="text"
                placeholder="Exp. Year (YYYY)"
                className="register-input"
                value={expYear}
                onChange={(e) => setExpYear(e.target.value)}
              />
            </div>
          )}

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="promoOptIn"
              checked={promoOptIn}
              onChange={(e) => setPromoOptIn(e.target.checked)}
            />
            <label htmlFor="promoOptIn">
              Yes, I want to receive promotional emails and offers.
            </label>
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        <p className="register-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

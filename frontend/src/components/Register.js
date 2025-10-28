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
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateUS, setStateUS] = useState("");
  const [zip, setZip] = useState("");
  const [cardType, setCardType] = useState("");
  const [cardLast4, setCardLast4] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  // Email validator
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegisterClick = async (e) => {
    e.preventDefault();

    // --- Validation logic ---
    if (!name.trim()) {
      setErrorMessage("Name cannot be blank.");
    } else if (!phone.trim()) {
      setErrorMessage("Phone number cannot be blank.");
    } else if (!email.trim()) {
      setErrorMessage("Email address cannot be blank.");
    } else if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
    } else if (!password.trim()) {
      setErrorMessage("Password cannot be blank.");
    } else if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
    } else {
      setErrorMessage("");

      // Example navigation logic (replace with backend call later)
      if (
        name === "admin" &&
        email === "admin@user.com" &&
        phone === "1234567890" &&
        password === "masterkey"
      ) {
        navigate("/admin");
      } else {
        try {
          const response = await fetch("http://localhost:9090/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: email,
              password: password,
              fullName: name,
              phone: phone,
            }),
          });

          if (response.ok) {
            navigate("/verify", {
              state: {
                email: email,
                message: "Registration successful! A verification code has been sent to your email.",
              }
            });
          } else {
            const data = await response.json();
            setErrorMessage(data.error || "Registration failed");
          }
        } catch (error) {
          setErrorMessage("An error occurred");
        }
      }
     

      return;
    }

    // --- Shake effect (without restarting fade) ---
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="register-container">
      <div className={`register-card`}>
        <img src={logo} alt="Logo" className="register-logo" />
        <h1 className="register-title">Create Your Account</h1>

        {errorMessage && <p className="register-error">{errorMessage}</p>}

        <div className={`input-group ${shake ? "shake" : ""}`}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="street"
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          <input
            type="city"
            placeholder="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="state"
            placeholder="state"
            value={stateUS}
            onChange={(e) => setStateUS(e.target.value)}
          />
          <input
            type="zip"
            placeholder="Zip"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
          <input
            type="card type"
            placeholder="card type"
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
          />
          <input
            type="card last"
            placeholder="card last 4 digits"
            value={cardLast4}
            onChange={(e) => setCardLast4(e.target.value)}
          />
          <input
            type="expMonth"
            placeholder="Exp-Month"
            value={expMonth}
            onChange={(e) => setExpMonth(e.target.value)}
          />
          <input
            type="expYear"
            placeholder="Exp-Year"
            value={expYear}
            onChange={(e) => setExpYear(e.target.value)}
          />
        </div>

        <button className="register-btn" onClick={handleRegisterClick}>
          Register
        </button>

        <p className="register-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

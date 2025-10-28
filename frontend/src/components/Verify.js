import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./register.css";
import logo from "../logo512.png";

const API_BASE_URL = "http://localhost:9090";

function Verify() {
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Retrieve email from the navigation state (passed from Register.js)
  const userEmail = location.state?.email || "";

  // Set initial message using state from Register.js
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    } else {
      // Fallback message if user navigates directly
      setMessage("Please check your email for the 6-digit verification code.");
    }
  }, [location.state]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (code.length !== 6 || isNaN(code)) {
      setError("The code must be exactly 6 digits.");
      setLoading(false);
      return;
    }

    if (!userEmail) {
      setError("Cannot verify. User email is missing from session.");
      setLoading(false);
      return;
    }

    // --- API Call to /auth/verify with URL Parameters ---
    try {
      // Construct the URL with query parameters
      const verificationUrl = `${API_BASE_URL}/auth/verify?email=${encodeURIComponent(userEmail)}&token=${encodeURIComponent(code)}`;

      const response = await fetch(verificationUrl, {
        method: "GET", // Matches the recommended @GetMapping approach
        headers: {
          "Content-Type": "application/json",
        },
        // GET requests typically don't include a body
      });

      if (response.ok) {
        // Verification successful
        alert("Account successfully verified! You can now log in.");
        navigate("/login");
      } else {
        // Handle verification failure (e.g., bad token, token expired)
        const errorMessage = await response.text(); // Read the plain error string from the Spring controller
        setError(`Verification Failed: ${errorMessage}`);
      }
    } catch (err) {
      setError("Network Error: Could not reach the verification server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="verify-card">
        <img src={logo} alt="Logo" className="verify-logo" />
        <h1 className="verify-title">Verify Your Account</h1>
        
        {/* Display initial success/info message */}
        {message && <p className="verify-info">{message}</p>}
        
        {/* Display the email the user needs to check */}
        <p className="verify-email-display">
            Code sent to: **{userEmail || "N/A"}**
        </p>

        <form onSubmit={handleVerify}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter 6-Digit Code"
              maxLength="6"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))} // Only allow numbers
              disabled={loading}
              required
            />
          </div>

          {error && <p className="verify-error">{error}</p>}

          <button className="verify-btn" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <p className="verify-footer">
          Mistyped your email? <Link to="/register">Re-register</Link>
        </p>
      </div>
    </div>
  );
}

export default Verify;
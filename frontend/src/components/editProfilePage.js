import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./editProfilePage.css";

function EditProfilePage() {
  const navigate = useNavigate();

  // ===== Account =====
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // ===== Billing Address =====
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateUS, setStateUS] = useState("");
  const [zip, setZip] = useState("");

  // ===== Payment =====
  const [cardType, setCardType] = useState("");
  const [cardNumber, setCardNumber] = useState(""); // real or masked
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");

  // ===== Password =====
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ===== Promo =====
  const [promoOptIn, setPromoOptIn] = useState(false);

  // ===== UI =====
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  var [isEditingCard, setIsEditingCard] = useState(false);


  // ============================================================
  //                     FETCH PROFILE
  // ============================================================
  const loadProfile = async () => {
  const stored = localStorage.getItem("user");
  if (!stored) return navigate("/login");

  const { token, userId: uid } = JSON.parse(stored);
  setUserId(uid);

  try {
    const res = await fetch(`http://localhost:9090/api/profile/${uid}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to load profile");

    const data = await res.json();

    setEmail(data.email || "");
    setFirstName(data.firstName || "");
    setLastName(data.lastName || "");
    setPhone(data.phone || "");
    setPromoOptIn(data.promoOptIn || false);

    setStreet(data.street || "");
    setCity(data.city || "");
    setStateUS(data.state || "");
    setZip(data.zip || "");

    // masked number ONLY
    setCardType(data.cardType || "");
    setCardNumber(data.cardNumber || "");
    setExpMonth(data.expMonth ? data.expMonth.toString() : "");
    setExpYear(data.expYear ? data.expYear.toString() : "");

  } catch (e) {
    console.error(e);
    setMessage({ text: "Failed to load profile", type: "error" });
  } finally {
    setIsLoading(false);   // <- REQUIRED
  }
};
  useEffect(() => {
    loadProfile();
  }, []);


  // ============================================================
  //                     SAVE PROFILE
  // ============================================================
  const handleSave = async (e) => {
    e.preventDefault();

    // password mismatch check
    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ text: "New passwords do not match", type: "error" });
      return;
    }

    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) return navigate("/login");

    const { token } = stored;

const realCardNumber = isEditingCard ? cardNumber : null;
    // --- Billing payload ---
    const billingPayload = {
      userId,
      cardType,
      cardNumber: realCardNumber,
      expMonth: expMonth ? parseInt(expMonth) : null,
      expYear: expYear ? parseInt(expYear) : null,
      street,
      city,
      state: stateUS,
      zip,
    };

    // --- Profile payload ---
    const profilePayload = {
      phone,
      promoOptIn,
      firstName,
      lastName,

      // address & card info (same DTO)
      street,
      city,
      state: stateUS,
      zip,
      cardType,
      expMonth: expMonth ? parseInt(expMonth) : null,
      expYear: expYear ? parseInt(expYear) : null,
      cardNumber: realCardNumber,

      // passwords
      currentPassword: currentPassword || null,
      newPassword: newPassword || null,
    };

    try {
      setIsLoading(true);
      setMessage({ text: "", type: "" });

      // --- Update Billing ---
      const billRes = await fetch("http://localhost:9090/billing/submit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(billingPayload),
      });

      if (!billRes.ok) {
        throw new Error("Billing update failed");
      }

      // --- Update Profile ---
      const profRes = await fetch(`http://localhost:9090/api/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profilePayload),
      });

      if (!profRes.ok) {
        const err = await profRes.json();
        throw new Error(err.message || "Profile update failed");
      }

        await loadProfile();        // reload masked card number
        setIsEditingCard(false);
        setIsLoading(false);


      // SUCCESS
      setMessage({ text: "Profile updated successfully", type: "success" });

      // Update NavBar name
      const updated = {
        ...stored,
        firstName,
        fullName: `${firstName} ${lastName}`,
      };
      localStorage.setItem("user", JSON.stringify(updated));

      // Clear passwords
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };


  // ============================================================
  //                           RENDER
  // ============================================================
  return (
    <div className="editProfilePage-container">
      <form className="editProfilePage-card" onSubmit={handleSave}>

        <h1 className="editProfilePage-title">Edit Profile</h1>

        {message.text && (
          <div className={`editProfilePage-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {isLoading && <div className="loading-text">Loading...</div>}

        {/* ================== ACCOUNT ================== */}
        <fieldset disabled={isLoading} className="editProfilePage-section">
          <h2 className="editProfilePage-sectionHeader">Account Information</h2>

          <div className="editProfilePage-formGrid">

            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">Email</label>
              <input
                className="editProfilePage-input editProfilePage-readOnly"
                value={email}
                disabled
              />
            </div>

            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">Phone</label>
              <input
                className="editProfilePage-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">First Name</label>
              <input
                className="editProfilePage-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">Last Name</label>
              <input
                className="editProfilePage-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        </fieldset>


        {/* ================== BILLING ADDRESS ================== */}
        <fieldset disabled={isLoading} className="editProfilePage-section">
          <h2 className="editProfilePage-sectionHeader">Billing Address</h2>

          <div className="editProfilePage-formGrid">
            <input
              className="editProfilePage-input"
              placeholder="Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />

            <input
              className="editProfilePage-input"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <input
              className="editProfilePage-input"
              placeholder="State"
              value={stateUS}
              onChange={(e) => setStateUS(e.target.value)}
            />

            <input
              className="editProfilePage-input"
              placeholder="Zip"
              maxLength="5"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </div>
        </fieldset>


        {/* ================== PASSWORD ================== */}
        <fieldset disabled={isLoading} className="editProfilePage-section">
          <h2 className="editProfilePage-sectionHeader">Change Password</h2>

          <div className="editProfilePage-formGrid grid-cols-3">
            <input
              className="editProfilePage-input"
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              className="editProfilePage-input"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              className="editProfilePage-input"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </fieldset>


        {/* ================== PAYMENT ================== */}
        <fieldset disabled={isLoading} className="editProfilePage-section">
  <h2 className="editProfilePage-sectionHeader">Payment Method</h2>

  <div className="payment-method-block">

    {/* Card Type */}
    <input
      className="payment-field"
      placeholder="Card Type"
      value={cardType}
      onChange={(e) => setCardType(e.target.value)}
    />

    {/* Card Number + Edit Button */}
    <div className="card-edit-wrapper" style={{ display: "flex", gap: "0.6rem" }}>
      <input
        className="payment-field"
        value={cardNumber}
        placeholder="Card Number"
        maxLength="19"
        readOnly={!isEditingCard && cardNumber.startsWith("****")}
        onChange={(e) => setCardNumber(e.target.value)}
      />

      {!isEditingCard && cardNumber.startsWith("****") && (
        <button
          type="button"
          className="payment-edit-btn"
          onClick={() => {
            setIsEditingCard(true);
            setCardNumber("");
          }}
        >
          Edit
        </button>
      )}
    </div>

    {/* Expiration */}
    <div className="payment-exp-grid" style={{ display: "flex", gap: "1rem" }}>
      <input
        className="payment-field"
        placeholder="MM"
        maxLength="2"
        value={expMonth}
        onChange={(e) => setExpMonth(e.target.value)}
      />
      <input
        className="payment-field"
        placeholder="YY"
        maxLength="2"
        value={expYear}
        onChange={(e) => setExpYear(e.target.value)}
      />
    </div>

  </div>
</fieldset>




                {/* ================== PROMOS ================== */}
                <fieldset disabled={isLoading} className="editProfilePage-section">
                  <h2 className="editProfilePage-sectionHeader">Promotions</h2>
                  <label className="editProfilePage-inputLabel" style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="checkbox"
                      checked={promoOptIn}
                      onChange={(e) => setPromoOptIn(e.target.checked)}
                    />
                    Receive email offers
                  </label>
        </fieldset>


        {/* ================== BUTTONS ================== */}
        <div className="editProfilePage-buttonRow">
          <button
            type="button"
            className="editProfilePage-buttonSecondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="editProfilePage-buttonPrimary"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default EditProfilePage;

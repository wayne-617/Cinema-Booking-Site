import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./editProfilePage.css";

export default function EditProfilePage() {
  const navigate = useNavigate();

  // ===================== ACCOUNT =====================
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [authChecked, setAuthChecked] = useState(false);


  // ===================== BILLING ADDRESS =====================
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateUS, setStateUS] = useState("");
  const [zip, setZip] = useState("");

  // ===================== PRIMARY PAYMENT =====================
  const [primaryCard, setPrimaryCard] = useState(null);

  // ===================== MULTIPLE CARDS =====================
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newCardType, setNewCardType] = useState("");
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newExpMonth, setNewExpMonth] = useState("");
  const [newExpYear, setNewExpYear] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editIsDefault, setEditIsDefault] = useState(false);
  const [editCardType, setEditCardType] = useState("");
  const [editCardNumber, setEditCardNumber] = useState("");
  const [editExpMonth, setEditExpMonth] = useState("");
  const [editExpYear, setEditExpYear] = useState("");
  const [editLast4, setEditLast4] = useState("");

  // ===================== PASSWORD =====================
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ===================== PROMO =====================
  const [promoOptIn, setPromoOptIn] = useState(false);

  // ===================== UI =====================
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  // ============================================================
  //                      LOAD PROFILE
  // ============================================================


  const loadProfile = async () => {
    const stored = JSON.parse(localStorage.getItem("user"));
     if (!stored) return; 

    const { token, userId: uid } = stored;
    setUserId(uid);

    try {
      // Load profile
      const res = await fetch(`http://localhost:9090/api/profile/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();

      // ---- Account ----
      setEmail(data.email || "");
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setPhone(data.phone || "");
      setPromoOptIn(data.promoOptIn || false);
      setHomeAddress(data.homeAddress || "");

      // ---- Billing Address ----
      setStreet(data.street || "");
      setCity(data.city || "");
      setStateUS(data.state || "");
      setZip(data.zip || "");

      // ---- Payment Methods ----
      const pmRes = await fetch(`http://localhost:9090/billing/all/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!pmRes.ok) throw new Error("Failed to load payment methods");

      const list = await pmRes.json();
      setPaymentMethods(list);


      // FIND DEFAULT
      const def = list.find((c) => c.default) || list[0] || null;
      setPrimaryCard(def);


    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to load profile", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
    
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));

    if (!stored) {
      navigate("/login");
      return;
    }

    setAuthChecked(true); // auth passed
  }, [navigate]);

  useEffect(() => {
    if (authChecked) {
      loadProfile();
    }
  }, [authChecked]);

  // ============================================================
  //                        UPDATE PROFILE
  // ============================================================
  const handleSave = async (e) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ text: "New passwords do not match", type: "error" });
      return;
    }

    const stored = JSON.parse(localStorage.getItem("user"));
    const token = stored.token;

    const profilePayload = {
      phone,
      promoOptIn,
      firstName,
      lastName,
      street,
      city,
      state: stateUS,
      zip,
      homeAddress,
      currentPassword: currentPassword || null,
      newPassword: newPassword || null,
    };

    try {
      setIsLoading(true);

      const profRes = await fetch(
        `http://localhost:9090/api/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profilePayload),
        }
      );

      if (!profRes.ok) throw new Error("Profile update failed");

      setMessage({ text: "Profile updated successfully", type: "success" });
      loadProfile();
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  //                  ADD PAYMENT METHOD
  // ============================================================
  const submitAddCard = async () => {
    const stored = JSON.parse(localStorage.getItem("user"));
    const token = stored.token;

    const body = {
      userId,
      cardType: newCardType,
      cardNumber: newCardNumber,
      expMonth: parseInt(newExpMonth),
      expYear: parseInt(newExpYear),
      email,
    };

    await fetch("http://localhost:9090/billing/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    setShowAddModal(false);
    setNewCardType("");
    setNewCardNumber("");
    setNewExpMonth("");
    setNewExpYear("");
    loadProfile();
  };

  // ============================================================
  //                  EDIT PAYMENT METHOD
  // ============================================================
  const openEditModal = (pm) => {
    setEditId(pm.id);
    setEditCardType(pm.cardType);
    setEditCardNumber(pm.maskedNumber);
    setEditExpMonth(pm.expMonth.toString());
    setEditExpYear(pm.expYear.toString());
    setEditLast4(pm.maskedNumber.slice(-4));
    setEditIsDefault(pm.default);
    setShowEditModal(true);

  };

 const submitEditCard = async () => {
  const stored = JSON.parse(localStorage.getItem("user"));
  const token = stored.token;

  const body = {
    userId,
    cardType: editCardType,
    cardNumber: editCardNumber.startsWith("****") ? null : editCardNumber,
    expMonth: parseInt(editExpMonth),
    expYear: parseInt(editExpYear),
    isDefault: editIsDefault,
  };


  // MUST assign response to a variable for logging
  const resp = await fetch(`http://localhost:9090/billing/update/${editId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  setShowEditModal(false);
  loadProfile();
};


  // ============================================================
  //                          REMOVE CARD
  // ============================================================
  const handleRemove = async (id) => {
    const stored = JSON.parse(localStorage.getItem("user"));
    const token = stored.token;

    await fetch(`http://localhost:9090/billing/${id}/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadProfile();
  };
  if (!authChecked) {
    return <div className="loading-text">Checking session...</div>;
  }

  // ============================================================
  //                          UI RENDER
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

        {/* ======================== ACCOUNT ======================== */}
        <fieldset disabled={isLoading} className="editProfilePage-section">
          <h2 className="editProfilePage-sectionHeader">Account Information</h2>

          <div className="editProfilePage-formGrid">
            <input
              className="editProfilePage-input editProfilePage-readOnly"
              value={email}
              disabled
            />
            <input
              className="editProfilePage-input"
              value={phone}
              placeholder="Phone"
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              className="editProfilePage-input"
              value={firstName}
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="editProfilePage-input"
              value={lastName}
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              className="editProfilePage-input"
              value={homeAddress}
              placeholder="Home Address"
              onChange={(e) => setHomeAddress(e.target.value)}
            />
          </div>
        </fieldset>

        {/* ======================== BILLING ADDRESS ======================== */}
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

        {/* ======================== SAVED CARDS ======================== */}
        <div className="payment-methods-header">
          <h2>Saved Payment Methods</h2>
          <button
            type="button"
            className="payment-add-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Add Payment Method
          </button>
        </div>

        {paymentMethods.map((pm) => (
          <div
            key={pm.id}
            className={`payment-method-item ${
              pm.default ? "default-card" : ""
            }`}
          >
            <span>
              {pm.cardType} — {pm.maskedNumber} (Exp {pm.expMonth}/
              {pm.expYear})
            </span>

            {pm.default && (
              <strong style={{ color: "gold", marginLeft: "10px" }}>
                 Default
              </strong>
            )}

            <div className="payment-actions">
              <button className="edit-btn" onClick={() => openEditModal(pm)}>
                Edit
              </button>
              <button className="remove-btn" onClick={() => handleRemove(pm.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* ======================== PRIMARY PAYMENT ======================== */}
        <fieldset disabled className="editProfilePage-section">
          <h2 className="editProfilePage-sectionHeader">
            Primary Payment Method
          </h2>

          {primaryCard ? (
            <div className="payment-method-block">
              <p>
                <strong>Type:</strong> {primaryCard.cardType}
              </p>
              <p>
                <strong>Number:</strong> {primaryCard.maskedNumber}
              </p>
              <p>
                <strong>Expires:</strong> {primaryCard.expMonth}/
                {primaryCard.expYear}
              </p>
            </div>
          ) : (
            <p>No payment method saved.</p>
          )}
        </fieldset>

        {/* ======================== PASSWORD ======================== */}
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

        {/* ======================== PROMO ======================== */}
        <fieldset disabled={isLoading} className="editProfilePage-section">
          <h2 className="editProfilePage-sectionHeader">Promotions</h2>

          <label
            className="editProfilePage-inputLabel"
            style={{ display: "flex", gap: "0.5rem" }}
          >
            <input
              type="checkbox"
              checked={promoOptIn}
              onChange={(e) => setPromoOptIn(e.target.checked)}
            />
            Receive email offers
          </label>
        </fieldset>

        {/* ======================== BUTTONS ======================== */}
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

      {/* ======================== ADD CARD MODAL ======================== */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2>Add Payment Method</h2>

            <input
              className="payment-field"
              placeholder="Card Type"
              value={newCardType}
              onChange={(e) => setNewCardType(e.target.value)}
            />
            <input
              className="payment-field"
              placeholder="Card Number"
              value={newCardNumber}
              onChange={(e) => setNewCardNumber(e.target.value)}
            />
            <input
              className="payment-field"
              placeholder="MM"
              maxLength="2"
              value={newExpMonth}
              onChange={(e) => setNewExpMonth(e.target.value)}
            />
            <input
              className="payment-field"
              placeholder="YYYY"
              maxLength="4"
              value={newExpYear}
              onChange={(e) => setNewExpYear(e.target.value)}
            />

            <div className="modal-buttons">
              <button className="editProfilePage-buttonPrimary" onClick={submitAddCard}>
                Save
              </button>
              <button
                className="editProfilePage-buttonSecondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================== EDIT CARD MODAL ======================== */}
      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2>Edit Payment Method</h2>

            <input
              className="payment-field"
              value={editCardType}
              onChange={(e) => setEditCardType(e.target.value)}
            />

            <input
              className="payment-field"
              value={editCardNumber}
              placeholder={`**** **** **** ${editLast4}`}
              onFocus={() => {
                if (editCardNumber.startsWith("****"))
                  setEditCardNumber("");
              }}
              onChange={(e) => setEditCardNumber(e.target.value)}
            />

            <input
              className="payment-field"
              maxLength="2"
              value={editExpMonth}
              onChange={(e) => setEditExpMonth(e.target.value)}
              placeholder="MM"
            />

            <input
              className="payment-field"
              maxLength="4"
              value={editExpYear}
              onChange={(e) => setEditExpYear(e.target.value)}
              placeholder="YYYY"
            />

            <label className="default-checkbox">
              <input
                type="checkbox"
                checked={editIsDefault}
                onChange={() => setEditIsDefault(!editIsDefault)}
              />
              Set as Default Payment Method
            </label>

            <div className="modal-buttons">
              <button className="editProfilePage-buttonPrimary" onClick={submitEditCard}>
                Save
              </button>
              <button
                className="editProfilePage-buttonSecondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

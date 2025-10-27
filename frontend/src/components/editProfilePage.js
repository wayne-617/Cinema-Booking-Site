import React, { useState, useEffect } from "react";
import "./editProfilePage.css";
import { useNavigate } from "react-router-dom";

function EditProfilePage() {
  const navigate = useNavigate();

  // ---------- State definitions (same as before) ----------
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState(null);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateUS, setStateUS] = useState("");
  const [zip, setZip] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [maskedPassword, setMaskedPassword] = useState("");
  const [promoOptIn, setPromoOptIn] = useState(true);
  const [cardType, setCardType] = useState("");
  const [cardLast4, setCardLast4] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");

  // ---------- Fetch profile data on mount (same as before) ----------
  useEffect(() => {
    async function fetchProfile() {
      // ...same logic...
    }
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    const payload = {
      userId,
      email,
      newPassword: newPassword || null,
      promo_opt_in: promoOptIn ? 1 : 0,
      billing: {
        firstName,
        lastName,
        phone: phone || null,
        street: street || null,
        city: city || null,
        state: stateUS || null,
        zip: zip || null,
        cardType: cardType || null,
        lastFour: cardLast4 || null,
        expMonth: expMonth || null,
        expYear: expYear || null,
      },
    };

    console.log("Submitting profile update payload:", payload);
    const res = await fetch(`http://localhost:9090/api/profile/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    alert(res.ok ? "Profile updated!" : "Failed to update profile.");
  };

  return (
    <div className="editProfilePage-container">
      <div className="editProfilePage-card">
        <h1 className="editProfilePage-title">Edit Profile</h1>

        {/* ===== Account Information ===== */}
        <div className="editProfilePage-section">
          <h2 className="editProfilePage-sectionHeader">Account Information</h2>
          <div className="editProfilePage-formGrid">
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">Email (cannot be changed)</label>
              <input className="editProfilePage-input editProfilePage-readOnly" value={email} disabled />
            </div>
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">Current Password (hidden)</label>
              <input className="editProfilePage-input editProfilePage-readOnly" value={maskedPassword} disabled />
            </div>
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">First Name</label>
              <input className="editProfilePage-input" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name"/>
            </div>
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">Last Name</label>
              <input className="editProfilePage-input" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name"/>
            </div>
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">Phone Number</label>
              <input className="editProfilePage-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="1234567890"/>
            </div>
          </div>
        </div>

        {/* ===== Billing Address ===== */}
        <div className="editProfilePage-section">
          <h2 className="editProfilePage-sectionHeader">Billing Address</h2>
          <div className="editProfilePage-formGrid">
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">Street</label>
              <input className="editProfilePage-input" value={street} onChange={e => setStreet(e.target.value)} placeholder="123 Main St"/>
            </div>
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">City</label>
              <input className="editProfilePage-input" value={city} onChange={e => setCity(e.target.value)} placeholder="Athens"/>
            </div>
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">State</label>
              <input className="editProfilePage-input" value={stateUS} onChange={e => setStateUS(e.target.value)} placeholder="GA"/>
            </div>
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">ZIP</label>
              <input className="editProfilePage-input" value={zip} onChange={e => setZip(e.target.value)} placeholder="30601"/>
            </div>
          </div>
        </div>

        {/* ===== Change Password ===== */}
        <div className="editProfilePage-section">
          <h2 className="editProfilePage-sectionHeader">Change Password</h2>
          <div className="editProfilePage-formGrid">
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">Current Password</label>
              <input className="editProfilePage-input" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter current password"/>
            </div>
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">New Password</label>
              <input className="editProfilePage-input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password"/>
            </div>
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">Confirm New Password</label>
              <input className="editProfilePage-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter new password"/>
            </div>
          </div>
        </div>

        {/* ===== Payment Method ===== */}
        <div className="editProfilePage-section">
          <h2 className="editProfilePage-sectionHeader">Payment Method</h2>
          <div className="editProfilePage-formGrid">
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">Card Type</label>
              <input className="editProfilePage-input" value={cardType} onChange={e => setCardType(e.target.value)} placeholder="Visa / MasterCard / etc."/>
            </div>
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">Card Ending In</label>
              <input className="editProfilePage-input" value={cardLast4} onChange={e => setCardLast4(e.target.value)} placeholder="1234"/>
            </div>
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">Exp. Month</label>
              <input className="editProfilePage-input" value={expMonth} onChange={e => setExpMonth(e.target.value)} placeholder="10"/>
            </div>
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel">Exp. Year</label>
              <input className="editProfilePage-input" value={expYear} onChange={e => setExpYear(e.target.value)} placeholder="27"/>
            </div>
          </div>
        </div>

        {/* ===== Promotions ===== */}
        <div className="editProfilePage-section">
          <h2 className="editProfilePage-sectionHeader">Promotions & Offers</h2>
          <div className="editProfilePage-formGroup">
            <input id="promoOptInBox" type="checkbox" checked={promoOptIn} onChange={e => setPromoOptIn(e.target.checked)}/>
            <label htmlFor="promoOptInBox" className="editProfilePage-inputLabel">
              Email me promotions, special offers, and early screenings
            </label>
          </div>
        </div>

        {/* ===== Action Buttons ===== */}
        <div className="editProfilePage-buttonRow">
          <button className="editProfilePage-buttonPrimary" onClick={handleSave}>Save Changes</button>
          <button className="editProfilePage-buttonSecondary" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditProfilePage;

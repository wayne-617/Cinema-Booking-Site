import React, { useState, useEffect } from "react";
import "./editProfilePage.css";
import { useNavigate } from "react-router-dom";

function EditProfilePage() {
  const navigate = useNavigate();

  // ---------- State for user/account info ----------
  const [email, setEmail] = useState("");            // read-only (users.username)
  const [firstName, setFirstName] = useState("");    // billing.first_name
  const [lastName, setLastName] = useState("");      // billing.last_name
  const [phone, setPhone] = useState("");            // not in DB yet, placeholder
  const [userId, setUserId] = useState(null);

  // ---------- State for billing address ----------
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateUS, setStateUS] = useState("");        // avoid calling it just "state"
  const [zip, setZip] = useState("");

  // ---------- State for password change ----------
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // store masked password for display
  const [maskedPassword, setMaskedPassword] = useState("");

  // ---------- State for promotions ----------
  const [promoOptIn, setPromoOptIn] = useState(true); 
  // NOTE: this assumes future users.promo_opt_in. Right now it's just UI state.

  // ---------- State for payment / card info ----------
  const [cardType, setCardType] = useState("");      
  const [cardLast4, setCardLast4] = useState("");    
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");

  // ---------- Load profile data on mount ----------
  useEffect(() => {
    async function fetchProfile() {
      try {
        const userEmail = "admin@user.com"; // TODO: replace with logged-in user's email after auth
  
        // STEP 1: get core user info
        const resUser = await fetch(`http://localhost:9090/auth/${userEmail}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const userData = await resUser.json();
  
        setEmail(userData.username);
        setUserId(userData.id || null);
  
        if (userData.passwordLength) {
          setMaskedPassword("*".repeat(userData.passwordLength));
        } else {
          setMaskedPassword("");
        }
  
        // STEP 2: get profile/billing info using that userId
        const resProfile = await fetch(`http://localhost:9090/api/profile/${userData.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const profileData = await resProfile.json();
  
        // hydrate UI fields
        setFirstName(profileData.firstName || "");
        setLastName(profileData.lastName || "");
  
        // you don't have phone/street/state/zip in DB yet,
        // so leave those setters alone or default ""
        // setPhone(profileData.phone || "");
        setPhone("");
        setStreet("");
        setCity("");
        setStateUS("");
        setZip("");
  
        // card
        setCardType(null); // You don't store type yet, so placeholder
        if (profileData.lastFour != null) {
          setCardLast4(String(profileData.lastFour));
        } else {
          setCardLast4("");
        }
  
        // promoOptIn isn't in DB yet, keep default state for now
  
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    }
  
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    // basic client-side password validation for UX
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    // Build payload we would send to backend on PUT.
    // For now it just logs for demo.
    const payload = {
      userId: userId,

      // users table-ish
      email: email, // read-only, not changeable
      newPassword: newPassword !== "" ? newPassword : null,

      // eventually: promo_opt_in in users table
      promo_opt_in: promoOptIn ? 1 : 0,

      // billing table-ish
      billing: {
        firstName: firstName,
        lastName: lastName,
        phone: phone || null, // currently not stored in DB
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

    // TODO (after we add PUT /api/profile/{userId}):
    const res = await fetch(`http://localhost:9090/api/profile/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Profile updated!");
    } else {
      alert("Failed to update profile.");
    }
  };
  
  return (
    <div className="bodyDiv">
      <section className="contentSection">
        <section className="bodySection">
          <div className="bodyTextDiv profileCard">
            <div className="title-container">
              <h1 className="editProfile-title">Edit Profile</h1>
            </div>

            {/* ===== Account Info Section ===== */}
            <div className="sectionCard">
              <h2 className="sectionHeader">Account Information</h2>

              <div className="formGrid">
                {/* Email (read-only) */}
                <div className="formGroup">
                  <label className="inputLabel">Email (cannot be changed)</label>
                  <input
                    className="edit readOnlyInput"
                    value={email}
                    disabled
                  />
                </div>

                {/* Password (masked display only) */}
                <div className="formGroup">
                  <label className="inputLabel">
                    Current Password (hidden)
                  </label>
                  <input
                    className="edit readOnlyInput"
                    value={maskedPassword}
                    disabled
                  />
                </div>

                {/* First name */}
                <div className="formGroup">
                  <label className="inputLabel">First Name</label>
                  <input
                    className="edit"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                  />
                </div>

                {/* Last name */}
                <div className="formGroup">
                  <label className="inputLabel">Last Name</label>
                  <input
                    className="edit"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                  />
                </div>

                {/* Phone number */}
                <div className="formGroup">
                  <label className="inputLabel">Phone Number</label>
                  <input
                    className="edit"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="1234567890"
                  />
                </div>
              </div>
            </div>

            {/* ===== Billing Address Section ===== */}
            <div className="sectionCard">
              <h2 className="sectionHeader">Billing Address</h2>
              <div className="formGrid">
                <div className="formGroup">
                  <label className="inputLabel">Street</label>
                  <input
                    className="edit"
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="123 Main St"
                  />
                </div>

                <div className="formGroup">
                  <label className="inputLabel">City</label>
                  <input
                    className="edit"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Athens"
                  />
                </div>

                <div className="formGroup">
                  <label className="inputLabel">State</label>
                  <input
                    className="edit"
                    type="text"
                    value={stateUS}
                    onChange={(e) => setStateUS(e.target.value)}
                    placeholder="GA"
                  />
                </div>

                <div className="formGroup">
                  <label className="inputLabel">ZIP</label>
                  <input
                    className="edit"
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="30601"
                  />
                </div>
              </div>
            </div>

            {/* ===== Change Password Section ===== */}
            <div className="sectionCard">
              <h2 className="sectionHeader">Change Password</h2>
              <div className="formGrid">
                <div className="formGroup">
                  <label className="inputLabel">Current Password</label>
                  <input
                    className="edit"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="formGroup">
                  <label className="inputLabel">New Password</label>
                  <input
                    className="edit"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="formGroup">
                  <label className="inputLabel">Confirm New Password</label>
                  <input
                    className="edit"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>
            </div>

            {/* ===== Payment Method Section ===== */}
            <div className="sectionCard">
              <h2 className="sectionHeader">Payment Method</h2>
              <div className="formGrid">
                <div className="formGroup">
                  <label className="inputLabel">Card Type</label>
                  <input
                    className="edit"
                    type="text"
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value)}
                    placeholder="Visa / MasterCard / etc."
                  />
                </div>

                <div className="formGroup">
                  <label className="inputLabel">Card Ending In</label>
                  <input
                    className="edit"
                    type="text"
                    value={cardLast4}
                    onChange={(e) => setCardLast4(e.target.value)}
                    placeholder="1234"
                  />
                </div>

                <div className="formGroup">
                  <label className="inputLabel">Exp. Month</label>
                  <input
                    className="edit"
                    type="text"
                    value={expMonth}
                    onChange={(e) => setExpMonth(e.target.value)}
                    placeholder="10"
                  />
                </div>

                <div className="formGroup">
                  <label className="inputLabel">Exp. Year</label>
                  <input
                    className="edit"
                    type="text"
                    value={expYear}
                    onChange={(e) => setExpYear(e.target.value)}
                    placeholder="27"
                  />
                </div>
              </div>
            </div>

            {/* ===== Promotions Section ===== */}
            <div className="sectionCard">
              <h2 className="sectionHeader">Promotions & Offers</h2>
              <div className="promoRow">
                <input
                  id="promoOptInBox"
                  type="checkbox"
                  checked={promoOptIn}
                  onChange={(e) => setPromoOptIn(e.target.checked)}
                />
                <label htmlFor="promoOptInBox" className="promoLabel">
                  Email me promotions, special offers, and early screenings
                </label>
              </div>
            </div>

            {/* ===== Action Buttons ===== */}
            <div className="buttonRow">
              <button className="primaryBtn" onClick={handleSave}>
                Save Changes
              </button>
              <button
                className="secondaryBtn"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default EditProfilePage;

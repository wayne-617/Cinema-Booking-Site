import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./editProfilePage.css"; // We are using your custom CSS file

function EditProfilePage() {
  const navigate = useNavigate();

  // --- State Definitions ---
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState(null);

  // Billing Address
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateUS, setStateUS] = useState("");
  const [zip, setZip] = useState("");

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Promotions
  const [promoOptIn, setPromoOptIn] = useState(false);

  // Payment
  const [cardType, setCardType] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");

  // UI State
  const [message, setMessage] = useState({ text: "", type: "" }); // type: 'success' or 'error'
  const [isLoading, setIsLoading] = useState(true);

  // --- Fetch profile data on mount ---
  useEffect(() => {
  async function fetchProfile() {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setMessage({ text: "You must be logged in.", type: "error" });
      navigate("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    const { token, userId: currentUserId } = userData;
    setUserId(currentUserId);

    try {
      const res = await fetch(`http://localhost:9090/api/profile/${currentUserId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch profile data");

      const profileData = await res.json(); // ✅ single unified object
      console.log("Profile data:", profileData);

      // --- Account Info ---
      setEmail(profileData.email || "");
      setFirstName(profileData.firstName.split(" ")[0] || "");
      setLastName(profileData.lastName.split(" ")[1] || "");
      setPhone(profileData.phone || "");

      // --- Billing Address ---
      setStreet(profileData.street || "");
      setCity(profileData.city || "");
      setStateUS(profileData.state || "");
      setZip(profileData.zip || "");

      // --- Payment Info ---
      setCardType(profileData.cardType || "");
      setCardNumber(profileData.cardNumber || "");
      setExpMonth(profileData.expMonth ? profileData.expMonth.toString() : "");
      setExpYear(profileData.expYear ? profileData.expYear.toString() : "");

      // --- Promo ---
      setPromoOptIn(profileData.promoOptIn || false);

    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  }

  fetchProfile();
}, [navigate]);





  // --- Handle Save Changes ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ text: "New password and confirmation do not match.", type: "error" });
      return;
    }

    const storedUser = localStorage.getItem("user");
    const userData = JSON.parse(storedUser);
    const { userId: currentUserId, username: email } = userData;
    setUserId(currentUserId);

    if (!storedUser) {
      setMessage({ text: "Authentication error. Please log in again.", type: "error" });
      return;
    }
    const { token } = JSON.parse(storedUser);

    setIsLoading(true);
    setMessage({ text: "", type: "" }); // Clear old messages

    // This payload MUST match your UpdateProfileRequestDTO
    let cleanedCardNumber = cardNumber;
    if (cardNumber && cardNumber.startsWith("****")) {
      cleanedCardNumber = null; // don't send masked number back to backend
    }

    const billingPayload = {
      first_name: firstName,
      last_name: lastName,
      userId: currentUserId,
      cardType,
      cardNumber: cleanedCardNumber,
      expMonth: expMonth ? parseInt(expMonth, 10) : null,
      expYear: expYear ? parseInt(expYear, 10) : null,
      street,
      city,
      state: stateUS,
      zip
    };

    const payload2 = {
      username: email,
      phone,
      fullName: firstName + " " + lastName
      
    };

    if (newPassword && currentPassword) {
      payload2.currentPassword = currentPassword;
     payload2.newPassword = newPassword;
  }

    console.log("Submitting profile update payload:", billingPayload);
    console.log("Submitting profile update 2nd payload:", payload2);
    try {
      const res = await fetch(`http://localhost:9090/billing/submit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(billingPayload),
      });

      if (!res.ok) {
        // Try to parse error from backend
        
        let errorMsg = "Failed to update profile. Billing info error";
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch (parseError) {
          // Keep default error message
        }
        throw new Error(errorMsg);
      }
      try {
      const res1 = await fetch(`http://localhost:9090/auth/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload2),
      });

      if (!res1.ok) {
        // Try to parse error from backend
        let errorMsg = "Failed to update profile. User info error";
        try {
          const errorData = await res1.json();
          errorMsg = errorData.message || errorMsg;
        } catch (parseError) {
          // Keep default error message
        }
        throw new Error(errorMsg);
      }
        } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
      if (newPassword && currentPassword) {
  setMessage({ text: "Password updated successfully!", type: "success" });

  // 🔒 Optional: Log the user out after password change (for security)
  setTimeout(() => {
    localStorage.removeItem("user");
    navigate("/login");
  }, 2000);

  return; // Stop further execution (don’t reload the page)
  } else {
    setMessage({ text: "Profile updated successfully!", type: "success" });
  }

  // ✅ Clear password fields
  setCurrentPassword("");
  setNewPassword("");
  setConfirmPassword("");

  // ✅ Update localStorage to keep NavBar in sync
  const oldUserData = JSON.parse(localStorage.getItem("user"));
  const newUserData = {
    ...oldUserData,
    fullName: `${firstName} ${lastName}`,
    firstName: firstName,
  };
  localStorage.setItem("user", JSON.stringify(newUserData));

  // ✅ Reload only for non-password updates
  setTimeout(() => {
    window.location.reload();
  }, 1000);


    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render JSX ---
  return (
    <div className="editProfilePage-container">
      <form className="editProfilePage-card" onSubmit={handleSave}>
        <h1 className="editProfilePage-title">Edit Profile</h1>

        {/* --- Message Bar --- */}
        {message.text && (
          <div className={`editProfilePage-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {isLoading && <div className="loading-text">Loading profile...</div>}

        {/* ===== Account Information ===== */}
        <fieldset disabled={isLoading} className="editProfilePage-section">
          <h2 className="editProfilePage-sectionHeader">Account Information</h2>
          <div className="editProfilePage-formGrid">
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="email">Email (cannot be changed) </label>
              <input id="email" className="editProfilePage-input editProfilePage-readOnly" value={email} placeholder={email}disabled />
            </div>

            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="phone">Phone Number</label>
              <input id="phone" className="editProfilePage-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder={phone}/>
            </div>
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="firstName">First Name</label>
              <input id="firstName" className="editProfilePage-input" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder={firstName}/>
            </div>
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="lastName">Last Name</label>
              <input id="lastName" className="editProfilePage-input" value={lastName} onChange={e => setLastName(e.target.value)} placeholder={lastName} />
            </div>
          </div>
        </fieldset>

        {/* ===== Billing Address ===== */}
        <fieldset disabled={isLoading} className="editProfilePage-section">
          <h2 className="editProfilePage-sectionHeader">Billing Address</h2>
          <div className="editProfilePage-formGrid">
            
            <div className="editProfilePage-formGroup formGroup-span2">
              <label className="editProfilePage-inputLabel" htmlFor="street">Street</label>
              <input id="street" className="editProfilePage-input" value={street} onChange={e => setStreet(e.target.value)} placeholder={street}/>
            </div>
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="city">City</label>
              <input id="city" className="editProfilePage-input" value={city} onChange={e => setCity(e.target.value)} placeholder={city}/>
            </div>
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="state">State</label>
              <input id="state" className="editProfilePage-input" value={stateUS} onChange={e => setStateUS(e.target.value)} placeholder={stateUS} />
            </div>

            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="zip">ZIP</label>
              <input id="zip" className="editProfilePage-input" value={zip} onChange={e => setZip(e.target.value)} placeholder={zip}maxLength="5"/>
            </div>
          </div>
        </fieldset>

        {/* ===== Change Password ===== */}
        <fieldset disabled={isLoading} className="editProfilePage-section">
          <h2 className="editProfilePage-sectionHeader">Change Password</h2>
          <div className="editProfilePage-formGrid grid-cols-3"> {/* Special grid for 3 items */}
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="currentPassword">Current Password</label>
              <input id="currentPassword" className="editProfilePage-input" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter current password"/>
            </div>
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="newPassword">New Password</label>
              <input id="newPassword" className="editProfilePage-input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password"/>
            </div>
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="confirmPassword">Confirm New Password</label>
              <input id="confirmPassword" className="editProfilePage-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter new password"/>
            </div>
          </div>
        </fieldset>

        {/* ===== Payment Method ===== */}
        <fieldset disabled={isLoading} className="editProfilePage-section">
          <h2 className="editProfilePage-sectionHeader">Payment Method</h2>
          <div className="editProfilePage-formGrid grid-cols-4"> {/* Special grid for 4 items */}
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="cardType">Card Type</label>
              <input id="cardType" className="editProfilePage-input" value={cardType} onChange={e => setCardType(e.target.value)} placeholder={cardType}/>
            </div>
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="cardNumber">Card Number</label>
              <input
                id="cardNumber"
                className="editProfilePage-input"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder={cardNumber || "Enter card number"}
                maxLength="19"
                readOnly={cardNumber.startsWith("****")}
              />
              {cardNumber.startsWith("****") && (
                <button
                  type="button"
                  className="editProfilePage-buttonSecondary small-btn"
                  onClick={() => setCardNumber("")}
                >
                  Update Card Info
                </button>
              )}
            </div>
                      
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="expMonth">Exp. Month</label>
              <input id="expMonth" className="editProfilePage-input" value={expMonth} onChange={e => setExpMonth(e.target.value)}placeholder={expMonth} maxLength="2"/>
            </div>
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="expYear">Exp. Year</label>
              <input id="expYear" className="editProfilePage-input" value={expYear} onChange={e => setExpYear(e.target.value)} placeholder={expYear} maxLength="2"/>
            </div>
          </div>
        </fieldset>

        {/* ===== Promotions ===== */}
        <fieldset disabled={isLoading} className="editProfilePage-section">
          <h2 className="editProfilePage-sectionHeader">Promotions & Offers</h2>
          <div className="editProfilePage-formGroup-promo"> {/* Using your CSS class */}
            <input 
              id="promoOptInBox" 
              type="checkbox" 
              className="promo-checkbox" // Added a class for easier selection
              checked={promoOptIn} 
              onChange={e => setPromoOptIn(e.target.checked)}
            />
            <label htmlFor="promoOptInBox" className="editProfilePage-inputLabel promo-label">
              Email me promotions, special offers, and early screenings.
            </label>
          </div>
        </fieldset>

        {/* ===== Action Buttons ===== */}
        <div className="editProfilePage-buttonRow">
          <button type="button" className="editProfilePage-buttonSecondary" onClick={() => navigate(-1)} disabled={isLoading}>
            Cancel
          </button>
          <button type="submit" className="editProfilePage-buttonPrimary" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfilePage;



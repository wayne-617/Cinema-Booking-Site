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
  const [cardLast4, setCardLast4] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");

  // UI State
  const [message, setMessage] = useState({ text: "", type: "" }); // type: 'success' or 'error'
  const [isLoading, setIsLoading] = useState(true);

  // --- Fetch profile data on mount ---
  useEffect(() => {
    async function fetchProfile() {
      // Get user info from localStorage (set during login)
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setMessage({ text: "You must be logged in.", type: "error" });
        setIsLoading(false);
        navigate("/login");
        return;
      }

      const userData = JSON.parse(storedUser);
      const { token, userId: currentUserId } = userData;

      if (!token || !currentUserId) {
        setMessage({ text: "Invalid authentication. Please log in again.", type: "error" });
        setIsLoading(false);
        navigate("/login");
        return;
      }

      setUserId(currentUserId);

      try {
        const res = await fetch(`http://localhost:9090/api/profile/${currentUserId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile data.");
        }

        const data = await res.json(); // This is your full ProfileResponseDTO

        // Set Account Info
        setEmail(data.email || "");
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setPhone(data.phone || "");
        
        // Set Promotions
        setPromoOptIn(data.promoOptIn || false);

        // Set Billing Address
        setStreet(data.street || "");
        setCity(data.city || "");
        setStateUS(data.state || "");
        setZip(data.zip || "");

        // Set Payment
        setCardType(data.cardType || "");
        setCardLast4(data.lastFour ? data.lastFour.toString() : "");
        setExpMonth(data.expMonth ? data.expMonth.toString() : "");
        setExpYear(data.expYear ? data.expYear.toString() : "");


      } catch (error) {
        setMessage({ text: error.message, type: "error" });
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
    if (!storedUser) {
      setMessage({ text: "Authentication error. Please log in again.", type: "error" });
      return;
    }
    const { token } = JSON.parse(storedUser);

    setIsLoading(true);
    setMessage({ text: "", type: "" }); // Clear old messages

    // This payload MUST match your UpdateProfileRequestDTO
    const payload = {
      email,
      newPassword: newPassword || null,

      // Payment
      cardType,
      lastFour: cardLast4 ? parseInt(cardLast4, 10) : null,
      expMonth: expMonth ? parseInt(expMonth, 10) : null,
      expYear: expYear ? parseInt(expYear, 10) : null,
    };

    console.log("Submitting profile update payload:", payload);

    try {
      const res = await fetch(`http://localhost:9090/api/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Try to parse error from backend
        let errorMsg = "Failed to update profile.";
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch (parseError) {
          // Keep default error message
        }
        throw new Error(errorMsg);
      }
      
      setMessage({ text: "Profile updated successfully!", type: "success" });
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // --- Update localStorage to keep NavBar in sync ---
      const oldUserData = JSON.parse(localStorage.getItem("user"));
      const newUserData = {
        ...oldUserData,
        fullName: `${firstName} ${lastName}`,
        firstName: firstName,
      };
      localStorage.setItem("user", JSON.stringify(newUserData));

      // Reload to reflect changes (optional, but good for NavBar)
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 1-second delay to let user read success message


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
              <label className="editProfilePage-inputLabel" htmlFor="email">Email (cannot be changed)</label>
              <input id="email" className="editProfilePage-input editProfilePage-readOnly" value={email} disabled />
            </div>

            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="phone">Phone Number</label>
              <input id="phone" className="editProfilePage-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="123-456-7890"/>
            </div>
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="firstName">First Name</label>
              <input id="firstName" className="editProfilePage-input" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name"/>
            </div>
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="lastName">Last Name</label>
              <input id="lastName" className="editProfilePage-input" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name"/>
            </div>
          </div>
        </fieldset>

        {/* ===== Billing Address ===== */}
        <fieldset disabled={isLoading} className="editProfilePage-section">
          <h2 className="editProfilePage-sectionHeader">Billing Address</h2>
          <div className="editProfilePage-formGrid">
            
            <div className="editProfilePage-formGroup formGroup-span2">
              <label className="editProfilePage-inputLabel" htmlFor="street">Street</label>
              <input id="street" className="editProfilePage-input" value={street} onChange={e => setStreet(e.target.value)} placeholder="123 Main St"/>
            </div>
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="city">City</label>
              <input id="city" className="editProfilePage-input" value={city} onChange={e => setCity(e.target.value)} placeholder="Athens"/>
            </div>
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="state">State</label>
              <input id="state" className="editProfilePage-input" value={stateUS} onChange={e => setStateUS(e.target.value)} placeholder="GA" maxLength="2"/>
            </div>

            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="zip">ZIP</label>
              <input id="zip" className="editProfilePage-input" value={zip} onChange={e => setZip(e.target.value)} placeholder="30601" maxLength="5"/>
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
              <input id="cardType" className="editProfilePage-input" value={cardType} onChange={e => setCardType(e.target.value)} placeholder="Visa / MasterCard"/>
            </div>
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="cardLast4">Card Ending In</label>
              <input id="cardLast4" className="editProfilePage-input" value={cardLast4} onChange={e => setCardLast4(e.target.value)} placeholder="1234" maxLength="4"/>
            </div>
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="expMonth">Exp. Month</label>
              <input id="expMonth" className="editProfilePage-input" value={expMonth} onChange={e => setExpMonth(e.target.value)} placeholder="MM" maxLength="2"/>
            </div>
            
            <div className="editProfilePage-formGroup">
              <label className="editProfilePage-inputLabel" htmlFor="expYear">Exp. Year</label>
              <input id="expYear" className="editProfilePage-input" value={expYear} onChange={e => setExpYear(e.target.value)} placeholder="YY" maxLength="2"/>
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



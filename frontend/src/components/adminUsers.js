import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./adminUsers.css";

// shared validation
const validateUserForm = (form) => {
  const errors = {};
  if (!form.fullName || form.fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters.";
  }
  if (!form.phone || !/^[0-9]{10}$/.test(form.phone.trim())) {
    errors.phone = "Phone must be exactly 10 digits.";
  }
  if (!form.homeAddress || form.homeAddress.trim().length < 5) {
    errors.homeAddress = "Address must be at least 5 characters.";
  }
  return errors;
};

// single table row – keeps its own edit state
function UserRow({
  user,
  statusActionLabel,
  onSaveUser,
  onToggleStatus,
  onChangeRole,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: user.fullName || "",
    phone: user.phone || "",
    homeAddress: user.homeAddress || "",
    promoOptIn: !!user.promoOptIn,
  });
  const [errors, setErrors] = useState({});

  // keep local form in sync with latest data when not editing
  useEffect(() => {
    if (!isEditing) {
      setForm({
        fullName: user.fullName || "",
        phone: user.phone || "",
        homeAddress: user.homeAddress || "",
        promoOptIn: !!user.promoOptIn,
      });
      setErrors({});
    }
  }, [user.fullName, user.phone, user.homeAddress, user.promoOptIn, isEditing]);

  const handleFieldChange = (field) => (e) => {
    const value =
      field === "promoOptIn" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = async () => {
    const ok = await onSaveUser(user.id, form, setErrors);
    if (ok) {
      setIsEditing(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
      homeAddress: user.homeAddress || "",
      promoOptIn: !!user.promoOptIn,
    });
    setErrors({});
  };

  return (
    <tr>
      <td>{user.id}</td>
      <td>{user.username}</td>

      {/* Full Name */}
      <td>
        {isEditing ? (
          <>
            <input
              type="text"
              value={form.fullName}
              onChange={handleFieldChange("fullName")}
            />
            {errors.fullName && (
              <div className="fieldError">{errors.fullName}</div>
            )}
          </>
        ) : (
          user.fullName
        )}
      </td>

      {/* Phone */}
      <td>
        {isEditing ? (
          <>
            <input
              type="text"
              value={form.phone}
              onChange={handleFieldChange("phone")}
            />
            {errors.phone && (
              <div className="fieldError">{errors.phone}</div>
            )}
          </>
        ) : (
          user.phone || "—"
        )}
      </td>

      {/* Role – locked unless editing */}
      <td>
        <select
          value={user.role}
          disabled={!isEditing}
          onChange={(e) => onChangeRole(user.id, e.target.value)}
        >
          <option value="CUSTOMER">CUSTOMER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </td>

      {/* Status */}
      <td>{user.enabled ? "Verified" : "Suspended"}</td>

      {/* Promo Opt-In */}
      <td>
        {isEditing ? (
          <input
            type="checkbox"
            checked={form.promoOptIn}
            onChange={handleFieldChange("promoOptIn")}
          />
        ) : user.promoOptIn ? (
          "Yes"
        ) : (
          "No"
        )}
      </td>

      {/* Address */}
      <td>
        {isEditing ? (
          <>
            <input
              type="text"
              value={form.homeAddress}
              onChange={handleFieldChange("homeAddress")}
            />
            {errors.homeAddress && (
              <div className="fieldError">{errors.homeAddress}</div>
            )}
          </>
        ) : (
          user.homeAddress || "—"
        )}
      </td>

      {/* Actions */}
      <td>
        {isEditing ? (
          <>
            <button className="updateBtn" onClick={handleSaveClick}>
              Save
            </button>
            <button className="deleteBtn" onClick={handleCancelClick}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="updateBtn"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className={
                statusActionLabel === "Suspend" ? "deleteBtn" : "updateBtn"
              }
              onClick={() => onToggleStatus(user)}
            >
              {statusActionLabel}
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

function AdminUsers() {
  const navigate = useNavigate();
  const { userAuth } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // load users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:9090/auth/users");
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error loading users:", err);
      setError(err.message || "Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userAuth !== "ADMIN") {
      navigate("/login");
      return;
    }
    fetchUsers();
  }, [userAuth, navigate]);

  const activeUsers = users.filter((u) => u.enabled);
  const suspendedUsers = users.filter((u) => !u.enabled);

  // suspend/reactivate
  const handleToggleStatus = async (user) => {
    const newStatus = !user.enabled;
    const verb = newStatus ? "reactivate" : "suspend";
    if (!window.confirm(`Are you sure you want to ${verb} this user?`)) return;

    try {
      const res = await fetch(
        `http://localhost:9090/auth/users/${user.id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update user status");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, enabled: newStatus } : u
        )
      );
      alert(`User ${verb}d.`);
    } catch (err) {
      console.error("Error updating user status:", err);
      alert("Error updating user status: " + (err.message || ""));
    }
  };

  // change role (only actually usable while row is editing, since select is disabled otherwise)
  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await fetch(
        `http://localhost:9090/auth/users/${userId}/role`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        }
      );
      if (!res.ok) throw new Error("Failed to update user role");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
    } catch (err) {
      console.error("Error updating user role:", err);
      alert("Error updating user role: " + (err.message || ""));
    }
  };

  // save edits coming from a row
  const handleSaveUser = async (userId, form, setRowErrors) => {
    const errors = validateUserForm(form);
    if (Object.keys(errors).length > 0) {
      setRowErrors(errors);
      alert("Please fix the highlighted errors before saving.");
      return false;
    }

    try {
      const res = await fetch(`http://localhost:9090/auth/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        let msg = "Failed to update user";
        try {
          const body = await res.json();
          if (body && typeof body === "object") msg = JSON.stringify(body);
        } catch {}
        throw new Error(msg);
      }

      const updated = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updated } : u))
      );
      alert("User updated.");
      return true;
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Error updating user: " + (err.message || ""));
      return false;
    }
  };

  const UserTable = ({ title, users, statusActionLabel }) => (
    <>
      <h2 className="adminUsers-sectionHeader">{title}</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username (Email)</th>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Promo Opt-In</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  {title === "Active Users"
                    ? "No active users."
                    : "No suspended users."}
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <UserRow
                  key={u.id}
                  user={u}
                  statusActionLabel={statusActionLabel}
                  onSaveUser={handleSaveUser}
                  onToggleStatus={handleToggleStatus}
                  onChangeRole={handleChangeRole}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <div className="bodyDiv">
      <section className="contentSection">
        <section className="bodySection">
          <div className="bodyTextDiv adminUsers-card">
            <div className="movie-input">
              <h1>Manage Users</h1>
              <p>View and manage registered users.</p>
            </div>

            {loading && <p>Loading users...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
              <>
                <UserTable
                  title="Active Users"
                  users={activeUsers}
                  statusActionLabel="Suspend"
                />
                <UserTable
                  title="Suspended Users"
                  users={suspendedUsers}
                  statusActionLabel="Reactivate"
                />
              </>
            )}
          </div>
        </section>
      </section>
    </div>
  );
}

export default AdminUsers;

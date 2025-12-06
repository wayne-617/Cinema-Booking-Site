import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./adminUsers.css";



function AdminUsers() {
  const navigate = useNavigate();
  const { userAuth } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    homeAddress: "",
    promoOptIn: false,
  });
  const [editErrors, setEditErrors] = useState({});

  // data
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

  // actions
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
        prev.map((u) => (u.id === user.id ? { ...u, enabled: newStatus } : u))
      );
      alert(`User ${verb}d.`);
    } catch (err) {
      console.error("Error updating user status:", err);
      alert("Error updating user status: " + (err.message || ""));
    }
  };

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
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Error updating user role:", err);
      alert("Error updating user role: " + (err.message || ""));
    }
  };

  // edits
  const startEditUser = (user) => {
    setEditingUserId(user.id);
    setEditForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
      homeAddress: user.homeAddress || "",
      promoOptIn: !!user.promoOptIn,
    });
    setEditErrors({});
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditForm({
      fullName: "",
      phone: "",
      homeAddress: "",
      promoOptIn: false,
    });
    setEditErrors({});
  };

  const validateEditForm = (form) => {
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

  const saveUserEdits = async (userId) => {
    if (!editForm) return;

    const errors = validateEditForm(editForm);
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      alert("Please fix the highlighted errors before saving.");
      return;
    }

    setEditErrors({});
    try {
      const res = await fetch(`http://localhost:9090/auth/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
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
      setEditingUserId(null);
      setEditForm({
        fullName: "",
        phone: "",
        homeAddress: "",
        promoOptIn: false,
      });
      setEditErrors({});
      alert("User updated.");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Error updating user: " + (err.message || ""));
    }
  };

  // table components
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
              users.map((u) => {
                const isEditing = editingUserId === u.id;
                return (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>

                    {/* Full Name */}
                    <td>
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={editForm.fullName}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                fullName: e.target.value,
                              }))
                            }
                          />
                          {editErrors.fullName && (
                            <div className="fieldError">
                              {editErrors.fullName}
                            </div>
                          )}
                        </>
                      ) : (
                        u.fullName
                      )}
                    </td>

                    {/* Phone */}
                    <td>
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={editForm.phone}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                          />
                          {editErrors.phone && (
                            <div className="fieldError">
                              {editErrors.phone}
                            </div>
                          )}
                        </>
                      ) : (
                        u.phone || "—"
                      )}
                    </td>

                    {/* Role */}
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleChangeRole(u.id, e.target.value)
                        }
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    {/* Status */}
                    <td>{u.enabled ? "Verified" : "Suspended"}</td>

                    {/* Promo */}
                    <td>
                      {isEditing ? (
                        <input
                          type="checkbox"
                          checked={editForm.promoOptIn}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              promoOptIn: e.target.checked,
                            }))
                          }
                        />
                      ) : u.promoOptIn ? (
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
                            value={editForm.homeAddress}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                homeAddress: e.target.value,
                              }))
                            }
                          />
                          {editErrors.homeAddress && (
                            <div className="fieldError">
                              {editErrors.homeAddress}
                            </div>
                          )}
                        </>
                      ) : (
                        u.homeAddress || "—"
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      {isEditing ? (
                        <>
                          <button
                            className="updateBtn"
                            onClick={() => saveUserEdits(u.id)}
                          >
                            Save
                          </button>
                          <button
                            className="deleteBtn"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="updateBtn"
                            onClick={() => startEditUser(u)}
                          >
                            Edit
                          </button>
                          <button
                            className={
                              statusActionLabel === "Suspend"
                                ? "deleteBtn"
                                : "updateBtn"
                            }
                            onClick={() => handleToggleStatus(u)}
                          >
                            {statusActionLabel}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  // main layout
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

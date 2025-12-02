import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./dashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { userAuth } = useAuth();

  useEffect(() => {
    if (userAuth !== "ADMIN") {
      navigate("/login");
    }
  }, [userAuth, navigate]);

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title"> Admin Dashboard</h1>
      <p className="admin-subtitle">Manage everything in one place.</p>

      <div className="admin-grid">
        <div
          className="admin-card"
          onClick={() => navigate("/adminmovies")}
        >
          <h2>Movies</h2>
          <p>Add, update & schedule showtimes</p>
        </div>

        <div
          className="admin-card"
          onClick={() => navigate("/adminusers")}
        >
          <h2> Users</h2>
          <p>View and manage user accounts</p>
        </div>

        <div
          className="admin-card"
          onClick={() => navigate("/admin/orders")}
        >
          <h2> Orders</h2>
          <p>View booking history and analytics</p>
        </div>

        <div
          className="admin-card"
          onClick={() => navigate("/adminpromotions")}
        >
          <h2> Promotions</h2>
          <p>Create discounts and special offers</p>
        </div>
      </div>
    </div>
  );
}

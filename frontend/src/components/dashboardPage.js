import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { userAuth } = useAuth();

  useEffect(() => {
    if (userAuth !== "ADMIN") {
      navigate("/login");
    }
  }, [userAuth, navigate]);

  return (
    <div>
      <h1>Welcome to the Admin Dashboard</h1>
      <p>Manage movies, promotions, users and more.</p>
    </div>
  );
}

import React from "react";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const { userAuth } = useAuth();

  if (userAuth !== "ADMIN") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>🚫 Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return children;
}

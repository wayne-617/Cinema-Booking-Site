import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireCustomer({ children }) {
  const { userAuth, isLoggedIn, authLoaded } = useAuth();

  if (!authLoaded)
    return <div>Checking session...</div>; // Wait for localStorage load

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  if (userAuth !== "CUSTOMER" && userAuth !== "ADMIN")
    return <Navigate to="/" replace />;

  return children;
}
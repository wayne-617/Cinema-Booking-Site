import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireCustomer({ children }) {
  const { userAuth, isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (userAuth !== "CUSTOMER" && userAuth !== "ADMIN") return <Navigate to="/" replace />;

  return children;
}

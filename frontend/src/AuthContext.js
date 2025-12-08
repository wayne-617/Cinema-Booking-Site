import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userAuth, setUserAuth] = useState(null); 
  const [authLoaded, setAuthLoaded] = useState(false); 

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));

    if (stored) {
      setCurrentUser(stored);
      setUserAuth(stored.role?.toUpperCase() || null);
    }

    setAuthLoaded(true); 
  }, []);

  const setUser = (user) => {
    setCurrentUser(user);
    setUserAuth(user?.role?.toUpperCase() || null);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };

  const setAuth = (auth) => {
    setUserAuth(auth?.toUpperCase() || null);
  };

  const [adminMode, setAdminMode] = useState(
    localStorage.getItem("adminMode") === "true"
  );

  const toggleAdminMode = () => {
    const newMode = !adminMode;
    setAdminMode(newMode);
    localStorage.setItem("adminMode", newMode);
  };

  const value = {
    currentUser,
    userAuth,
    isLoggedIn: !!currentUser,
    authLoaded,         
    setUser,
    setAuth,
    adminMode,
    toggleAdminMode,
    setAdminMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

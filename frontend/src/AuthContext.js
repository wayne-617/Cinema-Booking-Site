import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userAuth, setUserAuth] = useState(null);

  const setUser = (user) => {
  setCurrentUser(user);
  setUserAuth(user?.auth?.toUpperCase() || null);
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
  adminMode,
  toggleAdminMode,
  setAdminMode,     
  isLoggedIn: !!currentUser,
  setUser,
  setAuth
};
  

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

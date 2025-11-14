import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

/* This Design Pattern Provides Context to the entire frontend
simplyifying the data that needs to be passed */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userAuth, setUserAuth] = useState(null);

  const login = (user) => {
    setCurrentUser(user);
  };
  const setAuth = (auth) => {
    setUserAuth(auth);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    userAuth,
    isLoggedIn: !!currentUser,
    login,
    setAuth,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));

  useEffect(() => {
    if (userId) localStorage.setItem("userId", userId);
    else localStorage.removeItem("userId");
  }, [userId]);

  const value = { userId, setUserId };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
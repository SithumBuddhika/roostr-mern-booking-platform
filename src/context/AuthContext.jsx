// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // load "session" on first render
  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("roostr_user") ||
        localStorage.getItem("roostrUser") ||
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser");

      const storedToken =
        localStorage.getItem("roostr_token") ||
        localStorage.getItem("roostrToken") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("token");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (err) {
      console.warn("Failed to restore auth from localStorage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // “official” login – call this in your Login page after successful auth
  const login = (userData, jwtToken) => {
    if (userData) {
      setUser(userData);
      localStorage.setItem("roostr_user", JSON.stringify(userData));
    }
    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem("roostr_token", jwtToken);
    }
  };

  // central logout – clears all legacy keys too
  const logout = () => {
    setUser(null);
    setToken(null);

    const keysToClear = [
      "token",
      "authToken",
      "roostr_token",
      "roostrToken",
      "roostr_user",
      "roostrUser",
      "user",
      "currentUser",
      "isHost",
    ];

    keysToClear.forEach((k) => localStorage.removeItem(k));
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          const hasToken =
            localStorage.getItem("roostrToken") ||
            localStorage.getItem("roostr_token") ||
            localStorage.getItem("token") ||
            localStorage.getItem("authToken");

          if (hasToken) {
            logout();
            alert("Your session has expired. Please log in again.");
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// hook to use in components
export const useAuth = () => useContext(AuthContext);

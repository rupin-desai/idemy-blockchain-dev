import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const init = async () => {
      try {
        const user = authService.getCurrentUser();
        // Verify token is valid with a lightweight API call
        if (user && authService.isAuthenticated()) {
          await authService.validateToken();
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        // If token validation fails, logout
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const data = await authService.login(email, password);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    // Redirect to login
    window.location.href = "/login";
  };

  const value = {
    currentUser,
    loading,
    authLoading,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

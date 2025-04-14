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
        // If user exists in localStorage, trust it without validation during development
        if (user && authService.isAuthenticated()) {
          // In development, skip token validation to prevent logout on refresh
          if (import.meta.env.DEV) {
            setCurrentUser(user);
          } else {
            // In production, validate the token
            try {
              await authService.validateToken();
              setCurrentUser(user);
            } catch (validationError) {
              console.error("Token validation failed:", validationError);
              authService.logout();
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Only logout if not in development
        if (!import.meta.env.DEV) {
          authService.logout();
        }
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

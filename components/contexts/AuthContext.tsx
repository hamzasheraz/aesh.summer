"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

interface AuthContextType {
  isLoggedIn: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in on component mount
    const checkLoginStatus = () => {
      const loggedIn = sessionStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)
    }

    checkLoginStatus()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      // Handle non-OK responses
      if (!response.ok) {
        const data = await response.json();
        console.error("Login failed:", data.message || "Unknown error");
        return false;
      }
  
      // Handle success response
      const data = await response.json();
      if (data.message === "Login successful") {
        setIsLoggedIn(true);  // Update the login state
        
        // Store the login status in sessionStorage
        sessionStorage.setItem("isLoggedIn", "true");

        // Optionally redirect user to dashboard or another page
        // e.g., window.location.href = "/dashboard";
  
        return true; // Successfully logged in
      }
  
      return false; // Login failed (message not "Login successful")
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false)
    sessionStorage.removeItem("isLoggedIn") // Remove login status from sessionStorage
  }

  return <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

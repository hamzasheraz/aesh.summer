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
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)
    }

    checkLoginStatus()
  }, [])

  const login = async (username: string, password: string) => {
    // In a real application, you would validate credentials against a backend
    if (username === "admin" && password === "password") {
      setIsLoggedIn(true)
      localStorage.setItem("isLoggedIn", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem("isLoggedIn")
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


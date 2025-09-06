"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface User {
  address: string
  displayName?: string
  avatar?: string
  verified: {
    wallet: boolean
    github: boolean
    twitter: boolean
  }
  profile: {
    bio?: string
    website?: string
    github?: string
    twitter?: string
  }
  stats: {
    bountiesCompleted: number
    projectsFunded: number
    grantsReceived: number
    ideasSubmitted: number
  }
  applicationCount: number
  lastApplicationReset: string
}

interface AuthContextType {
  user: User | null
  isConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  updateProfile: (profile: Partial<User["profile"]>) => void
  verifyGithub: () => Promise<void>
  verifyTwitter: () => Promise<void>
  canApply: boolean
  remainingApplications: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Mock wallet connection - in real implementation, use @stacks/connect
  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      // Simulate wallet connection delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock user data
      const mockUser: User = {
        address: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
        displayName: "Developer",
        avatar: "/user-avatar.png",
        verified: {
          wallet: true,
          github: false,
          twitter: false,
        },
        profile: {
          bio: "Passionate Stacks developer building the future of Bitcoin DeFi",
          website: "https://example.com",
        },
        stats: {
          bountiesCompleted: 12,
          projectsFunded: 3,
          grantsReceived: 1,
          ideasSubmitted: 8,
        },
        applicationCount: 2,
        lastApplicationReset: new Date().toISOString(),
      }

      setUser(mockUser)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setUser(null)
  }

  const updateProfile = (profileUpdate: Partial<User["profile"]>) => {
    if (user) {
      setUser({
        ...user,
        profile: { ...user.profile, ...profileUpdate },
      })
    }
  }

  const verifyGithub = async () => {
    if (user) {
      // Mock GitHub verification
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUser({
        ...user,
        verified: { ...user.verified, github: true },
        profile: { ...user.profile, github: "developer123" },
      })
    }
  }

  const verifyTwitter = async () => {
    if (user) {
      // Mock Twitter verification
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUser({
        ...user,
        verified: { ...user.verified, twitter: true },
        profile: { ...user.profile, twitter: "@developer123" },
      })
    }
  }

  // Check if user can apply (3-4 applications per month)
  const canApply = user ? user.applicationCount < 4 : false
  const remainingApplications = user ? 4 - user.applicationCount : 0

  return (
    <AuthContext.Provider
      value={{
        user,
        isConnecting,
        connectWallet,
        disconnectWallet,
        updateProfile,
        verifyGithub,
        verifyTwitter,
        canApply,
        remainingApplications,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { connect, disconnect, isConnected, getLocalStorage, request } from '@stacks/connect'

interface User {
  id: string
  stxAddress: string
  btcAddress: string
  publicKey: string
  username?: string
  email?: string
  createdAt: string
  profileData?: {
    name?: string
    bio?: string
    avatar?: string
    skills?: string[]
    githubUrl?: string
    portfolioUrl?: string
  }
  stackerScore?: number
  totalEarned?: number
  completedProjects?: number
  reputation?: number
}

interface WalletContextType {
  user: User | null
  isConnecting: boolean
  isAuthenticated: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  updateProfile: (profileData: Partial<User['profileData']>) => Promise<void>
  refreshUser: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkExistingConnection()
  }, [])

  const checkExistingConnection = async () => {
    if (isConnected()) {
      const userData = getLocalStorage()
      if (userData?.addresses?.stx?.[0]?.address) {
        await authenticateUser(userData.addresses.stx[0].address)
      }
    }
  }

  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      
      // Check if already connected
      if (isConnected()) {
        console.log('Already authenticated')
        return
      }

      // Connect to wallet
      const response = await connect()
      console.log('Connected:', response.addresses)

      // Get the STX and BTC addresses - handle both array and object formats
      const addresses = response.addresses as any
      const stxAddress = Array.isArray(addresses) 
        ? addresses.find(addr => addr.type === 'stx')?.address
        : addresses.stx?.[0]?.address

      const btcAddress = Array.isArray(addresses)
        ? addresses.find(addr => addr.type === 'btc')?.address  
        : addresses.btc?.[0]?.address

      if (!stxAddress) {
        throw new Error('No STX address found')
      }

      // Get detailed account information
      const accounts = await request('stx_getAccounts')
      const account = (accounts as any).addresses?.[0] || (accounts as any)

      // Authenticate/create user in our backend
      await authenticateUser(stxAddress, {
        btcAddress,
        publicKey: account.publicKey || ''
      })

    } catch (error) {
      console.error('Wallet connection failed:', error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  const authenticateUser = async (stxAddress: string, additionalData?: any) => {
    try {
      // Call our backend API to create/authenticate user
      const response = await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stxAddress,
          btcAddress: additionalData?.btcAddress,
          publicKey: additionalData?.publicKey,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to authenticate user')
      }

      const userData = await response.json()
      setUser(userData.user)
      setIsAuthenticated(true)
      
    } catch (error) {
      console.error('User authentication failed:', error)
      throw error
    }
  }

  const disconnectWallet = () => {
    disconnect() // Clears storage and wallet selection
    setUser(null)
    setIsAuthenticated(false)
    console.log('User disconnected')
  }

  const updateProfile = async (profileData: Partial<User['profileData']>) => {
    if (!user) return

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stxAddress: user.stxAddress,
          profileData,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedUser = await response.json()
      setUser(updatedUser.user)
      
    } catch (error) {
      console.error('Profile update failed:', error)
      throw error
    }
  }

  const refreshUser = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/user/${user.stxAddress}`)
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  const value: WalletContextType = {
    user,
    isConnecting,
    isAuthenticated,
    connectWallet,
    disconnectWallet,
    updateProfile,
    refreshUser,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

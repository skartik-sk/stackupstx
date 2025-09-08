"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { showConnect, disconnect, AppConfig, UserSession } from '@stacks/connect'
import { toast } from 'react-hot-toast'

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })

interface User {
  id: string
  stxAddress: string
  btcAddress?: string
  publicKey?: string
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://stackup-backend-omega.vercel.app' || 'https://stackup-backend-36eb8e6c-singupalli-kartiks-projects.vercel.app'

export function WalletProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkExistingConnection()
  }, [])

  const checkExistingConnection = async () => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData()
      console.log('Existing user data:', userData)
      
      if (userData?.profile?.stxAddress) {
        const stxAddress = userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet
        await authenticateUser(stxAddress, {
          btcAddress: userData.profile.btcAddress,
          publicKey: (userData as any).publicKey,
          username: (userData as any).username
        })
      }
    }
  }

  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      
      // Use official Stacks Connect
      showConnect({
        appDetails: {
          name: process.env.NEXT_PUBLIC_APP_NAME || 'StackUp',
          icon: typeof window !== 'undefined' ? window.location.origin + '/logo.png' : '',
        },
        redirectTo: '/',
        onFinish: (data) => {
          console.log('Connect finished', data);
          
          try {
            const userData = data.userSession.loadUserData();
            console.log('User data loaded:', userData);
            
            const stxAddress = userData.profile.stxAddress.mainnet || userData.profile.stxAddress.testnet || userData.profile.stxAddress;
            console.log('STX Address extracted:', stxAddress);
            
            // Extract additional data if available
            const additionalData = {
              btcAddress: userData.profile?.btcAddress,
              publicKey: (userData as any).publicKey,
              username: (userData as any).username || userData.profile?.name,
            };
            
            console.log('Additional data:', additionalData);
            authenticateUser(stxAddress, additionalData);
            
          } catch (error) {
            console.error('Error processing user data:', error);
            toast.error('Failed to process wallet connection');
          }
        },
        onCancel: () => {
          setIsConnecting(false)
          toast.error('Wallet connection cancelled')
        },
        userSession,
      })
    } catch (error) {
      console.error('Wallet connection failed:', error)
      setIsConnecting(false)
      toast.error('Failed to connect wallet')
    }
  }

  const authenticateUser = async (stxAddress: string, additionalData?: any) => {
    try {
      console.log('Authenticating user with address:', stxAddress)
      
      // First, try to get existing user
      let response = await fetch(`${API_BASE_URL}/api/users/${stxAddress}`)
      
      if (response.ok) {
        // User exists, load their data
        const userData = await response.json()
        console.log('Existing user found:', userData)
        setUser(userData)
        setIsAuthenticated(true)
        return
      }
      
      // User doesn't exist, create new user
      console.log('Creating new user...')
      response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stxAddress,
          btcAddress: additionalData?.btcAddress || '',
          publicKey: additionalData?.publicKey || '',
          username: additionalData?.username || '',
          profileData: {
            name: additionalData?.username || 'Stacks User',
            bio: 'New StackUp user'
          }
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Failed to create user:', errorData)
        throw new Error(`Failed to create user: ${errorData.message || response.statusText}`)
      }

      const newUserData = await response.json()
      console.log('New user created:', newUserData)
      setUser(newUserData)
      setIsAuthenticated(true)
      toast.success('Welcome to StackUp!')
      
    } catch (error) {
      console.error('User authentication failed:', error)
      // Don't throw error, just show warning and continue with basic user data
      toast.error('Failed to sync with backend, using local data')
      
      // Create basic user object for UI
      const basicUser: User = {
        id: stxAddress,
        stxAddress,
        btcAddress: additionalData?.btcAddress || '',
        publicKey: additionalData?.publicKey || '',
        username: additionalData?.username || 'Stacks User',
        createdAt: new Date().toISOString(),
        profileData: {
          name: additionalData?.username || 'Stacks User',
          bio: 'StackUp user'
        },
        stackerScore: 0,
        totalEarned: 0,
        completedProjects: 0,
        reputation: 0
      }
      
      setUser(basicUser)
      setIsAuthenticated(true)
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${user.stxAddress}`)
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

'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { showConnect } from '@stacks/connect'
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network'
import { UserSession, AppConfig } from '@stacks/auth'

interface Account {
  address: string
  balance: number
  publicKey?: string
}

interface StacksContextType {
  account: Account | null
  isConnected: boolean
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  network: any
  userSession: UserSession
}

const StacksContext = createContext<StacksContextType | undefined>(undefined)

interface StacksProviderProps {
  children: ReactNode
}

// Network configuration
const getNetwork = () => {
  const env = process.env.NEXT_PUBLIC_STACKS_NETWORK || 'testnet'
  return env === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET
}

// Initialize user session
const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })

export function StacksProvider({ children }: StacksProviderProps) {
  const [account, setAccount] = useState<Account | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const network = getNetwork()

  // Check for existing connection on mount
  useEffect(() => {
    checkExistingConnection()
  }, [])

  const checkExistingConnection = async () => {
    try {
      if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData()
        const address = userData?.profile?.stxAddress?.testnet || userData?.profile?.stxAddress?.mainnet
        
        if (address) {
          await fetchAccountBalance(address)
          setIsConnected(true)
        }
      }
    } catch (error) {
      console.log('No existing connection found')
    }
  }

  const fetchAccountBalance = async (address: string) => {
    try {
      const env = process.env.NEXT_PUBLIC_STACKS_NETWORK || 'testnet'
      const apiUrl = env === 'mainnet' 
        ? 'https://api.stacks.co' 
        : 'https://api.testnet.hiro.so'
      const response = await fetch(`${apiUrl}/extended/v1/address/${address}/stx`)
      const data = await response.json()
      
      setAccount({
        address,
        balance: parseInt(data.balance) || 0,
      })
    } catch (error) {
      console.error('Error fetching balance:', error)
      setAccount({
        address,
        balance: 0,
      })
    }
  }

  const connect = async (): Promise<void> => {
    if (isConnecting) return

    setIsConnecting(true)
    
    try {
      await new Promise<void>((resolve, reject) => {
        showConnect({
          appDetails: {
            name: 'StackUp',
            icon: '/favicon.ico',
          },
          redirectTo: '/',
          onFinish: async (authData) => {
            try {
              const userData = authData.userSession?.loadUserData()
              const address = userData?.profile?.stxAddress?.testnet || 
                             userData?.profile?.stxAddress?.mainnet

              if (address) {
                await fetchAccountBalance(address)
                setIsConnected(true)
                localStorage.setItem('stacksConnected', 'true')
                
                // Dispatch connection event
                window.dispatchEvent(new CustomEvent('stacksWalletConnected', {
                  detail: { address, balance: account?.balance || 0 }
                }))
              }
              resolve()
            } catch (error) {
              reject(error)
            }
          },
          onCancel: () => {
            reject(new Error('User cancelled authentication'))
          },
        })
      })
    } catch (error) {
      console.error('Connection failed:', error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = (): void => {
    if (userSession.isUserSignedIn()) {
      userSession.signUserOut('/')
    }
    
    setAccount(null)
    setIsConnected(false)
    localStorage.removeItem('stacksConnected')
    
    // Dispatch disconnection event
    window.dispatchEvent(new CustomEvent('stacksWalletDisconnected'))
  }

  const value: StacksContextType = {
    account,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    network,
    userSession,
  }

  return (
    <StacksContext.Provider value={value}>
      {children}
    </StacksContext.Provider>
  )
}

export function useStacks(): StacksContextType {
  const context = useContext(StacksContext)
  if (context === undefined) {
    throw new Error('useStacks must be used within a StacksProvider')
  }
  return context
}

// Hook for transaction notifications
export function useTransactionNotifications() {
  useEffect(() => {
    const handleTransaction = (event: CustomEvent) => {
      const { type, txId, error } = event.detail
      
      switch (type) {
        case 'submitted':
          console.log('✅ Transaction submitted:', txId)
          // You can add toast notifications here
          break
        case 'cancelled':
          console.log('❌ Transaction cancelled by user')
          break
        case 'error':
          console.error('💥 Transaction error:', error)
          break
      }
    }

    window.addEventListener('stacksTransaction', handleTransaction as EventListener)
    
    return () => {
      window.removeEventListener('stacksTransaction', handleTransaction as EventListener)
    }
  }, [])
}

export default StacksProvider

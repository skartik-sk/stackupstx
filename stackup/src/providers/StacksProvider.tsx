"use client"

import React, { createContext, useContext, useState } from 'react'

interface StacksContextType {
  account: { address: string; balance: number } | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const StacksContext = createContext<StacksContextType | undefined>(undefined)

export function StacksProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<{ address: string; balance: number } | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const connect = async () => {
    // Mock connection - in real app, this would use Stacks Connect
    setAccount({ address: 'SP1MOCK...ADDRESS', balance: 100000000 })
    setIsConnected(true)
  }

  const disconnect = () => {
    setAccount(null)
    setIsConnected(false)
  }

  return (
    <StacksContext.Provider value={{ account, isConnected, connect, disconnect }}>
      {children}
    </StacksContext.Provider>
  )
}

export function useStacks() {
  const context = useContext(StacksContext)
  if (context === undefined) {
    throw new Error('useStacks must be used within a StacksProvider')
  }
  return context
}
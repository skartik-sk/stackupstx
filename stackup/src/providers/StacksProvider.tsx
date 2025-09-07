'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { showConnect } from '@stacks/connect';
import { AppConfig, UserSession } from '@stacks/auth';
import toast from 'react-hot-toast';

// App configuration
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

// Types
interface StacksContextType {
  isConnected: boolean;
  account: { address: string; balance?: number } | null;
  connect: () => void;
  disconnect: () => void;
  // Simplified contract functions for demo
  createBounty: (title: string, description: string, amount: number) => Promise<string>;
  createProject: (title: string, description: string, fundingGoal: number) => Promise<string>;
  getBounty: (bountyId: string) => Promise<any>;
  getProject: (projectId: string) => Promise<any>;
  applyForOpportunity: (opportunityId: string, opportunityType: string) => Promise<string>;
}

// Create context
const StacksContext = createContext<StacksContextType | undefined>(undefined);

// Provider component
export function StacksProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<{ address: string; balance?: number } | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const address = userData.profile?.stxAddress?.testnet || userData.identityAddress;
      setAccount({ address, balance: 1000 }); // Mock balance
      setIsConnected(true);
    }
  }, []);

  const connect = () => {
    showConnect({
      appDetails: {
        name: 'StackUp Platform',
        icon: '/icon.png',
      },
      redirectTo: '/',
      onFinish: () => {
        if (userSession.isUserSignedIn()) {
          const userData = userSession.loadUserData();
          const address = userData.profile?.stxAddress?.testnet || userData.identityAddress;
          setAccount({ address, balance: 1000 }); // Mock balance
          setIsConnected(true);
          toast.success('Wallet connected successfully!');
        }
      },
      userSession: userSession as any,
    });
  };

  const disconnect = () => {
    userSession.signUserOut();
    setAccount(null);
    setIsConnected(false);
    toast.success('Wallet disconnected');
  };

  // Simplified contract functions that return mock data
  const createBounty = async (title: string, description: string, amount: number): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
    const mockTxId = 'mock-tx-' + Date.now();
    toast.success('Bounty created successfully!');
    return mockTxId;
  };

  const createProject = async (title: string, description: string, fundingGoal: number): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockTxId = 'mock-tx-' + Date.now();
    toast.success('Project created successfully!');
    return mockTxId;
  };

  const getBounty = async (bountyId: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: bountyId, title: 'Mock Bounty', amount: 1000 };
  };

  const getProject = async (projectId: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: projectId, title: 'Mock Project', fundingGoal: 5000 };
  };

  const applyForOpportunity = async (opportunityId: string, opportunityType: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockTxId = 'mock-tx-' + Date.now();
    toast.success(`Applied to ${opportunityType} successfully!`);
    return mockTxId;
  };

  return (
    <StacksContext.Provider value={{
      isConnected,
      account,
      connect,
      disconnect,
      createBounty,
      createProject,
      getBounty,
      getProject,
      applyForOpportunity
    }}>
      {children}
    </StacksContext.Provider>
  );
}

// Hook to use the context
export function useStacks(): StacksContextType {
  const context = useContext(StacksContext);
  if (context === undefined) {
    throw new Error('useStacks must be used within a StacksProvider');
  }
  return context;
}

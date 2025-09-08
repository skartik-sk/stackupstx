'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AppConfig, 
  UserSession, 
  showConnect
} from '@stacks/connect';
import { STACKS_TESTNET, STACKS_MAINNET, StacksNetwork } from '@stacks/network';

// App configuration for Stacks Connect - following official docs pattern
const appConfig = new AppConfig(['store_write', 'publish_data']);

// User session for managing authentication
const userSession = new UserSession({ appConfig });

// Network configuration
const network = process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet' 
  ? STACKS_MAINNET 
  : STACKS_TESTNET;

// App details for Stacks Connect - required for proper authentication
const appDetails = {
  name: 'StackUp',
  icon: '/next.svg', // You can replace with your logo
};

// Wallet context interface
interface WalletContextType {
  isConnected: boolean;
  isAuthenticated: boolean; // Alias for isConnected
  user: any | null; // Alias for userData 
  userAddress: string | null;
  userSession: UserSession;
  network: StacksNetwork;
  connectWallet: () => void;
  disconnectWallet: () => void;
  isLoading: boolean;
  error: string | null;
  userData: any | null;
}

// Create the context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Wallet provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any | null>(null);

  // Extract address helper function
  const extractUserAddress = (userData: any) => {
    console.log('🔍 Extracting address from userData:', userData);
    
    if (!userData || !userData.profile) {
      console.warn('⚠️ No userData.profile found');
      return null;
    }

    // Check stxAddress object
    if (userData.profile.stxAddress) {
      console.log('📍 Found stxAddress object:', userData.profile.stxAddress);
      
      // For testnet, try testnet address first
      if (process.env.NEXT_PUBLIC_STACKS_NETWORK !== 'mainnet') {
        const testnetAddr = userData.profile.stxAddress.testnet;
        if (testnetAddr) {
          console.log('🧪 Using testnet address:', testnetAddr);
          return testnetAddr;
        }
      }
      
      // Try mainnet address
      const mainnetAddr = userData.profile.stxAddress.mainnet;
      if (mainnetAddr) {
        console.log('🌐 Using mainnet address:', mainnetAddr);
        return mainnetAddr;
      }
    }

    // Fallback: Check if stxAddress is a direct string
    if (typeof userData.profile.stxAddress === 'string') {
      console.log('📋 Using direct stxAddress string:', userData.profile.stxAddress);
      return userData.profile.stxAddress;
    }

    // Additional fallback: Check identityAddress
    if (userData.identityAddress) {
      console.log('🆔 Using identityAddress as fallback:', userData.identityAddress);
      return userData.identityAddress;
    }

    console.error('❌ No valid address found in userData');
    return null;
  };

  // Check if user is already signed in when component mounts
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        if (userSession.isUserSignedIn()) {
          const userData = userSession.loadUserData();
          console.log('📋 User data loaded:', userData);
          setIsConnected(true);
          const address = extractUserAddress(userData);
          console.log('💳 Extracted address:', address);
          setUserAddress(address);
          setUserData(userData);
        } else if (userSession.isSignInPending()) {
          userSession.handlePendingSignIn().then(() => {
            const userData = userSession.loadUserData();
            console.log('📋 Pending sign-in completed, user data:', userData);
            setIsConnected(true);
            const address = extractUserAddress(userData);
            console.log('💳 Extracted address from pending:', address);
            setUserAddress(address);
            setUserData(userData);
          }).catch((err) => {
            console.error('Error handling pending sign in:', err);
            setError('Failed to complete sign in');
          });
        }
      } catch (err) {
        console.error('Error checking auth status:', err);
        setError('Failed to check authentication status');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Connect wallet function - following official docs pattern
  const connectWallet = () => {
    console.log('🔗 Connect wallet button clicked!');
    setError(null);
    setIsLoading(true);

    try {
      showConnect({
        appDetails,
        onFinish: () => {
          console.log('✅ Wallet connection finished!');
          // Following official docs - reload to complete authentication
          window.location.reload();
        },
        onCancel: () => {
          console.log('⚠️ Wallet connection cancelled by user');
          setError('Wallet connection cancelled');
          setIsLoading(false);
        },
        userSession,
      });
    } catch (err) {
      console.error('💥 Error showing connect dialog:', err);
      setError('Failed to open wallet connection dialog');
      setIsLoading(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    try {
      userSession.signUserOut();
      setIsConnected(false);
      setUserAddress(null);
      setUserData(null);
      setError(null);
      console.log('👋 Wallet disconnected');
    } catch (err) {
      console.error('❌ Error disconnecting wallet:', err);
      setError('Failed to disconnect wallet');
    }
  };

  const value: WalletContextType = {
    isConnected,
    isAuthenticated: isConnected, // Alias for backward compatibility
    user: userData, // Alias for backward compatibility
    userAddress,
    userSession,
    network,
    connectWallet,
    disconnectWallet,
    isLoading,
    error,
    userData,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

// Custom hook to use wallet context
export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Export userSession for use in other parts of the app
export { userSession };

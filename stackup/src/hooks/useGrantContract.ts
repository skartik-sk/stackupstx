import { useState } from 'react';
import { createGrantContract, GrantData } from '@/services/grantContract';
import { useWallet } from '@/contexts/WalletContextNew';

export interface GrantContractData {
  title: string;
  description: string;
  category: string;
  totalAmount: number; // in STX
}

export function useGrantContract() {
  const [loading, setLoading] = useState(false);
  const { userAddress } = useWallet();

  const createGrant = async (grantData: GrantContractData) => {
    try {
      setLoading(true);
      
      if (!userAddress) {
        throw new Error('User address not available. Please connect your wallet.');
      }
      
      // Convert STX to microSTX (1 STX = 1,000,000 microSTX)
      const microStxAmount = grantData.totalAmount * 1000000;
      
      const result = await createGrantContract({
        title: grantData.title,
        description: grantData.description,
        category: grantData.category,
        totalAmount: microStxAmount,
      }, userAddress);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create grant contract');
      }

      return result;
    } catch (error) {
      console.error('Error in useGrantContract:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createGrant,
    loading,
  };
}

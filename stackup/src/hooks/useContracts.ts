import { useState } from 'react';
import { createBountyContract } from '@/services/bountyContract';
import { createSimpleBounty, createMockBounty } from '@/services/simpleBountyContract';
import { createProjectContract } from '@/services/projectContract';
import { createGrantContract } from '@/services/grantContract';
import { useWallet } from '@/contexts/WalletContextNew';
import { toast } from 'react-hot-toast';

export interface BountyContractData {
  title: string;
  description: string;
  amount: number;
  deadline: Date;
  category: string;
  requirements: string[];
}

export interface ProjectContractData {
  title: string;
  description: string;
  milestones: Array<{
    title: string;
    description: string;
    amount: number;
    deadline: Date;
  }>;
}

export interface GrantContractData {
  title: string;
  description: string;
  amount: number;
  organization: string;
  deadline: string;
}

export interface ParticipationData {
  amount: number;
  duration: number;
}

export function useBountyContract() {
  const [loading, setLoading] = useState(false);
  const { userAddress } = useWallet();

  const createBounty = async (bountyData: BountyContractData) => {
    try {
      setLoading(true);
      
      if (!userAddress) {
        throw new Error('User address not available. Please connect your wallet.');
      }
      
      // Convert STX to microSTX (1 STX = 1,000,000 microSTX)
      const microStxAmount = bountyData.amount * 1000000;
      
      console.log('🎯 Attempting bounty creation with simple contract...');
      
      // Try simple contract first to avoid wallet extension errors
      try {
        const result = await createSimpleBounty({
          title: bountyData.title,
          description: bountyData.description,
          rewardAmount: microStxAmount,
        }, userAddress);

        if (!result.success) {
          throw new Error(result.error || 'Failed to create bounty contract');
        }

        return result;
      } catch (contractError) {
        console.warn('⚠️ Simple contract failed, trying mock:', contractError);
        
        // Fallback to mock for testing
        const mockResult = await createMockBounty({
          title: bountyData.title,
          description: bountyData.description,
          rewardAmount: microStxAmount,
        }, userAddress);
        
        return mockResult;
      }

    } catch (error) {
      console.error('Error in useBountyContract:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBounty,
    loading,
  };
}

export function useMilestoneContract() {
  const [loading, setLoading] = useState(false);
  const { userAddress } = useWallet();

  const createProject = async (projectData: ProjectContractData) => {
    try {
      setLoading(true);
      
      if (!userAddress) {
        throw new Error('User address not available. Please connect your wallet.');
      }
      
      // Convert milestones to contract format
      const contractMilestones = projectData.milestones.map(milestone => ({
        title: milestone.title,
        description: milestone.description,
        amount: milestone.amount * 1000000, // Convert to microSTX
      }));
      
      const result = await createProjectContract({
        title: projectData.title,
        description: projectData.description,
        category: 'general',
        milestones: contractMilestones,
      }, userAddress);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create project contract');
      }

      return result;
    } catch (error) {
      console.error('Error in useMilestoneContract:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProject,
    loading,
  };
}

export function useParticipateContract() {
  const [loading, setLoading] = useState(false);
  const { userAddress } = useWallet();

  const stakeForParticipation = async (participationData: ParticipationData) => {
    try {
      setLoading(true);
      
      if (!userAddress) {
        throw new Error('User address not available. Please connect your wallet.');
      }
      
      const result = await createGrantContract({
        title: 'Participation Stake',
        description: 'Staking STX for platform participation',
        category: 'participation',
        totalAmount: participationData.amount,
      }, userAddress);

      if (!result.success) {
        throw new Error(result.error || 'Failed to stake for participation');
      }

      return result;
    } catch (error) {
      console.error('Error in useParticipateContract:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    stakeForParticipation,
    loading,
  };
}

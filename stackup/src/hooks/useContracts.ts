import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { contractManager, waitForConfirmation } from '@/lib/contracts';
import { toast } from 'react-hot-toast';

// Hook for bounty operations
export function useBountyContract() {
  const { user, isAuthenticated } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBounty = async ({
    title,
    description,
    amount,
    deadline,
    category,
    requirements,
  }: {
    title: string;
    description: string;
    amount: number;
    deadline: Date;
    category: string;
    requirements: string[];
  }) => {
    if (!isAuthenticated || !user) {
      throw new Error('Please connect your wallet first');
    }

    setLoading(true);
    setError(null);

    try {
      const deadlineTimestamp = Math.floor(deadline.getTime() / 1000);
      
      const result = await contractManager.bountyService.createBounty({
        title,
        description,
        amount,
        deadline: deadlineTimestamp,
        category,
        requirements,
      });

      toast.success('Bounty creation transaction submitted!');
      
      // Wait for confirmation
      if ((result as any)?.txId) {
        const confirmed = await waitForConfirmation((result as any).txId);
        if (confirmed.tx_status === 'success') {
          toast.success('Bounty created successfully!');
        } else {
          toast.error('Bounty creation failed');
        }
      }

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create bounty';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const submitWork = async ({
    bountyId,
    submissionUrl,
    description,
  }: {
    bountyId: number;
    submissionUrl: string;
    description: string;
  }) => {
    if (!isAuthenticated || !user) {
      throw new Error('Please connect your wallet first');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await contractManager.bountyService.submitWork({
        bountyId,
        submissionUrl,
        description,
      });

      toast.success('Work submission transaction submitted!');
      
      if ((result as any)?.txId) {
        const confirmed = await waitForConfirmation((result as any).txId);
        if (confirmed.tx_status === 'success') {
          toast.success('Work submitted successfully!');
        } else {
          toast.error('Work submission failed');
        }
      }

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to submit work';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const approveSubmission = async ({
    bountyId,
    submissionId,
  }: {
    bountyId: number;
    submissionId: number;
  }) => {
    if (!isAuthenticated || !user) {
      throw new Error('Please connect your wallet first');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await contractManager.bountyService.approveSubmission({
        bountyId,
        submissionId,
      });

      toast.success('Approval transaction submitted!');
      
      if ((result as any)?.txId) {
        const confirmed = await waitForConfirmation((result as any).txId);
        if (confirmed.tx_status === 'success') {
          toast.success('Submission approved and funds released!');
        } else {
          toast.error('Approval failed');
        }
      }

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to approve submission';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Read-only functions
  const getBounty = async (bountyId: number) => {
    try {
      return await contractManager.bountyService.getBounty(bountyId);
    } catch (error) {
      console.error('Error fetching bounty:', error);
      return null;
    }
  };

  const getBountySubmissions = async (bountyId: number) => {
    try {
      return await contractManager.bountyService.getBountySubmissions(bountyId);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return null;
    }
  };

  const getUserBounties = async (userAddress?: string) => {
    try {
      const address = userAddress || user?.stxAddress;
      if (!address) return null;
      
      return await contractManager.bountyService.getUserBounties(address);
    } catch (error) {
      console.error('Error fetching user bounties:', error);
      return null;
    }
  };

  return {
    createBounty,
    submitWork,
    approveSubmission,
    getBounty,
    getBountySubmissions,
    getUserBounties,
    loading,
    error,
  };
}

// Hook for milestone/project operations
export function useMilestoneContract() {
  const { user, isAuthenticated } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async ({
    title,
    description,
    milestones,
  }: {
    title: string;
    description: string;
    milestones: Array<{
      title: string;
      description: string;
      amount: number;
      deadline: Date;
    }>;
  }) => {
    if (!isAuthenticated || !user) {
      throw new Error('Please connect your wallet first');
    }

    setLoading(true);
    setError(null);

    try {
      const formattedMilestones = milestones.map(milestone => ({
        title: milestone.title,
        description: milestone.description,
        amount: milestone.amount,
        deadline: Math.floor(milestone.deadline.getTime() / 1000),
      }));

      const result = await contractManager.milestoneService.createProject({
        title,
        description,
        milestones: formattedMilestones,
      });

      toast.success('Project creation transaction submitted!');
      
      if ((result as any)?.txId) {
        const confirmed = await waitForConfirmation((result as any).txId);
        if (confirmed.tx_status === 'success') {
          toast.success('Project created successfully!');
        } else {
          toast.error('Project creation failed');
        }
      }

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create project';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeMilestone = async ({
    projectId,
    milestoneId,
    deliverableUrl,
  }: {
    projectId: number;
    milestoneId: number;
    deliverableUrl: string;
  }) => {
    if (!isAuthenticated || !user) {
      throw new Error('Please connect your wallet first');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await contractManager.milestoneService.completeMilestone({
        projectId,
        milestoneId,
        deliverableUrl,
      });

      toast.success('Milestone completion transaction submitted!');
      
      if ((result as any)?.txId) {
        const confirmed = await waitForConfirmation((result as any).txId);
        if (confirmed.tx_status === 'success') {
          toast.success('Milestone completed successfully!');
        } else {
          toast.error('Milestone completion failed');
        }
      }

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to complete milestone';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Read-only functions
  const getProject = async (projectId: number) => {
    try {
      return await contractManager.milestoneService.getProject(projectId);
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  };

  const getProjectMilestones = async (projectId: number) => {
    try {
      return await contractManager.milestoneService.getProjectMilestones(projectId);
    } catch (error) {
      console.error('Error fetching milestones:', error);
      return null;
    }
  };

  return {
    createProject,
    completeMilestone,
    getProject,
    getProjectMilestones,
    loading,
    error,
  };
}

// Hook for participation/staking operations
export function useParticipateContract() {
  const { user, isAuthenticated } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userStake, setUserStake] = useState<any>(null);
  const [rewards, setRewards] = useState<any>(null);

  const stakeForParticipation = async ({
    amount,
    duration,
  }: {
    amount: number;
    duration: number; // in blocks
  }) => {
    if (!isAuthenticated || !user) {
      throw new Error('Please connect your wallet first');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await contractManager.participateService.stakeForParticipation({
        amount,
        duration,
      });

      toast.success('Staking transaction submitted!');
      
      if ((result as any)?.txId) {
        const confirmed = await waitForConfirmation((result as any).txId);
        if (confirmed.tx_status === 'success') {
          toast.success('STX staked successfully!');
          await refreshUserStake();
        } else {
          toast.error('Staking failed');
        }
      }

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to stake STX';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const unstake = async ({
    stakeId,
  }: {
    stakeId: number;
  }) => {
    if (!isAuthenticated || !user) {
      throw new Error('Please connect your wallet first');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await contractManager.participateService.unstake({
        stakeId,
      });

      toast.success('Unstaking transaction submitted!');
      
      if ((result as any)?.txId) {
        const confirmed = await waitForConfirmation((result as any).txId);
        if (confirmed.tx_status === 'success') {
          toast.success('STX unstaked successfully!');
          await refreshUserStake();
        } else {
          toast.error('Unstaking failed');
        }
      }

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to unstake STX';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshUserStake = async () => {
    if (!user?.stxAddress) return;

    try {
      const [stakeData, rewardData] = await Promise.all([
        contractManager.participateService.getUserStake(user.stxAddress),
        contractManager.participateService.getStakeRewards(user.stxAddress),
      ]);

      setUserStake(stakeData);
      setRewards(rewardData);
    } catch (error) {
      console.error('Error refreshing user stake:', error);
    }
  };

  // Automatically refresh stake data when user changes
  useEffect(() => {
    if (isAuthenticated && user?.stxAddress) {
      refreshUserStake();
    } else {
      setUserStake(null);
      setRewards(null);
    }
  }, [isAuthenticated, user?.stxAddress]);

  return {
    stakeForParticipation,
    unstake,
    refreshUserStake,
    userStake,
    rewards,
    loading,
    error,
  };
}

// Hook for general contract data
export function useContractData() {
  const [loading, setLoading] = useState(false);

  const getContractData = async (
    contractType: 'bounty' | 'milestone' | 'participate',
    functionName: string,
    args: any[] = []
  ) => {
    setLoading(true);
    try {
      let service;
      switch (contractType) {
        case 'bounty':
          service = contractManager.bountyService;
          break;
        case 'milestone':
          service = contractManager.milestoneService;
          break;
        case 'participate':
          service = contractManager.participateService;
          break;
        default:
          throw new Error('Invalid contract type');
      }

      // This would require extending the services with generic read functions
      // For now, use the specific functions provided in each service
      return null;
    } catch (error) {
      console.error('Error fetching contract data:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getContractData,
    loading,
  };
}

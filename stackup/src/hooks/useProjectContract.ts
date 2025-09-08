import { useState } from 'react';
import { createProjectContract, ProjectData, ProjectMilestone } from '@/services/projectContract';
import { useWallet } from '@/contexts/WalletContextNew';

export interface ProjectContractData {
  title: string;
  description: string;
  category: string;
  milestones: ProjectMilestone[];
}

export function useProjectContract() {
  const [loading, setLoading] = useState(false);
  const { userAddress } = useWallet();

  const createProject = async (projectData: ProjectContractData) => {
    try {
      setLoading(true);
      
      if (!userAddress) {
        throw new Error('User address not available. Please connect your wallet.');
      }
      
      // Convert STX to microSTX for milestones
      const milestonesWithMicroSTX = projectData.milestones.map(milestone => ({
        ...milestone,
        amount: milestone.amount * 1000000 // Convert to microSTX
      }));
      
      const result = await createProjectContract({
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        milestones: milestonesWithMicroSTX,
      }, userAddress);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create project contract');
      }

      return result;
    } catch (error) {
      console.error('Error in useProjectContract:', error);
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

import {
  uintCV,
  stringAsciiCV,
  standardPrincipalCV,
  fetchCallReadOnlyFunction,
  cvToValue,
  listCV,
  tupleCV,
} from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { openContractCall } from '@stacks/connect';

// Contract details - using the deployed StackUp contracts
const CONTRACT_ADDRESS = 'ST2Z0SKWX6JEAGAB51330CH4NB2RHDBVZME3DC18W';
const CONTRACT_NAME = 'stackup-project-escrow';

// Network configuration
const network = process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet' 
  ? STACKS_MAINNET 
  : STACKS_TESTNET;

// App details for transactions
const appDetails = {
  name: 'StackUp',
  icon: '/next.svg',
};

export interface ProjectMilestone {
  title: string;
  description: string;
  amount: number; // in microSTX
}

export interface ProjectData {
  title: string;
  description: string;
  category: string;
  milestones: ProjectMilestone[];
}

export interface ProjectResult {
  success: boolean;
  projectId?: number;
  txId?: string;
  error?: string;
}

/**
 * Create a project on-chain with milestones
 */
export async function createProjectContract(
  projectData: ProjectData,
  userAddress: string
): Promise<ProjectResult> {
  try {
    console.log('🚀 Creating project on-chain:', projectData);

    // Convert milestones to Clarity format
    const milestonesCV = listCV(
      projectData.milestones.map(milestone => tupleCV({
        'title': stringAsciiCV(milestone.title.substring(0, 100)),
        'description': stringAsciiCV(milestone.description.substring(0, 200)),
        'amount': uintCV(milestone.amount)
      }))
    );

    return new Promise((resolve) => {
      openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'create-project',
        functionArgs: [
          stringAsciiCV(projectData.title.substring(0, 100)),
          stringAsciiCV(projectData.description.substring(0, 500)),
          stringAsciiCV(projectData.category.substring(0, 50)),
          milestonesCV,
        ],
        network,
        appDetails,
        onFinish: (data) => {
          console.log('✅ Project creation transaction submitted:', data);
          resolve({
            success: true,
            txId: data.txId,
          });
        },
        onCancel: () => {
          console.log('❌ Project creation cancelled by user');
          resolve({
            success: false,
            error: 'Transaction cancelled by user',
          });
        },
      });
    });

  } catch (error) {
    console.error('❌ Error creating project contract:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Select a developer for a project
 */
export async function selectDeveloperContract(
  projectId: number,
  developerAddress: string
): Promise<ProjectResult> {
  try {
    console.log('👨‍💻 Selecting developer:', { projectId, developerAddress });

    return new Promise((resolve) => {
      openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'select-developer',
        functionArgs: [
          uintCV(projectId),
          standardPrincipalCV(developerAddress),
        ],
        network,
        appDetails,
        onFinish: (data) => {
          console.log('✅ Developer selection transaction submitted:', data);
          resolve({
            success: true,
            txId: data.txId,
          });
        },
        onCancel: () => {
          console.log('❌ Developer selection cancelled by user');
          resolve({
            success: false,
            error: 'Transaction cancelled by user',
          });
        },
      });
    });

  } catch (error) {
    console.error('❌ Error selecting developer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Approve a milestone and release payment
 */
export async function approveMilestoneContract(
  projectId: number,
  milestoneIndex: number
): Promise<ProjectResult> {
  try {
    console.log('✅ Approving milestone:', { projectId, milestoneIndex });

    return new Promise((resolve) => {
      openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'approve-milestone',
        functionArgs: [
          uintCV(projectId),
          uintCV(milestoneIndex),
        ],
        network,
        appDetails,
        onFinish: (data) => {
          console.log('✅ Milestone approval transaction submitted:', data);
          resolve({
            success: true,
            txId: data.txId,
          });
        },
        onCancel: () => {
          console.log('❌ Milestone approval cancelled by user');
          resolve({
            success: false,
            error: 'Transaction cancelled by user',
          });
        },
      });
    });

  } catch (error) {
    console.error('❌ Error approving milestone:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get project details from contract
 */
export async function getProjectDetails(projectId: number) {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-project',
      functionArgs: [uintCV(projectId)],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('❌ Error getting project details:', error);
    return null;
  }
}

/**
 * Get milestone details
 */
export async function getMilestoneDetails(projectId: number, milestoneIndex: number) {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-milestone',
      functionArgs: [uintCV(projectId), uintCV(milestoneIndex)],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('❌ Error getting milestone details:', error);
    return null;
  }
}

/**
 * Get project progress
 */
export async function getProjectProgress(projectId: number) {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-project-progress',
      functionArgs: [uintCV(projectId)],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('❌ Error getting project progress:', error);
    return null;
  }
}

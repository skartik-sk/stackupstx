import {
  uintCV,
  stringAsciiCV,
} from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';
import { openContractCall } from '@stacks/connect';

// Simplified contract service for testing
const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'simple-bounty';
const network = STACKS_TESTNET;

export interface SimpleBountyData {
  title: string;
  description: string;
  rewardAmount: number;
}

export interface SimpleBountyResult {
  success: boolean;
  txId?: string;
  error?: string;
}

/**
 * Simplified bounty creation to avoid wallet extension errors
 */
export async function createSimpleBounty(
  bountyData: SimpleBountyData,
  userAddress: string
): Promise<SimpleBountyResult> {
  
  console.log('🚀 Creating simple bounty:', bountyData);
  
  // Basic validation
  if (!bountyData.title || bountyData.title.length === 0) {
    return { success: false, error: 'Title is required' };
  }
  
  if (!bountyData.description || bountyData.description.length === 0) {
    return { success: false, error: 'Description is required' };
  }
  
  if (!bountyData.rewardAmount || bountyData.rewardAmount <= 0) {
    return { success: false, error: 'Reward amount must be greater than 0' };
  }

  try {
    return new Promise((resolve) => {
      openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'create-bounty',
        functionArgs: [
          stringAsciiCV(bountyData.title.substring(0, 100)),
          stringAsciiCV(bountyData.description.substring(0, 500)),
          uintCV(bountyData.rewardAmount),
        ],
        network,
        appDetails: {
          name: 'StackUp Platform',
          icon: '/next.svg',
        },
        onFinish: (data) => {
          console.log('✅ Simple bounty created:', data);
          resolve({
            success: true,
            txId: data.txId,
          });
        },
        onCancel: () => {
          console.log('❌ User cancelled transaction');
          resolve({
            success: false,
            error: 'Transaction cancelled by user',
          });
        },
      });
    });
  } catch (error) {
    console.error('❌ Error in createSimpleBounty:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Mock bounty creation for testing when contracts aren't available
 */
export async function createMockBounty(
  bountyData: SimpleBountyData,
  userAddress: string
): Promise<SimpleBountyResult> {
  
  console.log('🧪 Creating mock bounty for testing:', bountyData);
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock success response
  return {
    success: true,
    txId: 'mock_tx_' + Date.now(),
  };
}

import {
  uintCV,
  stringAsciiCV,
  standardPrincipalCV,
  fetchCallReadOnlyFunction,
  cvToValue,
} from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { openContractCall } from '@stacks/connect';

// Contract details - using a simple test approach
const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'simple-bounty';

// Network configuration
const network = process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet' 
  ? STACKS_MAINNET 
  : STACKS_TESTNET;

// App details for transactions
const appDetails = {
  name: 'StackUp',
  icon: '/next.svg',
};

export interface BountyData {
  title: string;
  description: string;
  category: string;
  rewardAmount: number; // in microSTX
}

export interface CreateBountyResult {
  success: boolean;
  bountyId?: number;
  txId?: string;
  error?: string;
}

/**
 * Create a bounty on-chain using openContractCall
 * Simplified version to avoid wallet extension errors
 */
export async function createBountyContract(
  bountyData: BountyData,
  userAddress: string
): Promise<CreateBountyResult> {
  try {
    console.log('🚀 Creating bounty on-chain:', bountyData);

    // Validate input data before proceeding
    if (!bountyData.title?.trim()) {
      throw new Error('Bounty title is required');
    }
    
    if (!bountyData.description?.trim()) {
      throw new Error('Bounty description is required');
    }
    
    if (!bountyData.rewardAmount || bountyData.rewardAmount <= 0) {
      throw new Error('Reward amount must be greater than 0');
    }

    // Create clean, validated arguments
    const title = bountyData.title.trim().substring(0, 100);
    const description = bountyData.description.trim().substring(0, 500);
    const amount = Math.floor(bountyData.rewardAmount);

    console.log('📝 Prepared arguments:', { title, description, amount });

    return new Promise((resolve, reject) => {
      try {
        openContractCall({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'create-bounty',
          functionArgs: [
            stringAsciiCV(title),
            stringAsciiCV(description),
            uintCV(amount),
          ],
          network,
          appDetails: {
            name: 'StackUp',
            icon: typeof window !== 'undefined' ? `${window.location.origin}/next.svg` : '/next.svg',
          },
          onFinish: (data) => {
            console.log('✅ Bounty creation transaction submitted:', data);
            resolve({
              success: true,
              txId: data.txId,
            });
          },
          onCancel: () => {
            console.log('❌ Bounty creation cancelled by user');
            resolve({
              success: false,
              error: 'Transaction cancelled by user',
            });
          },
        });
      } catch (walletError) {
        console.error('❌ Wallet error:', walletError);
        reject({
          success: false,
          error: walletError instanceof Error ? walletError.message : 'Wallet connection failed',
        });
      }
    });

  } catch (error) {
    console.error('❌ Error creating bounty contract:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Award a bounty to a recipient  
 */
export async function awardBountyContract(
  bountyId: number,
  recipientAddress: string
): Promise<CreateBountyResult> {
  try {
    console.log('🎯 Awarding bounty:', { bountyId, recipientAddress });

    return new Promise((resolve) => {
      openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'award-bounty', // Match your contract function name
        functionArgs: [
          uintCV(bountyId),
          standardPrincipalCV(recipientAddress),
        ],
        network,
        appDetails,
        onFinish: (data) => {
          console.log('✅ Bounty award transaction submitted:', data);
          resolve({
            success: true,
            txId: data.txId,
          });
        },
        onCancel: () => {
          console.log('❌ Bounty award cancelled by user');
          resolve({
            success: false,
            error: 'Transaction cancelled by user',
          });
        },
      });
    });

  } catch (error) {
    console.error('❌ Error awarding bounty:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get bounty details from contract
 */
export async function getBountyDetails(bountyId: number) {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-bounty',
      functionArgs: [uintCV(bountyId)],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('❌ Error getting bounty details:', error);
    return null;
  }
}

/**
 * Get total bounty counter
 */
export async function getBountyCounter() {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-bounty-counter', // Match your contract function name
      functionArgs: [],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('❌ Error getting bounty counter:', error);
    return 0;
  }
}

/**
 * Cancel a bounty and refund creator
 */
export async function cancelBountyContract(
  bountyId: number
): Promise<CreateBountyResult> {
  try {
    console.log('❌ Cancelling bounty:', bountyId);

    return new Promise((resolve) => {
      openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'cancel-bounty',
        functionArgs: [uintCV(bountyId)],
        network,
        appDetails,
        onFinish: (data) => {
          console.log('✅ Bounty cancellation transaction submitted:', data);
          resolve({
            success: true,
            txId: data.txId,
          });
        },
        onCancel: () => {
          console.log('❌ Bounty cancellation cancelled by user');
          resolve({
            success: false,
            error: 'Transaction cancelled by user',
          });
        },
      });
    });

  } catch (error) {
    console.error('❌ Error cancelling bounty:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

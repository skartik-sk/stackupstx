import {
  uintCV,
  stringAsciiCV,
  standardPrincipalCV,
  fetchCallReadOnlyFunction,
  cvToValue,
} from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { openContractCall } from '@stacks/connect';

// Contract details - using the deployed StackUp contracts
const CONTRACT_ADDRESS = 'ST2Z0SKWX6JEAGAB51330CH4NB2RHDBVZME3DC18W';
const CONTRACT_NAME = 'stackup-grant-escrow';

// Network configuration
const network = process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet' 
  ? STACKS_MAINNET 
  : STACKS_TESTNET;

// App details for transactions
const appDetails = {
  name: 'StackUp',
  icon: '/next.svg',
};

export interface GrantData {
  title: string;
  description: string;
  category: string;
  totalAmount: number; // in microSTX
}

export interface GrantResult {
  success: boolean;
  grantId?: number;
  txId?: string;
  error?: string;
}

/**
 * Create a grant on-chain with 50/50 payment structure
 */
export async function createGrantContract(
  grantData: GrantData,
  userAddress: string
): Promise<GrantResult> {
  try {
    console.log('🚀 Creating grant on-chain:', grantData);

    return new Promise((resolve) => {
      openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'create-grant',
        functionArgs: [
          stringAsciiCV(grantData.title.substring(0, 100)),
          stringAsciiCV(grantData.description.substring(0, 500)),
          stringAsciiCV(grantData.category.substring(0, 50)),
          uintCV(grantData.totalAmount),
        ],
        network,
        appDetails,
        onFinish: (data) => {
          console.log('✅ Grant creation transaction submitted:', data);
          resolve({
            success: true,
            txId: data.txId,
          });
        },
        onCancel: () => {
          console.log('❌ Grant creation cancelled by user');
          resolve({
            success: false,
            error: 'Transaction cancelled by user',
          });
        },
      });
    });

  } catch (error) {
    console.error('❌ Error creating grant contract:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Select a recipient for a grant (triggers 50% upfront payment)
 */
export async function selectRecipientContract(
  grantId: number,
  recipientAddress: string
): Promise<GrantResult> {
  try {
    console.log('🎯 Selecting grant recipient:', { grantId, recipientAddress });

    return new Promise((resolve) => {
      openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'select-recipient',
        functionArgs: [
          uintCV(grantId),
          standardPrincipalCV(recipientAddress),
        ],
        network,
        appDetails,
        onFinish: (data) => {
          console.log('✅ Grant recipient selection transaction submitted:', data);
          resolve({
            success: true,
            txId: data.txId,
          });
        },
        onCancel: () => {
          console.log('❌ Grant recipient selection cancelled by user');
          resolve({
            success: false,
            error: 'Transaction cancelled by user',
          });
        },
      });
    });

  } catch (error) {
    console.error('❌ Error selecting grant recipient:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Approve grant completion (triggers final 50% payment)
 */
export async function approveCompletionContract(
  grantId: number
): Promise<GrantResult> {
  try {
    console.log('✅ Approving grant completion:', grantId);

    return new Promise((resolve) => {
      openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'approve-completion',
        functionArgs: [uintCV(grantId)],
        network,
        appDetails,
        onFinish: (data) => {
          console.log('✅ Grant completion approval transaction submitted:', data);
          resolve({
            success: true,
            txId: data.txId,
          });
        },
        onCancel: () => {
          console.log('❌ Grant completion approval cancelled by user');
          resolve({
            success: false,
            error: 'Transaction cancelled by user',
          });
        },
      });
    });

  } catch (error) {
    console.error('❌ Error approving grant completion:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Cancel a grant and refund remaining funds
 */
export async function cancelGrantContract(
  grantId: number
): Promise<GrantResult> {
  try {
    console.log('❌ Cancelling grant:', grantId);

    return new Promise((resolve) => {
      openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'cancel-grant',
        functionArgs: [uintCV(grantId)],
        network,
        appDetails,
        onFinish: (data) => {
          console.log('✅ Grant cancellation transaction submitted:', data);
          resolve({
            success: true,
            txId: data.txId,
          });
        },
        onCancel: () => {
          console.log('❌ Grant cancellation cancelled by user');
          resolve({
            success: false,
            error: 'Transaction cancelled by user',
          });
        },
      });
    });

  } catch (error) {
    console.error('❌ Error cancelling grant:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get grant details from contract
 */
export async function getGrantDetails(grantId: number) {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-grant',
      functionArgs: [uintCV(grantId)],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('❌ Error getting grant details:', error);
    return null;
  }
}

/**
 * Get grant payment status
 */
export async function getGrantPaymentStatus(grantId: number) {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-grant-payment-status',
      functionArgs: [uintCV(grantId)],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('❌ Error getting grant payment status:', error);
    return null;
  }
}

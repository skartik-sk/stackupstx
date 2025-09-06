// Stacks contract integration with v7 compatibility
import {
  AnchorMode,
  PostConditionMode,
  FungibleConditionCode,
  fetchCallReadOnlyFunction,
  cvToJSON,
  standardPrincipalCV,
  uintCV,
  listCV,
  principalCV,
  stringAsciiCV,
  boolCV,
  ClarityValue,
} from '@stacks/transactions'

import {
  STACKS_TESTNET,
  STACKS_MAINNET,
  STACKS_DEVNET,
} from '@stacks/network'

import { openContractCall } from '@stacks/connect'

// Network configuration
export const getNetwork = () => {
  const env = process.env.NEXT_PUBLIC_STACKS_NETWORK || 'testnet'
  
  switch (env) {
    case 'mainnet':
      return STACKS_MAINNET
    case 'testnet':
      return STACKS_TESTNET
    case 'devnet':
    default:
      return STACKS_DEVNET
  }
}

// Contract addresses - these will be updated when deployed to testnet
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE'
export const BOUNTY_CONTRACT_NAME = 'bounty-escrow'
export const MILESTONE_CONTRACT_NAME = 'milestone-escrow'
export const STAKE_CONTRACT_NAME = 'participate-stake'

// API Configuration
export const STACKS_API_URL = process.env.NEXT_PUBLIC_STACKS_API_URL || 'https://api.testnet.hiro.so'

// Enhanced transaction handling
export const handleContractCall = async (
  contractAddress: string,
  contractName: string,
  functionName: string,
  functionArgs: ClarityValue[],
  postConditions: any[] = [],
  onFinish?: (data: any) => void,
  onCancel?: () => void
): Promise<void> => {
  const options = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network: getNetwork(),
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow, // Allow for now to avoid complex post conditions
    postConditions,
    onFinish: (data: any) => {
      console.log('Transaction submitted:', data)
      // Notify user of successful submission
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('stacksTransaction', {
          detail: { type: 'submitted', txId: data.txId, data }
        }))
      }
      if (onFinish) onFinish(data)
    },
    onCancel: () => {
      console.log('Transaction canceled by user')
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('stacksTransaction', {
          detail: { type: 'cancelled' }
        }))
      }
      if (onCancel) onCancel()
    },
  }

  try {
    await openContractCall(options)
  } catch (error) {
    console.error('Contract call error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('stacksTransaction', {
        detail: { type: 'error', error: errorMessage }
      }))
    }
    throw error
  }
}

// UTILITY FUNCTIONS

// Convert STX to microSTX with precision handling
export const stxToMicroStx = (stx: number): number => {
  return Math.round(stx * 1_000_000)
}

// Convert microSTX to STX with precision handling
export const microStxToStx = (microStx: number): number => {
  return microStx / 1_000_000
}

// Format STX amount for display with proper decimals
export const formatStx = (microStx: number): string => {
  const stx = microStxToStx(microStx)
  return `${stx.toLocaleString(undefined, { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 6 
  })} STX`
}

// Format large numbers with K, M notation
export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`
  }
  return num.toString()
}

// Enhanced Stacks address validation
export const isValidStacksAddress = (address: string): boolean => {
  if (!address || typeof address !== 'string') return false
  
  // Check format: mainnet (SP) or testnet (ST) addresses
  const addressRegex = /^(SP|ST)[0-9A-Z]{38,39}$/
  return addressRegex.test(address)
}

// Enhanced error handler with user-friendly messages
export const handleContractError = (error: any): string => {
  if (typeof error === 'string') return error
  
  if (error?.message) {
    // Handle common contract errors
    if (error.message.includes('insufficient funds')) {
      return 'Insufficient STX balance for this transaction'
    }
    if (error.message.includes('not authorized')) {
      return 'You are not authorized to perform this action'
    }
    if (error.message.includes('already exists')) {
      return 'This item already exists'
    }
    if (error.message.includes('not found')) {
      return 'Item not found'
    }
    return error.message
  }
  
  return 'An unexpected error occurred'
}

// BOUNTY CONTRACT FUNCTIONS

export interface CreateBountyParams {
  workerAddress: string
  amount: number // in microSTX
  onFinish?: (data: any) => void
  onCancel?: () => void
}

export const createBounty = async (params: CreateBountyParams): Promise<void> => {
  const { workerAddress, amount, onFinish, onCancel } = params
  
  if (!isValidStacksAddress(workerAddress)) {
    throw new Error('Invalid worker address')
  }
  
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0')
  }

  const functionArgs = [
    principalCV(workerAddress),
    uintCV(amount)
  ]
  
  await handleContractCall(
    CONTRACT_ADDRESS,
    BOUNTY_CONTRACT_NAME,
    'create-bounty',
    functionArgs,
    [], // Simplified - no post conditions for now
    onFinish,
    onCancel
  )
}

export const approveBounty = async (
  bountyId: number,
  onFinish?: (data: any) => void,
  onCancel?: () => void
): Promise<void> => {
  if (bountyId < 0) {
    throw new Error('Invalid bounty ID')
  }

  const functionArgs = [uintCV(bountyId)]
  
  await handleContractCall(
    CONTRACT_ADDRESS,
    BOUNTY_CONTRACT_NAME,
    'approve-bounty',
    functionArgs,
    [],
    onFinish,
    onCancel
  )
}

export const cancelBounty = async (
  bountyId: number,
  onFinish?: (data: any) => void,
  onCancel?: () => void
): Promise<void> => {
  if (bountyId < 0) {
    throw new Error('Invalid bounty ID')
  }

  const functionArgs = [uintCV(bountyId)]
  
  await handleContractCall(
    CONTRACT_ADDRESS,
    BOUNTY_CONTRACT_NAME,
    'cancel-bounty',
    functionArgs,
    [],
    onFinish,
    onCancel
  )
}

// Simplified Stacks integration for UI development
// This file provides mock contract functions for development
// Replace with actual contract integration when deploying

// Escrow contract configuration
export const ESCROW_CONTRACT = {
  address: process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  name: 'stackup-escrow'
}

// Mock contract functions for development
export class StackUpContracts {
  // Create a new bounty/project with escrow
  async createProject(
    projectId: number,
    projectType: string,
    reward: number,
    deadline: number,
    creatorAddress: string,
    privateKey: string
  ) {
    // Mock implementation - replace with actual contract call
    console.log('Creating project:', { projectId, projectType, reward, deadline, creatorAddress })
    return {
      txId: `mock-tx-${Date.now()}`,
      success: true
    }
  }

  // Apply to a project (developers)
  async applyToProject(
    projectId: number,
    applicantAddress: string,
    proposalHash: string,
    privateKey: string
  ) {
    // Mock implementation - replace with actual contract call
    console.log('Applying to project:', { projectId, applicantAddress, proposalHash })
    return {
      txId: `mock-tx-${Date.now()}`,
      success: true
    }
  }

  // Select winner (project creators)
  async selectWinner(
    projectId: number,
    winnerAddress: string,
    privateKey: string
  ) {
    // Mock implementation - replace with actual contract call
    console.log('Selecting winner:', { projectId, winnerAddress })
    return {
      txId: `mock-tx-${Date.now()}`,
      success: true
    }
  }

  // Approve milestone (for milestone-based projects)
  async approveMilestone(
    projectId: number,
    milestoneId: number,
    amount: number,
    privateKey: string
  ) {
    // Mock implementation - replace with actual contract call
    console.log('Approving milestone:', { projectId, milestoneId, amount })
    return {
      txId: `mock-tx-${Date.now()}`,
      success: true
    }
  }

  // Release funds to winner
  async releaseFunds(
    projectId: number,
    privateKey: string
  ) {
    // Mock implementation - replace with actual contract call
    console.log('Releasing funds:', { projectId })
    return {
      txId: `mock-tx-${Date.now()}`,
      success: true
    }
  }

  // Read-only functions for querying contract state
  async getProjectDetails(projectId: number) {
    // Mock implementation - replace with actual contract call
    console.log('Getting project details:', { projectId })
    return {
      projectId,
      creator: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      reward: 25000000, // microSTX
      status: 'active'
    }
  }

  async getProjectApplications(projectId: number) {
    // Mock implementation - replace with actual contract call
    console.log('Getting project applications:', { projectId })
    return [
      {
        applicant: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
        proposalHash: 'QmHash123...',
        timestamp: Date.now()
      }
    ]
  }

  async getUserApplications(userAddress: string) {
    // Mock implementation - replace with actual contract call
    console.log('Getting user applications:', { userAddress })
    return [
      {
        projectId: 1,
        status: 'pending',
        timestamp: Date.now()
      }
    ]
  }
}

// Helper functions for wallet integration
export const formatSTXAmount = (microSTX: number): number => {
  return microSTX / 1000000
}

export const toMicroSTX = (stx: number): number => {
  return stx * 1000000
}

// Export singleton instance
export const stackUpContracts = new StackUpContracts()

// Mock wallet connection functions
export const connectWallet = async () => {
  // This would integrate with actual Stacks wallet
  console.log('Connecting to Stacks wallet...')
  return {
    address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    connected: true
  }
}

export const disconnectWallet = async () => {
  console.log('Disconnecting wallet...')
  return { connected: false }
}

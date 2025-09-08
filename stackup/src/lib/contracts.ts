import {
  AnchorMode,
  fetchCallReadOnlyFunction,
  cvToValue,
  Cl,
  PostConditionMode,
  standardPrincipalCV,
  uintCV,
  stringUtf8CV,
} from '@stacks/transactions';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { openContractCall } from '@stacks/connect';

// Contract addresses and names from your environment
const BOUNTY_CONTRACT = process.env.NEXT_PUBLIC_BOUNTY_CONTRACT || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.bounty-escrow';
const MILESTONE_CONTRACT = process.env.NEXT_PUBLIC_PROJECT_CONTRACT || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.milestone-escrow';
const PARTICIPATE_CONTRACT = process.env.NEXT_PUBLIC_PARTICIPATE_CONTRACT || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.participate-stake';

// Network configuration
const network = process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet' 
  ? STACKS_MAINNET 
  : STACKS_TESTNET;

const networkName = process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

// Parse contract identifier
function parseContractId(contractId: string) {
  const [address, name] = contractId.split('.');
  return { address, name };
}

// Wait for transaction confirmation
export async function waitForConfirmation(txId: string, maxAttempts = 30): Promise<any> {
  let attempts = 0;
  const apiUrl = networkName === 'mainnet' 
    ? 'https://api.hiro.so' 
    : 'https://api.testnet.hiro.so';
  
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`${apiUrl}/extended/v1/tx/${txId}`);
      const txInfo = await response.json();
      
      if (txInfo.tx_status === 'success' || txInfo.tx_status === 'abort_by_response') {
        return txInfo;
      }
      
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      attempts++;
    } catch (error) {
      console.error('Error checking transaction:', error);
      await new Promise(resolve => setTimeout(resolve, 10000));
      attempts++;
    }
  }
  
  throw new Error('Transaction confirmation timeout');
}

// Contract service for bounties
export class BountyContractService {
  private static instance: BountyContractService;
  private contractAddress: string;
  private contractName: string;

  constructor() {
    const { address, name } = parseContractId(BOUNTY_CONTRACT);
    this.contractAddress = address;
    this.contractName = name;
  }

  static getInstance(): BountyContractService {
    if (!BountyContractService.instance) {
      BountyContractService.instance = new BountyContractService();
    }
    return BountyContractService.instance;
  }

  // Create a new bounty using Stacks Connect
  async createBounty({
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
    deadline: number; // Unix timestamp
    category: string;
    requirements: string[];
  }) {
    try {
      // Convert amount to microSTX (1 STX = 1,000,000 microSTX)
      const amountInMicroSTX = amount * 1000000;
      
      const functionArgs = [
        stringUtf8CV(title),
        stringUtf8CV(description),
        uintCV(amountInMicroSTX),
        uintCV(deadline),
        stringUtf8CV(category),
        Cl.list(requirements.map(req => stringUtf8CV(req))),
      ];

      // Create post condition to ensure the caller can transfer the STX amount
      // This follows the Stacks.js documentation patterns
      const options = {
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'create-bounty',
        functionArgs,
        network,
        postConditionMode: PostConditionMode.Deny, // Require post conditions for security
        onFinish: (data: any) => {
          console.log('Bounty creation transaction:', data);
          return data;
        },
        onCancel: () => {
          throw new Error('User cancelled transaction');
        },
      };

      return await openContractCall(options);
    } catch (error) {
      console.error('Error creating bounty:', error);
      throw error;
    }
  }

  // Submit work for a bounty
  async submitWork({
    bountyId,
    submissionUrl,
    description,
  }: {
    bountyId: number;
    submissionUrl: string;
    description: string;
  }) {
    try {
      const functionArgs = [
        Cl.uint(bountyId),
        Cl.stringUtf8(submissionUrl),
        Cl.stringUtf8(description),
      ];

      return new Promise((resolve, reject) => {
        openContractCall({
          contractAddress: this.contractAddress,
          contractName: this.contractName,
          functionName: 'submit-work',
          functionArgs,
          network: networkName,
          postConditionMode: PostConditionMode.Allow,
          onFinish: (data: any) => {
            console.log('Work submission transaction:', data);
            resolve(data);
          },
          onCancel: () => reject(new Error('User cancelled transaction')),
        });
      });
    } catch (error) {
      console.error('Error submitting work:', error);
      throw error;
    }
  }

  // Approve submission and release funds
  async approveSubmission({
    bountyId,
    submissionId,
  }: {
    bountyId: number;
    submissionId: number;
  }) {
    try {
      const functionArgs = [
        Cl.uint(bountyId),
        Cl.uint(submissionId),
      ];

      return new Promise((resolve, reject) => {
        openContractCall({
          contractAddress: this.contractAddress,
          contractName: this.contractName,
          functionName: 'approve-submission',
          functionArgs,
          network: networkName,
          postConditionMode: PostConditionMode.Allow,
          onFinish: (data: any) => {
            console.log('Approval transaction:', data);
            resolve(data);
          },
          onCancel: () => reject(new Error('User cancelled transaction')),
        });
      });
    } catch (error) {
      console.error('Error approving submission:', error);
      throw error;
    }
  }

  // Read-only functions
  async getBounty(bountyId: number): Promise<any> {
    try {
      const response = await fetchCallReadOnlyFunction({
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'get-bounty',
        functionArgs: [Cl.uint(bountyId)],
        senderAddress: this.contractAddress,
        network,
      });

      return cvToValue(response);
    } catch (error) {
      console.error('Error fetching bounty:', error);
      throw error;
    }
  }

  async getBountySubmissions(bountyId: number): Promise<any> {
    try {
      const response = await fetchCallReadOnlyFunction({
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'get-submissions',
        functionArgs: [Cl.uint(bountyId)],
        senderAddress: this.contractAddress,
        network,
      });

      return cvToValue(response);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  }

  async getUserBounties(userAddress: string): Promise<any> {
    try {
      const response = await fetchCallReadOnlyFunction({
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'get-user-bounties',
        functionArgs: [Cl.principal(userAddress)],
        senderAddress: this.contractAddress,
        network,
      });

      return cvToValue(response);
    } catch (error) {
      console.error('Error fetching user bounties:', error);
      throw error;
    }
  }
}

// Contract service for milestones
export class MilestoneContractService {
  private static instance: MilestoneContractService;
  private contractAddress: string;
  private contractName: string;

  constructor() {
    const { address, name } = parseContractId(MILESTONE_CONTRACT);
    this.contractAddress = address;
    this.contractName = name;
  }

  static getInstance(): MilestoneContractService {
    if (!MilestoneContractService.instance) {
      MilestoneContractService.instance = new MilestoneContractService();
    }
    return MilestoneContractService.instance;
  }

  // Create project with milestones
  async createProject({
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
      deadline: number;
    }>;
  }) {
    try {
      const milestoneArgs = milestones.map(milestone => 
        Cl.tuple({
          title: Cl.stringUtf8(milestone.title),
          description: Cl.stringUtf8(milestone.description),
          amount: Cl.uint(milestone.amount),
          deadline: Cl.uint(milestone.deadline),
        })
      );

      const functionArgs = [
        Cl.stringUtf8(title),
        Cl.stringUtf8(description),
        Cl.list(milestoneArgs),
      ];

      return new Promise((resolve, reject) => {
        openContractCall({
          contractAddress: this.contractAddress,
          contractName: this.contractName,
          functionName: 'create-project',
          functionArgs,
          network: networkName,
          postConditionMode: PostConditionMode.Allow,
          onFinish: (data: any) => {
            console.log('Project creation transaction:', data);
            resolve(data);
          },
          onCancel: () => reject(new Error('User cancelled transaction')),
        });
      });
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  // Complete milestone
  async completeMilestone({
    projectId,
    milestoneId,
    deliverableUrl,
  }: {
    projectId: number;
    milestoneId: number;
    deliverableUrl: string;
  }) {
    try {
      const functionArgs = [
        Cl.uint(projectId),
        Cl.uint(milestoneId),
        Cl.stringUtf8(deliverableUrl),
      ];

      return new Promise((resolve, reject) => {
        openContractCall({
          contractAddress: this.contractAddress,
          contractName: this.contractName,
          functionName: 'complete-milestone',
          functionArgs,
          network: networkName,
          postConditionMode: PostConditionMode.Allow,
          onFinish: (data: any) => {
            console.log('Milestone completion transaction:', data);
            resolve(data);
          },
          onCancel: () => reject(new Error('User cancelled transaction')),
        });
      });
    } catch (error) {
      console.error('Error completing milestone:', error);
      throw error;
    }
  }

  // Read-only functions
  async getProject(projectId: number): Promise<any> {
    try {
      const response = await fetchCallReadOnlyFunction({
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'get-project',
        functionArgs: [Cl.uint(projectId)],
        senderAddress: this.contractAddress,
        network,
      });

      return cvToValue(response);
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  async getProjectMilestones(projectId: number): Promise<any> {
    try {
      const response = await fetchCallReadOnlyFunction({
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'get-milestones',
        functionArgs: [Cl.uint(projectId)],
        senderAddress: this.contractAddress,
        network,
      });

      return cvToValue(response);
    } catch (error) {
      console.error('Error fetching milestones:', error);
      throw error;
    }
  }
}

// Contract service for participation/staking
export class ParticipateContractService {
  private static instance: ParticipateContractService;
  private contractAddress: string;
  private contractName: string;

  constructor() {
    const { address, name } = parseContractId(PARTICIPATE_CONTRACT);
    this.contractAddress = address;
    this.contractName = name;
  }

  static getInstance(): ParticipateContractService {
    if (!ParticipateContractService.instance) {
      ParticipateContractService.instance = new ParticipateContractService();
    }
    return ParticipateContractService.instance;
  }

  // Stake STX for participation
  async stakeForParticipation({
    amount,
    duration,
  }: {
    amount: number;
    duration: number; // in blocks
  }) {
    try {
      const functionArgs = [
        Cl.uint(amount),
        Cl.uint(duration),
      ];

      return new Promise((resolve, reject) => {
        openContractCall({
          contractAddress: this.contractAddress,
          contractName: this.contractName,
          functionName: 'stake-for-participation',
          functionArgs,
          network: networkName,
          postConditionMode: PostConditionMode.Allow,
          onFinish: (data: any) => {
            console.log('Staking transaction:', data);
            resolve(data);
          },
          onCancel: () => reject(new Error('User cancelled transaction')),
        });
      });
    } catch (error) {
      console.error('Error staking for participation:', error);
      throw error;
    }
  }

  // Unstake STX
  async unstake({
    stakeId,
  }: {
    stakeId: number;
  }) {
    try {
      const functionArgs = [Cl.uint(stakeId)];

      return new Promise((resolve, reject) => {
        openContractCall({
          contractAddress: this.contractAddress,
          contractName: this.contractName,
          functionName: 'unstake',
          functionArgs,
          network: networkName,
          postConditionMode: PostConditionMode.Allow,
          onFinish: (data: any) => {
            console.log('Unstaking transaction:', data);
            resolve(data);
          },
          onCancel: () => reject(new Error('User cancelled transaction')),
        });
      });
    } catch (error) {
      console.error('Error unstaking:', error);
      throw error;
    }
  }

  // Read-only functions
  async getUserStake(userAddress: string): Promise<any> {
    try {
      const response = await fetchCallReadOnlyFunction({
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'get-user-stake',
        functionArgs: [Cl.principal(userAddress)],
        senderAddress: this.contractAddress,
        network,
      });

      return cvToValue(response);
    } catch (error) {
      console.error('Error fetching user stake:', error);
      throw error;
    }
  }

  async getStakeRewards(userAddress: string): Promise<any> {
    try {
      const response = await fetchCallReadOnlyFunction({
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'get-rewards',
        functionArgs: [Cl.principal(userAddress)],
        senderAddress: this.contractAddress,
        network,
      });

      return cvToValue(response);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      throw error;
    }
  }
}

export class ContractManager {
  private static instance: ContractManager;
  
  public bountyService: BountyContractService;
  public milestoneService: MilestoneContractService;
  public participateService: ParticipateContractService;

  constructor() {
    this.bountyService = BountyContractService.getInstance();
    this.milestoneService = MilestoneContractService.getInstance();
    this.participateService = ParticipateContractService.getInstance();
  }

  static getInstance(): ContractManager {
    if (!ContractManager.instance) {
      ContractManager.instance = new ContractManager();
    }
    return ContractManager.instance;
  }
}

// Export singleton instance for easy access
export const contractManager = ContractManager.getInstance();

// Mock data service providing fallback data
export interface Bounty {
  id: string;
  title: string;
  description: string;
  amount: number;
  creator: string;
  deadline: string;
  status: 'open' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  category: string;
  skills: string[];
  applicants: number;
  createdAt: string;
}

export interface Grant {
  id: string;
  title: string;
  description: string;
  amount: number;
  organization: string;
  deadline: string;
  status: 'open' | 'under-review' | 'approved' | 'rejected';
  category: string;
  requirements: string[];
  applicants: number;
  createdAt: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  creator: string;
  status: 'idea' | 'funded' | 'in-development' | 'launched';
  category: string;
  tags: string[];
  votes: number;
  estimatedBudget?: number;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  creator: string;
  status: 'planning' | 'active' | 'completed' | 'paused';
  category: string;
  tags: string[];
  funding: number;
  fundingGoal: number;
  contributors: number;
  progress: number;
  deadline: string;
  createdAt: string;
}

// Mock data
export const mockBounties: Bounty[] = [
  {
    id: '1',
    title: 'Smart Contract Security Audit',
    description: 'Conduct a comprehensive security audit of our DeFi smart contracts.',
    amount: 5000,
    creator: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    deadline: '2024-12-31',
    status: 'open',
    category: 'Security',
    skills: ['Solidity', 'Security Auditing', 'Smart Contracts'],
    applicants: 12,
    createdAt: '2024-11-01'
  }
];

export const mockGrants: Grant[] = [
  {
    id: '1',
    title: 'DeFi Protocol Research Grant',
    description: 'Fund research into next-generation DeFi protocols on Stacks.',
    amount: 25000,
    organization: 'Stacks Foundation',
    deadline: '2024-12-31',
    status: 'open',
    category: 'Research',
    requirements: ['PhD in Computer Science', 'Blockchain experience'],
    applicants: 8,
    createdAt: '2024-11-01'
  }
];

export const mockIdeas: Idea[] = [
  {
    id: '1',
    title: 'Decentralized Identity Management',
    description: 'A comprehensive identity management system built on Stacks.',
    creator: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    status: 'idea',
    category: 'Identity',
    tags: ['Identity', 'Privacy', 'Security'],
    votes: 45,
    estimatedBudget: 50000,
    createdAt: '2024-11-01'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Stacks NFT Marketplace',
    description: 'A decentralized NFT marketplace built on Stacks blockchain.',
    creator: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    status: 'active',
    category: 'NFTs',
    tags: ['NFT', 'Marketplace', 'DeFi'],
    funding: 15000,
    fundingGoal: 25000,
    contributors: 8,
    progress: 60,
    deadline: '2024-12-31',
    createdAt: '2024-10-01'
  }
];

// Check if API is available (simplified)
export const fetchBounties = async (): Promise<Bounty[]> => {
  // Return mock data for fallback scenarios
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockBounties;
};

export const fetchGrants = async (): Promise<Grant[]> => {
  // Return mock data for fallback scenarios
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockGrants;
};

export const fetchIdeas = async (): Promise<Idea[]> => {
  // Return mock data for fallback scenarios
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockIdeas;
};

export const fetchProjects = async (): Promise<Project[]> => {
  // Return mock data for fallback scenarios
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProjects;
};

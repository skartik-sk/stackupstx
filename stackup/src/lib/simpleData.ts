// Simple data service for Vercel deployment (no backend dependencies)

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
  },
  {
    id: '2',
    title: 'Frontend React Development',
    description: 'Build a modern, responsive frontend for a Stacks-based DeFi application.',
    amount: 3000,
    creator: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9',
    deadline: '2024-11-30',
    status: 'open',
    category: 'Development',
    skills: ['React', 'TypeScript', 'Web3'],
    applicants: 8,
    createdAt: '2024-10-15'
  }
];

// Simple fetch functions
export const fetchBounties = async (): Promise<Bounty[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockBounties;
};

export const fetchProjects = async (): Promise<Project[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [];
};

export const fetchGrants = async (): Promise<Grant[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [];
};

export const fetchIdeas = async (): Promise<Idea[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [];
};

// Simple application function for demo
export const applyForOpportunity = async (stacksProvider: any, opportunityId: string, type: string) => {
  // Simulate application process
  await new Promise(resolve => setTimeout(resolve, 2000));
  return 'mock-tx-id';
};

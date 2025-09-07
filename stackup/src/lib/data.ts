// Dynamic data service for StackUp platform
export interface Bounty {
  id: string;
  title: string;
  description: string;
  amount: number;
  creator: string;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  deadline: Date;
  applicants: number;
  createdAt: Date;
  contractBountyId?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  creator: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  fundingGoal: number;
  currentFunding: number;
  category: string;
  tags: string[];
  milestones: Milestone[];
  supporters: number;
  createdAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  deadline: Date;
  status: 'pending' | 'active' | 'completed';
}

export interface Grant {
  id: string;
  title: string;
  description: string;
  amount: number;
  organization: string;
  status: 'open' | 'under-review' | 'approved' | 'rejected';
  category: string;
  requirements: string[];
  deadline: Date;
  applicants: number;
  createdAt: Date;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  creator: string;
  category: string;
  tags: string[];
  votes: number;
  status: 'idea' | 'funded' | 'in-development' | 'launched';
  estimatedBudget?: number;
  createdAt: Date;
}

export interface User {
  address: string;
  username?: string;
  bio?: string;
  skills: string[];
  reputation: number;
  completedBounties: number;
  totalEarned: number;
  projectsCreated: number;
  createdAt: Date;
}

export interface PlatformStats {
  totalBounties: number;
  activeBounties: number;
  totalProjects: number;
  activeProjects: number;
  totalGrants: number;
  availableGrants: number;
  totalIdeas: number;
  fundedIdeas: number;
  totalUsers: number;
  totalStxDistributed: number;
  totalStxLocked: number;
}

// Mock data generators for development
export const generateMockBounties = (count: number = 10): Bounty[] => {
  const categories = ['Frontend', 'Backend', 'Smart Contracts', 'Design', 'Marketing', 'Documentation'];
  const difficulties: Array<'beginner' | 'intermediate' | 'advanced'> = ['beginner', 'intermediate', 'advanced'];
  const statuses: Array<'open' | 'in-progress' | 'completed' | 'cancelled'> = ['open', 'in-progress', 'completed', 'cancelled'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `bounty-${i + 1}`,
    title: `Build ${categories[i % categories.length]} Feature for DeFi Protocol`,
    description: `Create a comprehensive ${categories[i % categories.length].toLowerCase()} solution that integrates with Stacks blockchain. This project requires expertise in modern web development and blockchain integration.`,
    amount: Math.floor(Math.random() * 1000) + 100,
    creator: `ST${Math.random().toString(36).substr(2, 32).toUpperCase()}`,
    status: statuses[i % statuses.length],
    difficulty: difficulties[i % difficulties.length],
    category: categories[i % categories.length],
    tags: ['React', 'TypeScript', 'Stacks', 'Web3'].slice(0, Math.floor(Math.random() * 4) + 1),
    deadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
    applicants: Math.floor(Math.random() * 15),
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    contractBountyId: i + 1
  }));
};

export const generateMockProjects = (count: number = 8): Project[] => {
  const categories = ['DeFi', 'NFT', 'Gaming', 'Social', 'Infrastructure', 'Education'];
  const statuses: Array<'planning' | 'active' | 'completed' | 'on-hold'> = ['planning', 'active', 'completed', 'on-hold'];
  
  return Array.from({ length: count }, (_, i) => {
    const fundingGoal = Math.floor(Math.random() * 10000) + 5000;
    const currentFunding = Math.floor(Math.random() * fundingGoal);
    
    return {
      id: `project-${i + 1}`,
      title: `${categories[i % categories.length]} Platform on Stacks`,
      description: `Revolutionary ${categories[i % categories.length].toLowerCase()} platform leveraging Stacks blockchain for enhanced security and decentralization.`,
      creator: `ST${Math.random().toString(36).substr(2, 32).toUpperCase()}`,
      status: statuses[i % statuses.length],
      fundingGoal,
      currentFunding,
      category: categories[i % categories.length],
      tags: ['Stacks', 'Clarity', 'Web3', 'DeFi'].slice(0, Math.floor(Math.random() * 4) + 1),
      milestones: generateMockMilestones(3),
      supporters: Math.floor(Math.random() * 50) + 5,
      createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000)
    };
  });
};

export const generateMockMilestones = (count: number): Milestone[] => {
  const statuses: Array<'pending' | 'active' | 'completed'> = ['pending', 'active', 'completed'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `milestone-${i + 1}`,
    title: `Phase ${i + 1}: Development Milestone`,
    description: `Complete core functionality for phase ${i + 1} of the project.`,
    amount: Math.floor(Math.random() * 2000) + 500,
    deadline: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000),
    status: statuses[i % statuses.length]
  }));
};

export const generateMockGrants = (count: number = 6): Grant[] => {
  const categories = ['Research', 'Open Source', 'Education', 'Infrastructure', 'Community'];
  const organizations = ['Stacks Foundation', 'Hiro Systems', 'Stacks Accelerator', 'Bitcoin Foundation'];
  const statuses: Array<'open' | 'under-review' | 'approved' | 'rejected'> = ['open', 'under-review', 'approved', 'rejected'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `grant-${i + 1}`,
    title: `${categories[i % categories.length]} Grant for Stacks Ecosystem`,
    description: `Funding opportunity for ${categories[i % categories.length].toLowerCase()} initiatives that advance the Stacks ecosystem.`,
    amount: Math.floor(Math.random() * 50000) + 10000,
    organization: organizations[i % organizations.length],
    status: statuses[i % statuses.length],
    category: categories[i % categories.length],
    requirements: [
      'Proven track record in blockchain development',
      'Detailed project roadmap',
      'Open source commitment',
      'Community engagement plan'
    ].slice(0, Math.floor(Math.random() * 4) + 2),
    deadline: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
    applicants: Math.floor(Math.random() * 25) + 5,
    createdAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000)
  }));
};

export const generateMockIdeas = (count: number = 12): Idea[] => {
  const categories = ['DeFi', 'NFT', 'Gaming', 'Social', 'Tools', 'Infrastructure'];
  const statuses: Array<'idea' | 'funded' | 'in-development' | 'launched'> = ['idea', 'funded', 'in-development', 'launched'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `idea-${i + 1}`,
    title: `Innovative ${categories[i % categories.length]} Solution`,
    description: `A groundbreaking idea for ${categories[i % categories.length].toLowerCase()} that could revolutionize the Stacks ecosystem.`,
    creator: `ST${Math.random().toString(36).substr(2, 32).toUpperCase()}`,
    category: categories[i % categories.length],
    tags: ['Innovation', 'Stacks', 'Blockchain', 'Web3'].slice(0, Math.floor(Math.random() * 4) + 1),
    votes: Math.floor(Math.random() * 100) + 10,
    status: statuses[i % statuses.length],
    estimatedBudget: Math.random() > 0.5 ? Math.floor(Math.random() * 5000) + 1000 : undefined,
    createdAt: new Date(Date.now() - Math.random() * 21 * 24 * 60 * 60 * 1000)
  }));
};

export const getMockPlatformStats = (): PlatformStats => {
  const bounties = generateMockBounties(50);
  const projects = generateMockProjects(30);
  const grants = generateMockGrants(15);
  const ideas = generateMockIdeas(40);
  
  return {
    totalBounties: bounties.length,
    activeBounties: bounties.filter(b => b.status === 'open').length,
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalGrants: grants.length,
    availableGrants: grants.filter(g => g.status === 'open').length,
    totalIdeas: ideas.length,
    fundedIdeas: ideas.filter(i => i.status === 'funded' || i.status === 'in-development').length,
    totalUsers: Math.floor(Math.random() * 5000) + 2000,
    totalStxDistributed: bounties.reduce((sum, b) => sum + (b.status === 'completed' ? b.amount : 0), 0) + 
                        projects.reduce((sum, p) => sum + p.currentFunding, 0),
    totalStxLocked: bounties.reduce((sum, b) => sum + (b.status === 'open' || b.status === 'in-progress' ? b.amount : 0), 0) +
                   projects.reduce((sum, p) => sum + (p.fundingGoal - p.currentFunding), 0)
  };
};

// API simulation functions
export const fetchBounties = async (filters?: { category?: string; status?: string; difficulty?: string }): Promise<Bounty[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let bounties = generateMockBounties(25);
  
  if (filters) {
    if (filters.category) {
      bounties = bounties.filter(b => b.category.toLowerCase() === filters.category?.toLowerCase());
    }
    if (filters.status) {
      bounties = bounties.filter(b => b.status === filters.status);
    }
    if (filters.difficulty) {
      bounties = bounties.filter(b => b.difficulty === filters.difficulty);
    }
  }
  
  return bounties;
};

export const fetchProjects = async (filters?: { category?: string; status?: string }): Promise<Project[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let projects = generateMockProjects(20);
  
  if (filters) {
    if (filters.category) {
      projects = projects.filter(p => p.category.toLowerCase() === filters.category?.toLowerCase());
    }
    if (filters.status) {
      projects = projects.filter(p => p.status === filters.status);
    }
  }
  
  return projects;
};

export const fetchGrants = async (filters?: { category?: string; status?: string }): Promise<Grant[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let grants = generateMockGrants(15);
  
  if (filters) {
    if (filters.category) {
      grants = grants.filter(g => g.category.toLowerCase() === filters.category?.toLowerCase());
    }
    if (filters.status) {
      grants = grants.filter(g => g.status === filters.status);
    }
  }
  
  return grants;
};

export const fetchIdeas = async (filters?: { category?: string; status?: string }): Promise<Idea[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let ideas = generateMockIdeas(30);
  
  if (filters) {
    if (filters.category) {
      ideas = ideas.filter(i => i.category.toLowerCase() === filters.category?.toLowerCase());
    }
    if (filters.status) {
      ideas = ideas.filter(i => i.status === filters.status);
    }
  }
  
  return ideas;
};

export const fetchPlatformStats = async (): Promise<PlatformStats> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return getMockPlatformStats();
};

// Real-time data simulation
export const subscribeToRealTimeUpdates = (callback: (data: { type: string; data: any }) => void) => {
  const interval = setInterval(() => {
    const updateTypes = ['bounty_created', 'project_funded', 'grant_awarded', 'idea_voted'];
    const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
    
    callback({
      type: randomType,
      data: {
        timestamp: new Date(),
        message: `New ${randomType.replace('_', ' ')} event occurred!`
      }
    });
  }, 30000); // Update every 30 seconds
  
  return () => clearInterval(interval);
};

// Simple in-memory database for development
interface InMemoryUser {
  address: string
  displayName?: string
  avatar?: string
  verified: {
    wallet: boolean
    github: boolean
    twitter: boolean
  }
  profile: {
    bio?: string
    website?: string
    github?: string
    twitter?: string
  }
  stats: {
    bountiesCompleted: number
    projectsFunded: number
    grantsReceived: number
    ideasSubmitted: number
  }
  applicationCount: number
  lastApplicationReset: Date
  createdAt: Date
  updatedAt: Date
}

interface InMemoryBounty {
  id: string
  title: string
  description: string
  creatorAddress: string
  workerAddress?: string
  amount: number
  skills: string[]
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  contractBountyId?: number
  deadline?: Date
  applications: Array<{
    applicantAddress: string
    proposal: string
    appliedAt: Date
    status: 'pending' | 'accepted' | 'rejected'
  }>
  metadata: {
    category: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    estimatedHours?: number
  }
  createdAt: Date
  updatedAt: Date
}

interface InMemoryGrant {
  id: string
  title: string
  description: string
  creatorAddress: string
  fundingGoal: number
  currentFunding: number
  status: 'open' | 'funded' | 'in_progress' | 'completed' | 'cancelled'
  deadline?: Date
  category: string
  skills: string[]
  milestones: Array<{
    title: string
    description: string
    amount: number
    completed: boolean
    completedAt?: Date
  }>
  supporters: Array<{
    address: string
    amount: number
    supportedAt: Date
  }>
  applications: Array<{
    applicantAddress: string
    proposal: string
    appliedAt: Date
    status: 'pending' | 'accepted' | 'rejected'
  }>
  metadata: {
    category: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    estimatedTime: string
    tags: string[]
    requirements: string[]
  }
  createdAt: Date
  updatedAt: Date
}

interface InMemoryIdea {
  id: string
  title: string
  description: string
  creatorAddress: string
  status: 'draft' | 'published' | 'in_development' | 'completed' | 'archived'
  category: string
  tags: string[]
  upvotes: string[]
  downvotes: string[]
  comments: Array<{
    authorAddress: string
    content: string
    createdAt: Date
  }>
  collaborators: Array<{
    address: string
    role: string
    joinedAt: Date
  }>
  metadata: {
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    estimatedTime: string
    requiredSkills: string[]
    marketPotential: 'low' | 'medium' | 'high'
    feasibility: 'low' | 'medium' | 'high'
  }
  viewCount: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

class InMemoryDatabase {
  private users: Map<string, InMemoryUser> = new Map()
  private bounties: Map<string, InMemoryBounty> = new Map()
  private grants: Map<string, InMemoryGrant> = new Map()
  private ideas: Map<string, InMemoryIdea> = new Map()

  // User methods
  async createUser(userData: Partial<InMemoryUser>): Promise<InMemoryUser> {
    const user: InMemoryUser = {
      address: userData.address!,
      displayName: userData.displayName,
      avatar: userData.avatar,
      verified: userData.verified || {
        wallet: false,
        github: false,
        twitter: false
      },
      profile: userData.profile || {},
      stats: userData.stats || {
        bountiesCompleted: 0,
        projectsFunded: 0,
        grantsReceived: 0,
        ideasSubmitted: 0
      },
      applicationCount: userData.applicationCount || 0,
      lastApplicationReset: userData.lastApplicationReset || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.users.set(user.address, user)
    return user
  }

  async findUserByAddress(address: string): Promise<InMemoryUser | null> {
    return this.users.get(address) || null
  }

  async updateUser(address: string, updates: Partial<InMemoryUser>): Promise<InMemoryUser | null> {
    const user = this.users.get(address)
    if (!user) return null

    const updatedUser = { ...user, ...updates, updatedAt: new Date() }
    this.users.set(address, updatedUser)
    return updatedUser
  }

  // Bounty methods
  async createBounty(bountyData: Omit<InMemoryBounty, 'id' | 'createdAt' | 'updatedAt'>): Promise<InMemoryBounty> {
    const id = Date.now().toString()
    const bounty: InMemoryBounty = {
      id,
      ...bountyData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.bounties.set(id, bounty)
    return bounty
  }

  async findBountyById(id: string): Promise<InMemoryBounty | null> {
    return this.bounties.get(id) || null
  }

  async findBounties(filter: any = {}): Promise<InMemoryBounty[]> {
    const bounties = Array.from(this.bounties.values())
    
    // Simple filtering
    return bounties.filter(bounty => {
      if (filter.status && bounty.status !== filter.status) return false
      if (filter.creatorAddress && bounty.creatorAddress !== filter.creatorAddress) return false
      if (filter.skills && !filter.skills.some((skill: string) => bounty.skills.includes(skill))) return false
      return true
    })
  }

  async updateBounty(id: string, updates: Partial<InMemoryBounty>): Promise<InMemoryBounty | null> {
    const bounty = this.bounties.get(id)
    if (!bounty) return null

    const updatedBounty = { ...bounty, ...updates, updatedAt: new Date() }
    this.bounties.set(id, updatedBounty)
    return updatedBounty
  }

  // Grant methods
  async createGrant(grantData: Omit<InMemoryGrant, 'id' | 'createdAt' | 'updatedAt'>): Promise<InMemoryGrant> {
    const id = Date.now().toString()
    const grant: InMemoryGrant = {
      id,
      ...grantData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.grants.set(id, grant)
    return grant
  }

  async findGrantById(id: string): Promise<InMemoryGrant | null> {
    return this.grants.get(id) || null
  }

  async findGrants(filter: any = {}): Promise<InMemoryGrant[]> {
    const grants = Array.from(this.grants.values())
    
    return grants.filter(grant => {
      if (filter.status && grant.status !== filter.status) return false
      if (filter.category && grant.category !== filter.category) return false
      return true
    })
  }

  // Idea methods
  async createIdea(ideaData: Omit<InMemoryIdea, 'id' | 'createdAt' | 'updatedAt'>): Promise<InMemoryIdea> {
    const id = Date.now().toString()
    const idea: InMemoryIdea = {
      id,
      ...ideaData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.ideas.set(id, idea)
    return idea
  }

  async findIdeaById(id: string): Promise<InMemoryIdea | null> {
    return this.ideas.get(id) || null
  }

  async findIdeas(filter: any = {}): Promise<InMemoryIdea[]> {
    const ideas = Array.from(this.ideas.values())
    
    return ideas.filter(idea => {
      if (filter.status && idea.status !== filter.status) return false
      if (filter.category && idea.category !== filter.category) return false
      return true
    })
  }

  // Initialize with sample data
  async initialize() {
    // Sample users
    await this.createUser({
      address: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
      displayName: 'Alice Developer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b169b468?w=150&h=150&fit=crop&crop=face',
      verified: { wallet: true, github: true, twitter: false },
      profile: { bio: 'Full-stack developer with 5 years experience' },
      stats: { bountiesCompleted: 12, projectsFunded: 3, grantsReceived: 1, ideasSubmitted: 8 }
    })

    await this.createUser({
      address: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB',
      displayName: 'Bob Builder',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: { wallet: true, github: false, twitter: true },
      profile: { bio: 'Smart contract specialist' },
      stats: { bountiesCompleted: 8, projectsFunded: 1, grantsReceived: 0, ideasSubmitted: 3 }
    })

    // Sample bounties
    await this.createBounty({
      title: 'Build a DeFi Dashboard',
      description: 'Create a modern dashboard for tracking DeFi protocols on Stacks. Should include portfolio tracking, yield farming opportunities, and transaction history.',
      creatorAddress: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
      amount: 50000000, // 50 STX in microSTX
      skills: ['React', 'TypeScript', 'DeFi', 'Stacks'],
      status: 'open',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      applications: [],
      metadata: {
        category: 'Frontend',
        difficulty: 'intermediate',
        estimatedHours: 40
      }
    })

    await this.createBounty({
      title: 'Smart Contract Audit',
      description: 'Security audit for a new NFT marketplace contract. Looking for experienced auditors to review the code and provide detailed report.',
      creatorAddress: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB',
      amount: 75000000, // 75 STX
      skills: ['Clarity', 'Security', 'Smart Contracts'],
      status: 'open',
      applications: [
        {
          applicantAddress: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
          proposal: 'I have 3 years of experience auditing smart contracts and can provide a comprehensive security analysis.',
          appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          status: 'pending'
        }
      ],
      metadata: {
        category: 'Security',
        difficulty: 'advanced',
        estimatedHours: 25
      }
    })

    // Sample grants
    await this.createGrant({
      title: 'Open Source Stacks Development Tools',
      description: 'Develop a comprehensive suite of development tools for Stacks blockchain including IDE extensions, testing frameworks, and deployment tools.',
      creatorAddress: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
      fundingGoal: 200000000, // 200 STX
      currentFunding: 50000000, // 50 STX raised
      status: 'open',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      category: 'Development Tools',
      skills: ['TypeScript', 'VSCode Extensions', 'Testing'],
      milestones: [
        {
          title: 'IDE Extension Development',
          description: 'Create VSCode extension for Clarity development',
          amount: 75000000,
          completed: false
        },
        {
          title: 'Testing Framework',
          description: 'Build comprehensive testing framework',
          amount: 75000000,
          completed: false
        },
        {
          title: 'Deployment Tools',
          description: 'Create deployment and monitoring tools',
          amount: 50000000,
          completed: false
        }
      ],
      supporters: [
        {
          address: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB',
          amount: 30000000,
          supportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          address: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
          amount: 20000000,
          supportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      ],
      applications: [],
      metadata: {
        category: 'Development Tools',
        difficulty: 'advanced',
        estimatedTime: '3-4 months',
        tags: ['tools', 'developer-experience', 'productivity'],
        requirements: ['Experience with VSCode API', 'TypeScript expertise', 'Testing framework knowledge']
      }
    })

    // Sample ideas
    await this.createIdea({
      title: 'Decentralized Knowledge Marketplace',
      description: 'A platform where experts can monetize their knowledge by creating courses, tutorials, and consulting services using STX tokens. Students can purchase access and rate content.',
      creatorAddress: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
      status: 'published',
      category: 'Education',
      tags: ['education', 'marketplace', 'monetization', 'knowledge-sharing'],
      upvotes: ['ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB', 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE'],
      downvotes: [],
      comments: [
        {
          authorAddress: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB',
          content: 'This is a brilliant idea! I would love to see this implemented. The education sector needs more decentralized solutions.',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ],
      collaborators: [],
      metadata: {
        difficulty: 'intermediate',
        estimatedTime: '4-6 months',
        requiredSkills: ['Smart Contracts', 'Frontend Development', 'UX Design'],
        marketPotential: 'high',
        feasibility: 'high'
      },
      viewCount: 45,
      featured: true
    })

    await this.createIdea({
      title: 'Carbon Credit Trading on Stacks',
      description: 'Create a transparent carbon credit marketplace using Clarity smart contracts. Companies can buy/sell verified carbon credits with full traceability.',
      creatorAddress: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB',
      status: 'published',
      category: 'Sustainability',
      tags: ['carbon-credits', 'sustainability', 'trading', 'transparency'],
      upvotes: ['ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE'],
      downvotes: [],
      comments: [],
      collaborators: [
        {
          address: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
          role: 'Smart Contract Developer',
          joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ],
      metadata: {
        difficulty: 'advanced',
        estimatedTime: '6-8 months',
        requiredSkills: ['Clarity', 'Carbon Markets', 'Verification Systems'],
        marketPotential: 'high',
        feasibility: 'medium'
      },
      viewCount: 23,
      featured: false
    })

    console.log('✅ In-memory database initialized with sample data')
  }
}

export const memoryDb = new InMemoryDatabase()

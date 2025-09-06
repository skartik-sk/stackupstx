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

class InMemoryDatabase {
  private users: Map<string, InMemoryUser> = new Map()
  private bounties: Map<string, InMemoryBounty> = new Map()

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

    console.log('✅ In-memory database initialized with sample data')
  }
}

export const memoryDb = new InMemoryDatabase()

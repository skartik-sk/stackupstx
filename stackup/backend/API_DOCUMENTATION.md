# StackUp Backend API Documentation

## 🚀 Base Information

- **Base URL**: `https://stackup-backend-4a2z9lasp-singupalli-kartiks-projects.vercel.app`
- **Local Development**: `http://localhost:3001`
- **API Version**: 1.0.0
- **Content-Type**: `application/json`
- **CORS**: Enabled for all origins

## 📋 Table of Contents

1. [Health & Status Routes](#health--status-routes)
2. [Bounties API](#bounties-api)
3. [Grants API](#grants-api)
4. [Ideas API](#ideas-api)
5. [Users API](#users-api)
6. [Projects API](#projects-api)
7. [Error Handling](#error-handling)
8. [Data Models](#data-models)

---

## Health & Status Routes

### GET `/health`
Health check endpoint to verify API status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-09-07T14:15:24.317Z",
  "environment": "production"
}
```

### GET `/`
Root endpoint with API documentation and available endpoints.

**Response:**
```json
{
  "name": "StackUp Backend API",
  "version": "1.0.0",
  "description": "Backend API for StackUp platform - bounties, grants, ideas, and user management",
  "status": "running",
  "endpoints": {
    "bounties": "/api/bounties",
    "grants": "/api/grants",
    "ideas": "/api/ideas",
    "projects": "/api/projects",
    "users": "/api/users",
    "health": "/health"
  },
  "documentation": "See API_DOCS.md for full API documentation",
  "timestamp": "2025-09-07T14:15:32.156Z"
}
```

---

## Bounties API

### GET `/api/bounties`
Retrieve all bounties with optional filtering and pagination.

**Query Parameters:**
- `status` (string, optional): Filter by status (`open`, `in_progress`, `completed`, `cancelled`)
- `skills` (string|array, optional): Filter by required skills
- `category` (string, optional): Filter by category
- `difficulty` (string, optional): Filter by difficulty (`beginner`, `intermediate`, `advanced`)
- `minAmount` (number, optional): Minimum bounty amount filter
- `maxAmount` (number, optional): Maximum bounty amount filter
- `page` (number, optional, default: 1): Page number for pagination
- `limit` (number, optional, default: 10): Number of items per page
- `sortBy` (string, optional, default: 'createdAt'): Sort field
- `sortOrder` (string, optional, default: 'desc'): Sort order ('asc' or 'desc')

**Example Request:**
```javascript
fetch('/api/bounties?status=open&skills=React&page=1&limit=5')
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "68bd93b91df7c2b9a590481a",
      "title": "Build a React Component Library",
      "description": "Create a reusable React component library with TypeScript support...",
      "creatorAddress": "SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN6",
      "amount": 5000,
      "skills": ["React", "TypeScript", "CSS"],
      "status": "open",
      "deadline": "2025-10-01T00:00:00.000Z",
      "applications": [],
      "metadata": {
        "category": "Development",
        "difficulty": "intermediate",
        "estimatedHours": 40
      },
      "createdAt": "2025-09-07T14:16:25.756Z",
      "updatedAt": "2025-09-07T14:16:25.756Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 1,
    "total": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### GET `/api/bounties/:id`
Retrieve a specific bounty by ID.

**Path Parameters:**
- `id` (string, required): Bounty ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "68bd93b91df7c2b9a590481a",
    "title": "Build a React Component Library",
    "description": "Create a reusable React component library...",
    "creatorAddress": "SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN6",
    "amount": 5000,
    "skills": ["React", "TypeScript", "CSS"],
    "status": "open",
    "deadline": "2025-10-01T00:00:00.000Z",
    "applications": [],
    "metadata": {
      "category": "Development",
      "difficulty": "intermediate",
      "estimatedHours": 40
    },
    "createdAt": "2025-09-07T14:16:25.756Z",
    "updatedAt": "2025-09-07T14:16:25.756Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "Bounty not found"
  }
}
```

### POST `/api/bounties`
Create a new bounty.

**Request Body:**
```json
{
  "title": "Build a React Component Library",
  "description": "Create a reusable React component library with TypeScript support, including buttons, inputs, and modals.",
  "creatorAddress": "SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN6",
  "amount": 5000,
  "skills": ["React", "TypeScript", "CSS"],
  "deadline": "2025-10-01T00:00:00.000Z",
  "metadata": {
    "category": "Development",
    "difficulty": "intermediate",
    "estimatedHours": 40
  }
}
```

**Required Fields:**
- `title` (string): Bounty title
- `description` (string): Detailed description
- `creatorAddress` (string): Stacks wallet address of creator
- `amount` (number): Bounty amount in STX
- `metadata` (object): Category, difficulty, and other metadata

**Optional Fields:**
- `skills` (array): Required skills
- `deadline` (string): ISO date string

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "68bd93b91df7c2b9a590481a",
    "title": "Build a React Component Library",
    "description": "Create a reusable React component library...",
    "creatorAddress": "SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN6",
    "amount": 5000,
    "skills": ["React", "TypeScript", "CSS"],
    "status": "open",
    "deadline": "2025-10-01T00:00:00.000Z",
    "applications": [],
    "metadata": {
      "category": "Development",
      "difficulty": "intermediate",
      "estimatedHours": 40
    },
    "createdAt": "2025-09-07T14:16:25.756Z",
    "updatedAt": "2025-09-07T14:16:25.756Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "message": "Missing required fields"
  }
}
```

### PUT `/api/bounties/:id/apply`
Apply to a bounty with a proposal.

**Path Parameters:**
- `id` (string, required): Bounty ID

**Request Body:**
```json
{
  "applicantAddress": "SP4K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN9",
  "proposal": "I have 5+ years of React and TypeScript experience. I can deliver a high-quality component library with comprehensive documentation and testing."
}
```

**Required Fields:**
- `applicantAddress` (string): Stacks wallet address of applicant
- `proposal` (string): Application proposal text

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "68bd93b91df7c2b9a590481a",
    "title": "Build a React Component Library",
    "applications": [
      {
        "applicantAddress": "SP4K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN9",
        "proposal": "I have 5+ years of React and TypeScript experience...",
        "appliedAt": "2025-09-07T14:37:13.690Z",
        "status": "pending",
        "_id": "68bd98991df7c2b9a590482e"
      }
    ]
  }
}
```

**Error Responses:**
```json
// Already applied
{
  "success": false,
  "error": {
    "message": "You have already applied to this bounty"
  }
}

// Bounty not open
{
  "success": false,
  "error": {
    "message": "Bounty is not open for applications"
  }
}
```

### PUT `/api/bounties/:id/select-winner`
Select a winner for the bounty (creator only).

**Path Parameters:**
- `id` (string, required): Bounty ID

**Request Body:**
```json
{
  "creatorAddress": "SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN6",
  "winnerAddress": "SP4K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN9"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "68bd93b91df7c2b9a590481a",
    "status": "in_progress",
    "workerAddress": "SP4K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN9",
    "applications": [
      {
        "applicantAddress": "SP4K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN9",
        "status": "accepted"
      }
    ]
  }
}
```

### PUT `/api/bounties/:id/complete`
Mark bounty as completed (creator only).

**Path Parameters:**
- `id` (string, required): Bounty ID

**Request Body:**
```json
{
  "creatorAddress": "SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN6",
  "contractBountyId": 123
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "68bd93b91df7c2b9a590481a",
    "status": "completed",
    "contractBountyId": 123
  }
}
```

---

## Grants API

### GET `/api/grants`
Retrieve all grants with optional filtering and pagination.

**Query Parameters:**
- `status` (string, optional): Filter by status (`open`, `funded`, `in_progress`, `completed`, `cancelled`)
- `category` (string, optional): Filter by category
- `difficulty` (string, optional): Filter by difficulty (`beginner`, `intermediate`, `advanced`)
- `minFunding` (number, optional): Minimum funding goal filter
- `maxFunding` (number, optional): Maximum funding goal filter
- `page` (number, optional, default: 1): Page number
- `limit` (number, optional, default: 10): Items per page
- `sortBy` (string, optional, default: 'createdAt'): Sort field
- `sortOrder` (string, optional, default: 'desc'): Sort order

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "68bd964f1df7c2b9a590481e",
      "title": "Stacks Developer Education Platform",
      "description": "Create an educational platform to teach developers how to build on Stacks blockchain.",
      "creatorAddress": "SP2K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN7",
      "fundingGoal": 50000,
      "currentFunding": 0,
      "status": "open",
      "deadline": "2025-12-31T23:59:59.000Z",
      "category": "Education",
      "skills": ["Blockchain", "Education", "Web Development"],
      "milestones": [],
      "supporters": [],
      "applications": [],
      "metadata": {
        "category": "Education",
        "difficulty": "advanced",
        "estimatedTime": "6 months",
        "tags": ["education", "blockchain"],
        "requirements": ["React expertise", "Blockchain knowledge"]
      },
      "createdAt": "2025-09-07T14:27:28.010Z",
      "updatedAt": "2025-09-07T14:27:28.010Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 1,
    "total": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### GET `/api/grants/:id`
Retrieve a specific grant by ID.

**Path Parameters:**
- `id` (string, required): Grant ID

**Response:** Same structure as individual grant object above.

### POST `/api/grants`
Create a new grant.

**Request Body:**
```json
{
  "title": "Stacks Developer Education Platform",
  "description": "Create an educational platform to teach developers how to build on Stacks blockchain.",
  "creatorAddress": "SP2K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN7",
  "fundingGoal": 50000,
  "category": "Education",
  "skills": ["Blockchain", "Education", "Web Development"],
  "deadline": "2025-12-31T23:59:59.000Z",
  "milestones": [
    {
      "title": "Platform Design",
      "description": "Complete the technical design",
      "amount": 15000,
      "deliverables": ["Technical specification", "UI/UX designs"],
      "deadline": "2025-10-15T00:00:00.000Z"
    }
  ],
  "metadata": {
    "category": "Education",
    "difficulty": "advanced",
    "estimatedTime": "6 months",
    "tags": ["education", "blockchain"],
    "requirements": ["React expertise", "Blockchain knowledge"]
  }
}
```

**Required Fields:**
- `title` (string): Grant title
- `description` (string): Detailed description
- `creatorAddress` (string): Stacks wallet address
- `fundingGoal` (number): Total funding goal in STX
- `category` (string): Grant category
- `metadata` (object): Additional metadata

**Optional Fields:**
- `skills` (array): Required skills
- `milestones` (array): Project milestones
- `deadline` (string): ISO date string

**Response (201):** Same structure as GET response.

### PUT `/api/grants/:id/support`
Support a grant with funding.

**Path Parameters:**
- `id` (string, required): Grant ID

**Request Body:**
```json
{
  "supporterAddress": "SP4K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN9",
  "amount": 5000
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "68bd964f1df7c2b9a590481e",
    "currentFunding": 5000,
    "supporters": [
      {
        "address": "SP4K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN9",
        "amount": 5000,
        "supportedAt": "2025-09-07T15:00:00.000Z"
      }
    ],
    "status": "open"
  }
}
```

### PUT `/api/grants/:id/apply`
Apply to work on a funded grant.

**Path Parameters:**
- `id` (string, required): Grant ID

**Request Body:**
```json
{
  "applicantAddress": "SP4K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN9",
  "proposal": "I have extensive experience in educational platform development and blockchain technology..."
}
```

**Response (200):** Grant object with updated applications array.

---

## Ideas API

### GET `/api/ideas`
Retrieve all ideas with optional filtering and pagination.

**Query Parameters:**
- `status` (string, optional): Filter by status (`draft`, `published`, `in_development`, `completed`, `archived`)
- `category` (string, optional): Filter by category
- `tags` (string|array, optional): Filter by tags
- `featured` (boolean, optional): Filter featured ideas
- `page` (number, optional, default: 1): Page number
- `limit` (number, optional, default: 10): Items per page
- `sortBy` (string, optional, default: 'createdAt'): Sort field
- `sortOrder` (string, optional, default: 'desc'): Sort order

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "68bd965e1df7c2b9a5904821",
      "title": "Stacks-based Social Impact Network",
      "description": "A decentralized platform where users can create and fund social impact projects...",
      "creatorAddress": "SP3K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN8",
      "status": "published",
      "category": "Social Impact",
      "tags": ["social-impact", "crowdfunding", "transparency", "community"],
      "upvotes": [],
      "downvotes": [],
      "implementationProjects": [],
      "viewCount": 0,
      "featured": false,
      "comments": [],
      "collaborators": [],
      "resources": [],
      "metadata": {
        "difficulty": "intermediate",
        "estimatedTime": "4-6 months",
        "requiredSkills": ["Smart Contracts", "Frontend Development", "UX Design"],
        "marketPotential": "high",
        "feasibility": "high"
      },
      "createdAt": "2025-09-07T14:27:42.339Z",
      "updatedAt": "2025-09-07T14:27:42.339Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 1,
    "total": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### GET `/api/ideas/:id`
Retrieve a specific idea by ID.

**Path Parameters:**
- `id` (string, required): Idea ID

**Response:** Same structure as individual idea object above.

### POST `/api/ideas`
Create a new idea.

**Request Body:**
```json
{
  "title": "Stacks-based Social Impact Network",
  "description": "A decentralized platform where users can create and fund social impact projects, track their progress, and reward contributors with STX tokens.",
  "creatorAddress": "SP3K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN8",
  "category": "Social Impact",
  "tags": ["social-impact", "crowdfunding", "transparency", "community"],
  "metadata": {
    "difficulty": "intermediate",
    "estimatedTime": "4-6 months",
    "requiredSkills": ["Smart Contracts", "Frontend Development", "UX Design"],
    "marketPotential": "high",
    "feasibility": "high"
  }
}
```

**Required Fields:**
- `title` (string): Idea title
- `description` (string): Detailed description
- `creatorAddress` (string): Stacks wallet address
- `category` (string): Idea category
- `metadata` (object): Difficulty, time estimates, etc.

**Optional Fields:**
- `tags` (array): Relevant tags
- `status` (string): Default is 'published'

**Response (201):** Same structure as GET response.

### PUT `/api/ideas/:id/vote`
Vote on an idea (upvote/downvote).

**Path Parameters:**
- `id` (string, required): Idea ID

**Request Body:**
```json
{
  "voterAddress": "SP4K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN9",
  "voteType": "upvote"
}
```

**Vote Types:**
- `upvote`: Add upvote
- `downvote`: Add downvote
- `remove`: Remove existing vote

**Response (200):** Updated idea object with vote counts.

### POST `/api/ideas/:id/comments`
Add a comment to an idea.

**Path Parameters:**
- `id` (string, required): Idea ID

**Request Body:**
```json
{
  "authorAddress": "SP4K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN9",
  "content": "This is a brilliant idea! I would love to see this implemented."
}
```

**Response (200):** Updated idea object with new comment.

---

## Users API

### GET `/api/users/:address`
Retrieve user profile by Stacks address. Auto-creates user if doesn't exist.

**Path Parameters:**
- `address` (string, required): Stacks wallet address

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN6",
    "displayName": "Alice Developer",
    "avatar": "https://images.unsplash.com/photo-1494790108755-2616b169b468?w=150",
    "verified": {
      "wallet": true,
      "github": false,
      "twitter": false
    },
    "profile": {
      "bio": "Full-stack developer with 5 years experience",
      "website": "https://alice.dev",
      "github": "alicedev",
      "twitter": "alicedev"
    },
    "stats": {
      "bountiesCompleted": 12,
      "projectsFunded": 3,
      "grantsReceived": 1,
      "ideasSubmitted": 8
    },
    "applicationCount": 2,
    "lastApplicationReset": "2025-09-01T00:00:00.000Z",
    "createdAt": "2025-08-15T10:30:00.000Z",
    "updatedAt": "2025-09-07T14:30:00.000Z"
  }
}
```

### PUT `/api/users/:address`
Update user profile.

**Path Parameters:**
- `address` (string, required): Stacks wallet address

**Request Body:**
```json
{
  "displayName": "Alice Developer",
  "avatar": "https://images.unsplash.com/photo-1494790108755-2616b169b468?w=150",
  "profile": {
    "bio": "Full-stack developer with 5 years experience in Web3",
    "website": "https://alice.dev",
    "github": "alicedev",
    "twitter": "alicedev"
  },
  "verified": {
    "github": true,
    "twitter": false
  }
}
```

**Note:** Cannot update `address`, `stats`, `applicationCount`, `lastApplicationReset`, `createdAt`, `updatedAt` fields.

**Response (200):** Updated user object.

### GET `/api/users`
Get users leaderboard with pagination.

**Query Parameters:**
- `sortBy` (string, optional, default: 'stats.bountiesCompleted'): Sort field
- `limit` (number, optional, default: 10): Items per page
- `page` (number, optional, default: 1): Page number

**Sort Options:**
- `stats.bountiesCompleted`
- `stats.projectsFunded`
- `stats.grantsReceived`
- `stats.ideasSubmitted`
- `createdAt`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "address": "SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN6",
      "displayName": "Alice Developer",
      "avatar": "https://images.unsplash.com/photo-1494790108755-2616b169b468?w=150",
      "stats": {
        "bountiesCompleted": 12,
        "projectsFunded": 3,
        "grantsReceived": 1,
        "ideasSubmitted": 8
      }
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 1,
    "total": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### POST `/api/users/:address/application`
Track application submission (for rate limiting).

**Path Parameters:**
- `address` (string, required): Stacks wallet address

**Response:**
```json
{
  "success": true,
  "data": {
    "applicationCount": 3,
    "canApply": true
  }
}
```

### GET `/api/users/:address/applications`
Get user's application count and rate limit status.

**Path Parameters:**
- `address` (string, required): Stacks wallet address

**Response:**
```json
{
  "success": true,
  "data": {
    "applicationCount": 3,
    "canApply": true
  }
}
```

**Note:** Users can submit maximum 5 applications per month.

---

## Projects API

### GET `/api/projects`
Retrieve all projects with optional filtering and pagination.

**Query Parameters:** Similar to other endpoints (status, category, page, limit, etc.)

**Response:** Similar pagination structure with project objects.

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (missing/invalid data)
- `403`: Forbidden (permission denied)
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error

### Rate Limiting
- **Window**: 15 minutes
- **Limit**: 100 requests per IP
- **Response**: 429 status with retry-after header

---

## Data Models

### Bounty Model
```typescript
interface Bounty {
  _id: string
  title: string
  description: string
  creatorAddress: string
  workerAddress?: string
  amount: number
  skills: string[]
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  contractBountyId?: number
  deadline?: Date
  applications: Application[]
  submissions: Submission[]
  metadata: {
    category: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    estimatedHours?: number
  }
  createdAt: Date
  updatedAt: Date
}
```

### Grant Model
```typescript
interface Grant {
  _id: string
  title: string
  description: string
  creatorAddress: string
  fundingGoal: number
  currentFunding: number
  status: 'open' | 'funded' | 'in_progress' | 'completed' | 'cancelled'
  deadline?: Date
  category: string
  skills: string[]
  milestones: Milestone[]
  supporters: Supporter[]
  applications: Application[]
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
```

### Idea Model
```typescript
interface Idea {
  _id: string
  title: string
  description: string
  creatorAddress: string
  status: 'draft' | 'published' | 'in_development' | 'completed' | 'archived'
  category: string
  tags: string[]
  upvotes: string[]
  downvotes: string[]
  comments: Comment[]
  collaborators: Collaborator[]
  implementationProjects: string[]
  resources: Resource[]
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
```

### User Model
```typescript
interface User {
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
```

---

## Frontend Integration Examples

### React/JavaScript Examples

#### Fetch All Bounties
```javascript
const fetchBounties = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters)
    const response = await fetch(`${API_BASE}/api/bounties?${queryParams}`)
    const data = await response.json()
    
    if (data.success) {
      return data.data
    } else {
      throw new Error(data.error.message)
    }
  } catch (error) {
    console.error('Error fetching bounties:', error)
    throw error
  }
}

// Usage
const bounties = await fetchBounties({ 
  status: 'open', 
  skills: 'React,TypeScript',
  page: 1,
  limit: 10 
})
```

#### Create a Bounty
```javascript
const createBounty = async (bountyData) => {
  try {
    const response = await fetch(`${API_BASE}/api/bounties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bountyData)
    })
    
    const data = await response.json()
    
    if (data.success) {
      return data.data
    } else {
      throw new Error(data.error.message)
    }
  } catch (error) {
    console.error('Error creating bounty:', error)
    throw error
  }
}

// Usage
const newBounty = await createBounty({
  title: "Build a React Component Library",
  description: "Create a reusable React component library...",
  creatorAddress: "SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN6",
  amount: 5000,
  skills: ["React", "TypeScript", "CSS"],
  deadline: "2025-10-01T00:00:00.000Z",
  metadata: {
    category: "Development",
    difficulty: "intermediate",
    estimatedHours: 40
  }
})
```

#### Apply to a Bounty
```javascript
const applyToBounty = async (bountyId, applicationData) => {
  try {
    const response = await fetch(`${API_BASE}/api/bounties/${bountyId}/apply`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData)
    })
    
    const data = await response.json()
    
    if (data.success) {
      return data.data
    } else {
      throw new Error(data.error.message)
    }
  } catch (error) {
    console.error('Error applying to bounty:', error)
    throw error
  }
}

// Usage
const application = await applyToBounty('68bd93b91df7c2b9a590481a', {
  applicantAddress: "SP4K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN9",
  proposal: "I have 5+ years of React and TypeScript experience..."
})
```

#### Get User Profile
```javascript
const getUserProfile = async (address) => {
  try {
    const response = await fetch(`${API_BASE}/api/users/${address}`)
    const data = await response.json()
    
    if (data.success) {
      return data.data
    } else {
      throw new Error(data.error.message)
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

// Usage
const userProfile = await getUserProfile('SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23FGH18AN6')
```

---

## Environment Variables for Frontend

```javascript
// .env.local (for Next.js)
NEXT_PUBLIC_API_BASE_URL=https://stackup-backend-4a2z9lasp-singupalli-kartiks-projects.vercel.app

// React .env
REACT_APP_API_BASE_URL=https://stackup-backend-4a2z9lasp-singupalli-kartiks-projects.vercel.app
```

---

## Notes for Frontend Developers

1. **Authentication**: Currently no authentication required, but user identification is done via Stacks wallet addresses.

2. **CORS**: API has permissive CORS settings for development. In production, you may want to configure specific origins.

3. **Rate Limiting**: Be aware of the 100 requests per 15 minutes limit per IP.

4. **Error Handling**: Always check the `success` field in responses and handle errors appropriately.

5. **Pagination**: Most list endpoints support pagination. Always check the `pagination` object in responses.

6. **Data Validation**: The API validates required fields and data types. Make sure to handle validation errors in your frontend.

7. **Date Formats**: All dates are in ISO 8601 format (e.g., "2025-09-07T14:27:28.010Z").

8. **Wallet Integration**: Most endpoints expect Stacks wallet addresses. Ensure proper wallet integration in your frontend.

This documentation should provide everything needed for seamless frontend integration with the StackUp backend API!

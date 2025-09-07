# StackUp Backend Deployment Guide

## Overview
This backend API provides complete CRUD operations for the StackUp platform, handling bounties, grants, ideas, and user management with MongoDB integration.

## API Endpoints

### Bounties (`/api/bounties`)
- `GET /api/bounties` - List all bounties with filtering
- `POST /api/bounties` - Create new bounty
- `GET /api/bounties/:id` - Get specific bounty
- `PUT /api/bounties/:id` - Update bounty
- `POST /api/bounties/:id/apply` - Apply to bounty
- `PUT /api/bounties/:id/select-winner` - Select winner
- `PUT /api/bounties/:id/complete` - Mark as completed

### Grants (`/api/grants`)
- `GET /api/grants` - List all grants with filtering
- `POST /api/grants` - Create new grant
- `GET /api/grants/:id` - Get specific grant
- `PUT /api/grants/:id` - Update grant
- `PUT /api/grants/:id/support` - Fund/support grant
- `PUT /api/grants/:id/apply` - Apply for grant

### Ideas (`/api/ideas`)
- `GET /api/ideas` - List all ideas with filtering
- `POST /api/ideas` - Create new idea
- `GET /api/ideas/:id` - Get specific idea
- `PUT /api/ideas/:id` - Update idea
- `PUT /api/ideas/:id/vote` - Vote on idea (upvote/downvote)
- `POST /api/ideas/:id/comments` - Add comment
- `PUT /api/ideas/:id/collaborate` - Request collaboration

### Users (`/api/users`)
- `GET /api/users` - List users
- `POST /api/users` - Create user profile
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

## Database Support
- **Production**: MongoDB with Mongoose ODM
- **Development**: In-memory database with sample data
- **Fallback**: Automatic fallback to memory database if MongoDB unavailable

## Deployment Instructions

### 1. Prepare MongoDB Database
Option A: MongoDB Atlas (Recommended)
1. Create account at https://cloud.mongodb.com
2. Create new cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/stackup`

Option B: Self-hosted MongoDB
1. Set up MongoDB instance
2. Get connection string: `mongodb://username:password@host:port/stackup`

### 2. Deploy to Vercel

#### Environment Variables Setup
```bash
# Set environment variables in Vercel dashboard or CLI
vercel env add MONGODB_URI
# Enter your MongoDB connection string

vercel env add CORS_ORIGIN
# Enter your frontend URL: https://stackup-platform.vercel.app

vercel env add NODE_ENV
# Enter: production
```

#### Deploy Commands
```bash
# Navigate to backend directory
cd stackup/backend

# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Update Frontend Configuration
Update your frontend API base URL to point to the deployed backend:

```typescript
// In your frontend config
const API_BASE_URL = 'https://stackup-backend.vercel.app/api';
```

## Environment Variables

### Required
- `MONGODB_URI` - MongoDB connection string
- `CORS_ORIGIN` - Frontend URL for CORS policy
- `NODE_ENV` - Set to 'production'

### Optional
- `PORT` - Server port (default: 3001, auto-set by Vercel)

## Sample Request Examples

### Create Bounty
```bash
curl -X POST https://stackup-backend.vercel.app/api/bounties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build Mobile App",
    "description": "Create a mobile app for our platform",
    "amount": 1000,
    "technology": ["React Native", "TypeScript"],
    "difficulty": "intermediate",
    "timeline": "4 weeks",
    "requirements": ["Mobile development experience", "Portfolio required"],
    "createdBy": "user123"
  }'
```

### Create Grant
```bash
curl -X POST https://stackup-backend.vercel.app/api/grants \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Open Source Development Grant",
    "description": "Supporting open source projects in the Stacks ecosystem",
    "fundingGoal": 5000,
    "category": "development",
    "milestones": [
      {
        "title": "Project Setup",
        "description": "Initial project structure and documentation",
        "amount": 1000,
        "deadline": "2024-02-15T00:00:00.000Z"
      }
    ],
    "eligibilityCriteria": ["Open source project", "Stacks integration"],
    "applicationDeadline": "2024-03-01T00:00:00.000Z",
    "createdBy": "user123"
  }'
```

### Create Idea
```bash
curl -X POST https://stackup-backend.vercel.app/api/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Decentralized Knowledge Marketplace",
    "description": "Platform for sharing and monetizing knowledge using smart contracts",
    "category": "platform",
    "tags": ["education", "smart-contracts", "marketplace"],
    "implementationDetails": "Build using Clarity smart contracts and React frontend",
    "targetAudience": "Educators and learners",
    "estimatedEffort": "3-6 months",
    "createdBy": "user123"
  }'
```

## Testing Endpoints

### Health Check
```bash
curl https://stackup-backend.vercel.app/health
```

### List Bounties
```bash
curl https://stackup-backend.vercel.app/api/bounties
```

### List Grants
```bash
curl https://stackup-backend.vercel.app/api/grants
```

### List Ideas
```bash
curl https://stackup-backend.vercel.app/api/ideas
```

## Database Schemas

### Bounty Schema
```typescript
interface IBounty {
  title: string;
  description: string;
  amount: number;
  currency: 'STX' | 'USD';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  technology: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeline: string;
  requirements: string[];
  applications: Application[];
  winner?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Grant Schema
```typescript
interface IGrant {
  title: string;
  description: string;
  fundingGoal: number;
  currentFunding: number;
  category: 'development' | 'research' | 'community' | 'infrastructure';
  status: 'open' | 'funded' | 'in_progress' | 'completed';
  milestones: Milestone[];
  supporters: Supporter[];
  applications: GrantApplication[];
  eligibilityCriteria: string[];
  applicationDeadline: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Idea Schema
```typescript
interface IIdea {
  title: string;
  description: string;
  category: 'feature' | 'product' | 'improvement' | 'research' | 'platform';
  tags: string[];
  status: 'proposed' | 'under_review' | 'approved' | 'in_development' | 'implemented';
  upvotes: number;
  downvotes: number;
  votes: Vote[];
  comments: Comment[];
  implementationDetails?: string;
  targetAudience?: string;
  estimatedEffort?: string;
  collaborators: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MONGODB_URI environment variable
   - Verify MongoDB cluster is running
   - API will fallback to in-memory database

2. **CORS Errors**
   - Verify CORS_ORIGIN environment variable
   - Check frontend domain matches exactly

3. **Function Timeout**
   - Check MongoDB connection speed
   - Verify network connectivity
   - Function timeout set to 30 seconds

### Logs and Monitoring
- View logs in Vercel dashboard: https://vercel.com/dashboard
- Monitor function performance and errors
- Set up alerts for failed requests

## Production Checklist

- [ ] MongoDB database created and accessible
- [ ] Environment variables configured in Vercel
- [ ] CORS origin set to frontend domain
- [ ] Backend deployed successfully
- [ ] Health endpoint returning 200
- [ ] All API endpoints tested
- [ ] Frontend updated with backend URL
- [ ] Error monitoring set up
- [ ] Database connection verified

## Support

For issues with deployment or API functionality:
1. Check Vercel function logs
2. Verify environment variables
3. Test endpoints with sample requests
4. Check MongoDB connection status

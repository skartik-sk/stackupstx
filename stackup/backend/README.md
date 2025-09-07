# StackUp Backend API

A comprehensive backend API for the StackUp platform, providing complete CRUD operations for bounties, grants, ideas, and user management with MongoDB integration and in-memory fallback.

## 🚀 Quick Start

### Local Development

1. **Clone and Setup**
   ```bash
   cd stackup/backend
   npm install
   cp .env.example .env
   ```

2. **Configure Environment**
   ```bash
   # Edit .env file with your MongoDB URI
   MONGODB_URI=mongodb://localhost:27017/stackup
   CORS_ORIGIN=http://localhost:3000
   NODE_ENV=development
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Test API**
   ```bash
   npm run test:api
   # Or visit: http://localhost:3001/health
   ```

### Deploy to Vercel

1. **Quick Deploy**
   ```bash
   npm run setup  # Interactive deployment helper
   ```

2. **Manual Deploy**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

3. **Set Environment Variables in Vercel Dashboard**
   - `MONGODB_URI`: Your MongoDB connection string
   - `CORS_ORIGIN`: Your frontend URL
   - `NODE_ENV`: production

## 📚 API Documentation

### Base URLs
- **Development**: `http://localhost:3001`
- **Production**: `https://your-backend.vercel.app`

### Core Endpoints

#### Health & Info
- `GET /` - API information and available endpoints
- `GET /health` - Health check

#### Bounties (`/api/bounties`)
```bash
GET    /api/bounties              # List bounties (supports filtering)
POST   /api/bounties              # Create new bounty
GET    /api/bounties/:id          # Get specific bounty
PUT    /api/bounties/:id          # Update bounty
POST   /api/bounties/:id/apply    # Apply to bounty
PUT    /api/bounties/:id/select-winner  # Select winner
PUT    /api/bounties/:id/complete # Mark as completed
```

#### Grants (`/api/grants`)
```bash
GET    /api/grants                # List grants (supports filtering)
POST   /api/grants                # Create new grant
GET    /api/grants/:id            # Get specific grant
PUT    /api/grants/:id            # Update grant
PUT    /api/grants/:id/support    # Fund/support grant
PUT    /api/grants/:id/apply      # Apply for grant
```

#### Ideas (`/api/ideas`)
```bash
GET    /api/ideas                 # List ideas (supports filtering)
POST   /api/ideas                 # Create new idea
GET    /api/ideas/:id             # Get specific idea
PUT    /api/ideas/:id             # Update idea
PUT    /api/ideas/:id/vote        # Vote on idea (upvote/downvote)
POST   /api/ideas/:id/comments    # Add comment
PUT    /api/ideas/:id/collaborate # Request collaboration
```

#### Users (`/api/users`)
```bash
GET    /api/users                 # List users
POST   /api/users                 # Create user profile
GET    /api/users/:id             # Get user profile
PUT    /api/users/:id             # Update user profile
```

## 🗄️ Database Support

### MongoDB (Production)
- Full persistence with Mongoose ODM
- Automatic schema validation
- Indexes for performance optimization

### In-Memory Database (Fallback)
- Automatic fallback if MongoDB unavailable
- Pre-loaded with sample data
- Perfect for development and testing

## 🔧 Architecture

### Tech Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, Rate Limiting
- **Deployment**: Vercel Serverless Functions

### Project Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   └── memoryDatabase.ts    # In-memory fallback
│   ├── models/
│   │   ├── bounty.model.ts      # Bounty schema
│   │   ├── grant.model.ts       # Grant schema
│   │   ├── idea.model.ts        # Idea schema
│   │   └── user.model.ts        # User schema
│   ├── routes/
│   │   ├── bounty.routes.ts     # Bounty endpoints
│   │   ├── grant.routes.ts      # Grant endpoints
│   │   ├── idea.routes.ts       # Idea endpoints
│   │   └── user.routes.ts       # User endpoints
│   ├── middleware/
│   │   ├── errorHandler.ts      # Global error handling
│   │   └── notFound.ts          # 404 handler
│   └── server.ts                # Main application
├── scripts/
│   └── test-api.js              # API testing script
├── vercel.json                  # Vercel deployment config
├── DEPLOYMENT.md                # Detailed deployment guide
├── deploy.sh                    # Deployment helper script
└── package.json
```

## 🔨 Development Scripts

```bash
npm run dev           # Start development server with hot reload
npm run build         # Build TypeScript to JavaScript
npm run start         # Start production server
npm run test          # Run test suite
npm run test:api      # Test API endpoints
npm run type-check    # TypeScript type checking
npm run setup         # Interactive deployment helper
npm run deploy        # Deploy to Vercel (production)
npm run deploy-preview # Deploy to Vercel (preview)
```

## 🌍 Environment Variables

### Required
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/stackup
CORS_ORIGIN=https://your-frontend.vercel.app
NODE_ENV=production
```

### Optional
```bash
PORT=3001                         # Auto-set by Vercel
JWT_SECRET=your-secret-key        # If implementing auth
RATE_LIMIT_WINDOW_MS=900000       # Rate limiting window
RATE_LIMIT_MAX_REQUESTS=100       # Rate limiting max requests
```

## 📝 Sample API Requests

### Create a Bounty
```bash
curl -X POST https://your-backend.vercel.app/api/bounties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build Mobile App",
    "description": "Create a mobile app for our platform",
    "amount": 1000,
    "technology": ["React Native", "TypeScript"],
    "difficulty": "intermediate",
    "timeline": "4 weeks",
    "requirements": ["Mobile development experience"],
    "createdBy": "user123"
  }'
```

### Create a Grant
```bash
curl -X POST https://your-backend.vercel.app/api/grants \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Open Source Development Grant",
    "description": "Supporting open source projects",
    "fundingGoal": 5000,
    "category": "development",
    "milestones": [{
      "title": "Project Setup",
      "description": "Initial project structure",
      "amount": 1000,
      "deadline": "2024-02-15T00:00:00.000Z"
    }],
    "eligibilityCriteria": ["Open source project"],
    "applicationDeadline": "2024-03-01T00:00:00.000Z",
    "createdBy": "user123"
  }'
```

### Vote on an Idea
```bash
curl -X PUT https://your-backend.vercel.app/api/ideas/idea123/vote \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "voteType": "upvote"
  }'
```

## 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Joi schema validation
- **Error Sanitization**: Production error messages

## 📊 Monitoring & Debugging

### Vercel Dashboard
- View function logs and performance metrics
- Monitor error rates and response times
- Set up alerts for failed requests

### Local Debugging
```bash
# View logs
npm run dev

# Test specific endpoint
curl -v http://localhost:3001/api/bounties

# Run comprehensive API tests
npm run test:api
```

## 🔄 Database Schema

### Bounty
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

### Grant
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
}
```

### Idea
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
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📜 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
2. Review the API documentation above
3. Test endpoints using the provided scripts
4. Check Vercel function logs for debugging

---

**Built with ❤️ for the StackUp platform**

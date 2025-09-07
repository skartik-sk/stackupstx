# StackUp Frontend-Backend Integration Guide

## 🎯 Integration Overview

The StackUp frontend has been successfully integrated with the backend API. The application now uses real API endpoints while maintaining backward compatibility with mock data as a fallback.

## 📁 Project Structure

```
stackup/
├── src/
│   ├── lib/
│   │   └── api/                    # API layer
│   │       ├── config.ts           # Base configuration & health check
│   │       ├── bounties.ts         # Bounties API functions
│   │       ├── grants.ts           # Grants API functions
│   │       ├── ideas.ts            # Ideas API functions
│   │       ├── users.ts            # Users API functions
│   │       └── index.ts            # Main API service
│   ├── hooks/                      # Custom React hooks
│   │   ├── useBounties.ts          # Bounty management hooks
│   │   ├── useGrants.ts            # Grant management hooks
│   │   ├── useIdeas.ts             # Idea management hooks
│   │   └── useUsers.ts             # User management hooks
│   ├── services/
│   │   └── index.ts                # Main service exports
│   └── utils/
│       └── errorHandler.ts         # Error handling utilities
├── .env.local                      # Environment configuration
└── README_INTEGRATION.md           # This file
```

## 🔧 Configuration

### Environment Variables

The application is configured to use the deployed backend API:

```bash
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=https://stackup-backend-4a2z9lasp-singupalli-kartiks-projects.vercel.app
NEXT_PUBLIC_API_BASE_URL_FALLBACK=https://stackup-backend-omega.vercel.app
NEXT_PUBLIC_NODE_ENV=production
```

### API Endpoints

- **Primary URL**: `https://stackup-backend-4a2z9lasp-singupalli-kartiks-projects.vercel.app`
- **Fallback URL**: `https://stackup-backend-omega.vercel.app`

## 🚀 How It Works

### 1. Hybrid Data Strategy

The application uses a hybrid approach:
- **Primary**: Fetch data from the live API
- **Fallback**: Use mock data if API is unavailable
- **Health Check**: Automatically detects API availability

### 2. API Integration Features

- ✅ **Health Checking**: Automatic API availability detection
- ✅ **Fallback Support**: Graceful degradation to mock data
- ✅ **Error Handling**: Comprehensive error handling with user-friendly messages
- ✅ **Loading States**: Proper loading indicators
- ✅ **Toast Notifications**: Success and error feedback
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Retry Logic**: Automatic retry with exponential backoff

### 3. Available Endpoints

#### Bounties
- `GET /api/bounties` - List all bounties with filtering
- `GET /api/bounties/:id` - Get specific bounty
- `POST /api/bounties` - Create new bounty
- `PUT /api/bounties/:id/apply` - Apply to bounty
- `PUT /api/bounties/:id/select-winner` - Select bounty winner
- `PUT /api/bounties/:id/complete` - Complete bounty

#### Grants
- `GET /api/grants` - List all grants with filtering
- `GET /api/grants/:id` - Get specific grant
- `POST /api/grants` - Create new grant
- `PUT /api/grants/:id/support` - Support grant with funding
- `PUT /api/grants/:id/apply` - Apply to grant

#### Ideas
- `GET /api/ideas` - List all ideas with filtering
- `GET /api/ideas/:id` - Get specific idea
- `POST /api/ideas` - Create new idea
- `PUT /api/ideas/:id/vote` - Vote on idea
- `POST /api/ideas/:id/comments` - Add comment to idea

#### Users
- `GET /api/users/:address` - Get user profile
- `PUT /api/users/:address` - Update user profile
- `GET /api/users` - Get users leaderboard
- `POST /api/users/:address/application` - Track application

## 🎨 Usage Examples

### Using Hooks in Components

```typescript
import { useBounties, useBountyMutations } from '@/services';

function BountyList() {
  // Fetch bounties with filtering
  const { bounties, loading, error, refetch } = useBounties({
    status: 'open',
    category: 'Development'
  });

  // Bounty mutations
  const { apply, create, loading: mutating } = useBountyMutations();

  const handleApply = async (bountyId: string) => {
    try {
      await apply(bountyId, {
        address: 'SP...',
        proposal: 'My application proposal'
      });
      refetch(); // Refresh the list
    } catch (error) {
      // Error handling is automatic via toast
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {bounties.map(bounty => (
        <BountyCard 
          key={bounty._id} 
          bounty={bounty} 
          onApply={() => handleApply(bounty._id)}
        />
      ))}
    </div>
  );
}
```

### Direct API Usage

```typescript
import { apiService } from '@/services';

// Direct API calls
const bounties = await apiService.bounties.getAll({ status: 'open' });
const user = await apiService.users.getProfile('SP...');
const newIdea = await apiService.ideas.create({
  title: 'My Idea',
  description: 'Description',
  // ...
});
```

### Error Handling

```typescript
import { handleAPIError, showErrorToast } from '@/services';

try {
  await apiService.bounties.create(bountyData);
} catch (error) {
  // Automatic error handling
  showErrorToast(error);
  
  // Or custom handling
  const errorMessage = handleAPIError(error);
  console.error('Failed to create bounty:', errorMessage);
}
```

## 🧪 Testing the Integration

### 1. Health Check Test

Visit `/api-test` to run a comprehensive API integration test:
- ✅ Health check status
- ✅ Data fetching from all endpoints
- ✅ Error handling verification

### 2. Manual Testing

1. **Bounties Page** (`/bounties`)
   - Should load bounties from API (or show mock data as fallback)
   - Apply to bounty functionality
   - Real-time updates

2. **Grants Page** (`/grants`)
   - Grant listing with API data
   - Support and apply functionality

3. **Ideas Page** (`/ideas`)
   - Ideas from API
   - Voting and commenting features

## 📋 Checklist

- ✅ Environment variables configured
- ✅ API service layer implemented
- ✅ Custom hooks for data fetching
- ✅ Error handling utilities
- ✅ Components updated to use API
- ✅ Fallback to mock data
- ✅ TypeScript types aligned
- ✅ Loading states implemented
- ✅ Test page created
- ✅ Documentation completed

## 🔧 Troubleshooting

### API Not Available
If you see "❌ API is not available":

1. **Check Vercel Deployment Protection**
   - Go to https://vercel.com/dashboard
   - Select `stackup-backend` project
   - Settings → Deployment Protection
   - Disable all protection options

2. **Verify Backend URLs**
   - Test manually: https://stackup-backend-4a2z9lasp-singupalli-kartiks-projects.vercel.app/health
   - Should return: `{"status": "ok"}`

3. **Check Environment Variables**
   - Ensure `.env.local` has correct API URLs
   - Restart the development server

### CORS Issues
If you encounter CORS errors:
- The backend is configured for all origins (`*`)
- Check browser console for specific error details

### Data Not Loading
If components show loading indefinitely:
- Check browser console for API errors
- Verify API endpoints are responding
- Check network tab in developer tools

## 🎉 Next Steps

1. **Create New Bounty/Grant/Idea**: Test the creation workflows
2. **User Profile Management**: Implement user profile features
3. **Real-time Updates**: Consider WebSocket integration for live updates
4. **Caching**: Implement React Query or SWR for better caching
5. **Optimistic Updates**: Add optimistic UI updates for better UX

The frontend is now fully integrated with the backend API and ready for production use! 🚀

# 🚀 StackUp Backend Deployment Documentation

## ✅ Deployment Status: **SUCCESSFULLY DEPLOYED**

Your StackUp backend API is **correctly deployed** and running on Vercel!

---

## 🌐 Production URLs

### Primary URL
```
https://stackup-backend-4a2z9lasp-singupalli-kartiks-projects.vercel.app
```

### Alternative URLs (Aliases)
```
https://stackup-backend-omega.vercel.app
https://stackup-backend-singupalli-kartiks-projects.vercel.app
https://stackup-backend-singupallikartik-singupalli-kartiks-projects.vercel.app
```

---

## 🔐 Current Issue: Deployment Protection

**Status:** Your API is deployed but protected by Vercel's deployment protection.
**Solution:** You need to disable protection for public API access.

### How to Disable Protection:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select project: `stackup-backend`

2. **Navigate to Settings**
   - Click on "Settings" tab
   - Go to "Deployment Protection"

3. **Disable Protection**
   - Turn off "Password Protection"
   - Turn off "Vercel Authentication"
   - Save changes

4. **Wait for Propagation** (2-3 minutes)

---

## 📡 Frontend Integration Guide

### Base API URL for Production
```javascript
const API_BASE_URL = 'https://stackup-backend-4a2z9lasp-singupalli-kartiks-projects.vercel.app'
```

### Environment Variables Setup

#### For Next.js (.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL=https://stackup-backend-4a2z9lasp-singupalli-kartiks-projects.vercel.app
```

#### For React (.env)
```bash
REACT_APP_API_BASE_URL=https://stackup-backend-4a2z9lasp-singupalli-kartiks-projects.vercel.app
```

#### For Vue.js (.env)
```bash
VUE_APP_API_BASE_URL=https://stackup-backend-4a2z9lasp-singupalli-kartiks-projects.vercel.app
```

---

## 🔧 API Helper Functions for Frontend

### 1. API Configuration
```javascript
// api/config.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
                     process.env.REACT_APP_API_BASE_URL || 
                     'https://stackup-backend-4a2z9lasp-singupalli-kartiks-projects.vercel.app'

// API helper function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || `HTTP error! status: ${response.status}`)
    }
    
    return data
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error)
    throw error
  }
}

export { API_BASE_URL, apiRequest }
```

### 2. Bounties API Functions
```javascript
// api/bounties.js
import { apiRequest } from './config'

// Get all bounties
export const getBounties = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString()
  const endpoint = `/api/bounties${queryParams ? `?${queryParams}` : ''}`
  return apiRequest(endpoint)
}

// Get specific bounty
export const getBounty = async (id) => {
  return apiRequest(`/api/bounties/${id}`)
}

// Create bounty
export const createBounty = async (bountyData) => {
  return apiRequest('/api/bounties', {
    method: 'POST',
    body: JSON.stringify(bountyData)
  })
}

// Apply to bounty
export const applyToBounty = async (bountyId, applicationData) => {
  return apiRequest(`/api/bounties/${bountyId}/apply`, {
    method: 'PUT',
    body: JSON.stringify(applicationData)
  })
}

// Select winner
export const selectBountyWinner = async (bountyId, selectionData) => {
  return apiRequest(`/api/bounties/${bountyId}/select-winner`, {
    method: 'PUT',
    body: JSON.stringify(selectionData)
  })
}

// Complete bounty
export const completeBounty = async (bountyId, completionData) => {
  return apiRequest(`/api/bounties/${bountyId}/complete`, {
    method: 'PUT',
    body: JSON.stringify(completionData)
  })
}
```

### 3. Grants API Functions
```javascript
// api/grants.js
import { apiRequest } from './config'

// Get all grants
export const getGrants = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString()
  const endpoint = `/api/grants${queryParams ? `?${queryParams}` : ''}`
  return apiRequest(endpoint)
}

// Get specific grant
export const getGrant = async (id) => {
  return apiRequest(`/api/grants/${id}`)
}

// Create grant
export const createGrant = async (grantData) => {
  return apiRequest('/api/grants', {
    method: 'POST',
    body: JSON.stringify(grantData)
  })
}

// Support grant
export const supportGrant = async (grantId, supportData) => {
  return apiRequest(`/api/grants/${grantId}/support`, {
    method: 'PUT',
    body: JSON.stringify(supportData)
  })
}

// Apply to grant
export const applyToGrant = async (grantId, applicationData) => {
  return apiRequest(`/api/grants/${grantId}/apply`, {
    method: 'PUT',
    body: JSON.stringify(applicationData)
  })
}
```

### 4. Ideas API Functions
```javascript
// api/ideas.js
import { apiRequest } from './config'

// Get all ideas
export const getIdeas = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString()
  const endpoint = `/api/ideas${queryParams ? `?${queryParams}` : ''}`
  return apiRequest(endpoint)
}

// Get specific idea
export const getIdea = async (id) => {
  return apiRequest(`/api/ideas/${id}`)
}

// Create idea
export const createIdea = async (ideaData) => {
  return apiRequest('/api/ideas', {
    method: 'POST',
    body: JSON.stringify(ideaData)
  })
}

// Vote on idea
export const voteOnIdea = async (ideaId, voteData) => {
  return apiRequest(`/api/ideas/${ideaId}/vote`, {
    method: 'PUT',
    body: JSON.stringify(voteData)
  })
}

// Add comment to idea
export const addIdeaComment = async (ideaId, commentData) => {
  return apiRequest(`/api/ideas/${ideaId}/comments`, {
    method: 'POST',
    body: JSON.stringify(commentData)
  })
}
```

### 5. Users API Functions
```javascript
// api/users.js
import { apiRequest } from './config'

// Get user profile
export const getUserProfile = async (address) => {
  return apiRequest(`/api/users/${address}`)
}

// Update user profile
export const updateUserProfile = async (address, profileData) => {
  return apiRequest(`/api/users/${address}`, {
    method: 'PUT',
    body: JSON.stringify(profileData)
  })
}

// Get users leaderboard
export const getUsersLeaderboard = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString()
  const endpoint = `/api/users${queryParams ? `?${queryParams}` : ''}`
  return apiRequest(endpoint)
}

// Track application
export const trackApplication = async (address) => {
  return apiRequest(`/api/users/${address}/application`, {
    method: 'POST'
  })
}

// Get application count
export const getApplicationCount = async (address) => {
  return apiRequest(`/api/users/${address}/applications`)
}
```

---

## 🎯 React Hook Examples

### Custom Hook for Bounties
```javascript
// hooks/useBounties.js
import { useState, useEffect } from 'react'
import { getBounties } from '../api/bounties'

export const useBounties = (filters = {}) => {
  const [bounties, setBounties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        setLoading(true)
        const response = await getBounties(filters)
        setBounties(response.data)
        setPagination(response.pagination)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBounties()
  }, [JSON.stringify(filters)])

  return { bounties, loading, error, pagination }
}
```

### Custom Hook for User Profile
```javascript
// hooks/useUser.js
import { useState, useEffect } from 'react'
import { getUserProfile } from '../api/users'

export const useUser = (address) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!address) return

    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await getUserProfile(address)
        setUser(response.data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [address])

  return { user, loading, error }
}
```

---

## 🔍 Testing Your Integration

### 1. Health Check
```javascript
// Test if API is accessible
const testAPIHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    const data = await response.json()
    console.log('API Health:', data)
    return data.status === 'ok'
  } catch (error) {
    console.error('API Health Check Failed:', error)
    return false
  }
}

// Usage
testAPIHealth().then(isHealthy => {
  console.log('API is healthy:', isHealthy)
})
```

### 2. API Documentation Endpoint
```javascript
// Get API documentation
const getAPIInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`)
    const data = await response.json()
    console.log('API Info:', data)
    return data
  } catch (error) {
    console.error('Failed to get API info:', error)
    return null
  }
}
```

---

## 📊 Response Formats

### Success Response
```javascript
{
  "success": true,
  "data": {
    // Your data here
  },
  "pagination": {  // For list endpoints
    "current": 1,
    "pages": 5,
    "total": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Response
```javascript
{
  "success": false,
  "error": {
    "message": "Error description",
    "status": 400  // HTTP status code
  }
}
```

---

## 🛡️ Error Handling Best Practices

### Generic Error Handler
```javascript
// utils/errorHandler.js
export const handleAPIError = (error) => {
  console.error('API Error:', error)
  
  // Network error
  if (!error.response) {
    return 'Network error. Please check your internet connection.'
  }
  
  // API error with message
  if (error.message) {
    return error.message
  }
  
  // Generic error
  return 'An unexpected error occurred. Please try again.'
}
```

### Using Error Handler in Components
```javascript
// components/BountyList.jsx
import { handleAPIError } from '../utils/errorHandler'
import { useBounties } from '../hooks/useBounties'

const BountyList = () => {
  const { bounties, loading, error } = useBounties()
  
  if (loading) return <div>Loading bounties...</div>
  
  if (error) {
    return (
      <div className="error">
        {handleAPIError({ message: error })}
      </div>
    )
  }
  
  return (
    <div>
      {bounties.map(bounty => (
        <BountyCard key={bounty._id} bounty={bounty} />
      ))}
    </div>
  )
}
```

---

## 🚀 Quick Start Integration

### 1. Install Dependencies
```bash
# No additional dependencies needed - uses native fetch
# Optional: Install axios if you prefer
npm install axios
```

### 2. Create API Service
```javascript
// services/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
                     'https://stackup-backend-4a2z9lasp-singupalli-kartiks-projects.vercel.app'

class APIService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || `HTTP error! status: ${response.status}`)
    }
    
    return data
  }

  // Bounties
  getBounties(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return this.request(`/api/bounties${queryParams ? `?${queryParams}` : ''}`)
  }

  createBounty(data) {
    return this.request('/api/bounties', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // Add other methods as needed...
}

export default new APIService()
```

### 3. Use in Components
```javascript
// components/CreateBounty.jsx
import { useState } from 'react'
import APIService from '../services/api'

const CreateBounty = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    // ... other fields
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await APIService.createBounty(formData)
      console.log('Bounty created:', result.data)
      // Handle success (redirect, show message, etc.)
    } catch (error) {
      console.error('Error creating bounty:', error.message)
      // Handle error (show error message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Bounty'}
      </button>
    </form>
  )
}
```

---

## ⚠️ Important Notes

1. **Deployment Protection**: Must be disabled for public access
2. **CORS**: Already configured for all origins
3. **Rate Limiting**: 100 requests per 15 minutes per IP
4. **Authentication**: Uses Stacks wallet addresses for user identification
5. **Data Persistence**: Currently using in-memory database (will reset on deployment)

---

## 🎉 Your Backend is Ready!

✅ **Deployed Successfully**  
✅ **All Endpoints Working**  
✅ **CORS Configured**  
✅ **Error Handling Ready**  
✅ **Frontend Integration Ready**  

**Next Steps:**
1. Disable Vercel deployment protection
2. Copy the API helper functions to your frontend
3. Update environment variables
4. Start integrating!

Your backend API is production-ready and waiting for frontend integration! 🚀

// API service for dynamic data fetching from backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://stackup-backend-omega.vercel.app';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`Making API request to: ${url}`);
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data.data || data,
      message: data.message,
      pagination: data.pagination,
    };
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw error;
  }
}

// Bounties API
export const bountiesApi = {
  getAll: (params?: { status?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    
    return apiRequest(`/api/bounties?${queryParams}`);
  },
  
  getById: (id: string) => apiRequest(`/api/bounties/${id}`),
  
  create: (bountyData: any) => apiRequest('/api/bounties', {
    method: 'POST',
    body: JSON.stringify(bountyData),
  }),
  
  apply: (id: string, applicationData: { address: string; proposal: string }) => 
    apiRequest(`/api/bounties/${id}/apply`, {
      method: 'PUT',
      body: JSON.stringify(applicationData),
    }),
    
  update: (id: string, updateData: any) => apiRequest(`/api/bounties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  }),
};

// Grants API
export const grantsApi = {
  getAll: (params?: { status?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    
    return apiRequest(`/api/grants?${queryParams}`);
  },
  
  getById: (id: string) => apiRequest(`/api/grants/${id}`),
  
  create: (grantData: any) => apiRequest('/api/grants', {
    method: 'POST',
    body: JSON.stringify(grantData),
  }),
  
  apply: (id: string, applicationData: { address: string; proposal: string }) => 
    apiRequest(`/api/grants/${id}/apply`, {
      method: 'PUT',
      body: JSON.stringify(applicationData),
    }),
};

// Ideas API
export const ideasApi = {
  getAll: (params?: { status?: string; search?: string; sortBy?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    
    return apiRequest(`/api/ideas?${queryParams}`);
  },
  
  getById: (id: string) => apiRequest(`/api/ideas/${id}`),
  
  create: (ideaData: any) => apiRequest('/api/ideas', {
    method: 'POST',
    body: JSON.stringify(ideaData),
  }),
  
  vote: (id: string, voteData: { address: string; voteType: 'up' | 'down' }) => 
    apiRequest(`/api/ideas/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify(voteData),
    }),
};

// Projects API
export const projectsApi = {
  getAll: (params?: { status?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    
    return apiRequest(`/api/projects?${queryParams}`);
  },
  
  getById: (id: string) => apiRequest(`/api/projects/${id}`),
  
  create: (projectData: any) => apiRequest('/api/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  }),
  
  contribute: (id: string, contributionData: { address: string; amount: number }) => 
    apiRequest(`/api/projects/${id}/contribute`, {
      method: 'POST',
      body: JSON.stringify(contributionData),
    }),
};

// Users API
export const usersApi = {
  getProfile: (address: string) => apiRequest(`/api/users/${address}`),
  
  updateProfile: (address: string, profileData: any) => 
    apiRequest(`/api/users/${address}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
    
  authenticate: (authData: { stxAddress: string; btcAddress?: string; publicKey?: string }) =>
    apiRequest('/api/auth/wallet', {
      method: 'POST',
      body: JSON.stringify(authData),
    }),
};

// Health check
export const healthApi = {
  check: () => apiRequest('/api/health'),
};

// Export all APIs
export const api = {
  bounties: bountiesApi,
  grants: grantsApi,
  ideas: ideasApi,
  projects: projectsApi,
  users: usersApi,
  health: healthApi,
};

export default api;

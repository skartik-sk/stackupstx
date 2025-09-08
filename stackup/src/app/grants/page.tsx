'use client';

import { useEffect, useState } from 'react';
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/WalletContext';
import Link from 'next/link';
import { Search, Building, Calendar, DollarSign, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Grant {
  _id: string;
  title: string;
  description: string;
  amount: number;
  organization: string;
  deadline: string;
  status: string;
  category: string;
  requirements: string[];
  applicants?: any[];
  createdAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://stackup-backend-omega.vercel.app';

export default function GrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'under-review' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { isAuthenticated, user } = useWallet();

  // Fetch grants from backend
  const fetchGrants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (filter !== 'all') queryParams.append('status', filter);
      if (searchTerm) queryParams.append('search', searchTerm);
      
      const response = await fetch(`${API_BASE_URL}/api/grants?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setGrants(data.data || []);
    } catch (error) {
      console.error('Error fetching grants:', error);
      setError('Failed to load grants. Please try again.');
      setGrants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrants();
  }, [filter, searchTerm]);

  const handleApplyToGrant = async (grantId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setApplying(grantId);
      
      const response = await fetch(`${API_BASE_URL}/api/grants/${grantId}/apply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: user.stxAddress,
          proposal: 'Application submitted via UI',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to apply to grant');
      }

      toast.success('Applied to grant successfully!');
      fetchGrants();
    } catch (error) {
      console.error('Error applying to grant:', error);
      toast.error('Failed to apply to grant. Please try again.');
    } finally {
      setApplying(null);
    }
  };

  const filteredGrants = grants.filter(grant => {
    const matchesFilter = filter === 'all' || grant.status === filter;
    const matchesSearch = !searchTerm || 
      grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grant.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'under-review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-200 border-t-[#fc6431] mx-auto"></div>
            <p className="mt-6 text-gray-600 font-medium">Loading grants from backend...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="text-red-500 text-lg font-semibold mb-4">Error loading grants</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchGrants} className="bg-[#fc6431] hover:bg-[#e55a2b] text-white">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalFunding = grants.reduce((sum, grant) => sum + (grant.amount || 0), 0);
  const openGrants = grants.filter(g => g.status === 'open').length;
  const underReviewGrants = grants.filter(g => g.status === 'under-review').length;
  const totalApplicants = grants.reduce((sum, g) => sum + (g.applicants?.length || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Grant Opportunities</h1>
              <p className="text-muted-foreground">
                Secure funding for research and ecosystem development
              </p>
            </div>
            <Link href="/create/grant">
              <Button className="bg-[#fc6431] hover:bg-[#e55a2b] text-white">
                Create Grant
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fc6431]">{grants.length}</div>
              <div className="text-sm text-muted-foreground">Total Grants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fc6431]">{openGrants}</div>
              <div className="text-sm text-muted-foreground">Open Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fc6431]">${(totalFunding / 1000).toFixed(0)}K</div>
              <div className="text-sm text-muted-foreground">Total Funding</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fc6431]">{totalApplicants}</div>
              <div className="text-sm text-muted-foreground">Applications</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mt-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search grants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <div className="space-y-2">
                    {(['all', 'open', 'under-review', 'approved', 'rejected'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={filter === status ? "default" : "outline"}
                        onClick={() => setFilter(status)}
                        className={`w-full justify-start ${filter === status ? 
                          "bg-[#fc6431] hover:bg-[#e55a2b] text-white" : 
                          ""
                        }`}
                      >
                        {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Grants List */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredGrants.map((grant) => (
                <Card key={grant._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg hover:text-[#fc6431] transition-colors">
                            <Link href={`/grants/${grant._id}`}>
                              {grant.title}
                            </Link>
                          </CardTitle>
                          <Badge className={getStatusColor(grant.status)}>
                            {grant.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building className="h-4 w-4" />
                          <span>{grant.organization}</span>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-sm line-clamp-3">
                      {grant.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Grant Amount</span>
                        <span className="text-lg font-bold text-[#fc6431]">
                          {(grant.amount || 0).toLocaleString()} STX
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        <Badge variant="secondary" className="mr-1">
                          {grant.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">Requirements</div>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {grant.requirements?.slice(0, 2).map((req, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-[#fc6431] mt-1">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                        {grant.requirements && grant.requirements.length > 2 && (
                          <li className="text-gray-500">
                            +{grant.requirements.length - 2} more requirements
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{grant.applicants?.length || 0} applicants</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Due {new Date(grant.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex gap-2">
                      <Button asChild size="sm" variant="outline" className="flex-1">
                        <Link href={`/grants/${grant._id}`}>
                          View Details
                        </Link>
                      </Button>
                      {grant.status === 'open' && isAuthenticated && (
                        <Button
                          size="sm"
                          onClick={() => handleApplyToGrant(grant._id)}
                          disabled={applying === grant._id}
                          className="flex-1 bg-[#fc6431] hover:bg-[#e55a2b] text-white"
                        >
                          {applying === grant._id ? 'Applying...' : 'Apply'}
                        </Button>
                      )}
                      {!isAuthenticated && grant.status === 'open' && (
                        <Button size="sm" variant="outline" className="flex-1" disabled>
                          Connect Wallet to Apply
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredGrants.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No grants found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm ? 
                      `No grants match "${searchTerm}". Try adjusting your search or filters.` :
                      'Try adjusting your filters or check back later for new grants.'
                    }
                  </p>
                  <Button 
                    onClick={() => { setSearchTerm(''); setFilter('all'); }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/WalletContext';
import Link from 'next/link';
import { Search, Calendar, User, Target } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Bounty {
  _id: string;
  title: string;
  description: string;
  amount: number;
  status: string;
  creator: string;
  createdAt: string;
  deadline: string;
  skills: string[];
  applicants?: any[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://stackup-backend-4a2z9lasp-singupalli-kartiks-projects.vercel.app';

export default function BountiesPage() {
  const [filter, setFilter] = useState<'all' | 'open' | 'assigned' | 'in-progress' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState<string | null>(null);
  
  const { isAuthenticated, user } = useWallet();

  // Fetch bounties from backend
  const fetchBounties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (filter !== 'all') queryParams.append('status', filter);
      if (searchTerm) queryParams.append('search', searchTerm);
      
      const response = await fetch(`${API_BASE_URL}/api/bounties?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBounties(data.data || []);
    } catch (error) {
      console.error('Error fetching bounties:', error);
      setError('Failed to load bounties. Please try again.');
      // Fallback to empty array
      setBounties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBounties();
  }, [filter, searchTerm]);

  const handleApplyToBounty = async (bountyId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setApplying(bountyId);
      
      const response = await fetch(`${API_BASE_URL}/api/bounties/${bountyId}/apply`, {
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
        throw new Error('Failed to apply to bounty');
      }

      toast.success('Applied to bounty successfully!');
      fetchBounties(); // Refresh the list
    } catch (error) {
      console.error('Error applying to bounty:', error);
      toast.error('Failed to apply to bounty. Please try again.');
    } finally {
      setApplying(null);
    }
  };

  // Filter bounties locally for search
  const filteredBounties = bounties.filter(bounty => {
    if (!searchTerm) return true;
    return bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           bounty.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'assigned': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
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
            <p className="mt-6 text-gray-600 font-medium">Loading bounties from backend...</p>
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
            <div className="text-red-500 text-lg font-semibold mb-4">Error loading bounties</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchBounties} className="bg-[#fc6431] hover:bg-[#e55a2b] text-white">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalRewards = bounties.reduce((sum, bounty) => sum + bounty.amount, 0);
  const openBounties = bounties.filter(b => b.status === 'open').length;
  const assignedBounties = bounties.filter(b => b.status === 'assigned').length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Active Bounties</h1>
              <p className="text-muted-foreground">
                Discover and complete bounties to earn rewards in the Stacks ecosystem
              </p>
            </div>
            <Link href="/create/bounty">
              <Button className="bg-[#fc6431] hover:bg-[#e55a2b] text-white">
                Create Bounty
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fc6431]">{openBounties}</div>
              <div className="text-sm text-muted-foreground">Open Bounties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fc6431]">{totalRewards.toLocaleString()} STX</div>
              <div className="text-sm text-muted-foreground">Total Rewards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fc6431]">{assignedBounties}</div>
              <div className="text-sm text-muted-foreground">Assigned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fc6431]">24h</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
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
                      placeholder="Search bounties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <div className="space-y-2">
                    {(['all', 'open', 'assigned', 'in-progress', 'completed', 'cancelled'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={filter === status ? "default" : "outline"}
                        onClick={() => setFilter(status)}
                        className={`w-full justify-start ${filter === status ? 
                          "bg-[#fc6431] hover:bg-[#e55a2b] text-white" : 
                          ""
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Bounties List */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {filteredBounties.map((bounty) => (
                <Card key={bounty._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl hover:text-[#fc6431] transition-colors">
                            <Link href={`/bounties/${bounty._id}`}>
                              {bounty.title}
                            </Link>
                          </CardTitle>
                          <Badge className={getStatusColor(bounty.status)}>
                            {bounty.status}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">
                          {bounty.description}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#fc6431]">
                          {bounty.amount.toLocaleString()} STX
                        </div>
                        <div className="text-sm text-muted-foreground">Reward</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {bounty.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{bounty.creator}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(bounty.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span>{bounty.applicants?.length || 0} applicants</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 flex gap-2">
                      <Button asChild size="sm" variant="outline" className="flex-1">
                        <Link href={`/bounties/${bounty._id}`}>
                          View Details
                        </Link>
                      </Button>
                      {bounty.status === 'open' && isAuthenticated && user?.stxAddress !== bounty.creator && (
                        <Button
                          size="sm"
                          onClick={() => handleApplyToBounty(bounty._id)}
                          disabled={applying === bounty._id}
                          className="flex-1 bg-[#fc6431] hover:bg-[#e55a2b] text-white"
                        >
                          {applying === bounty._id ? 'Applying...' : 'Apply'}
                        </Button>
                      )}
                      {!isAuthenticated && bounty.status === 'open' && (
                        <Button size="sm" variant="outline" className="flex-1" disabled>
                          Connect Wallet to Apply
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredBounties.length === 0 && (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No bounties found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm ? 
                      `No bounties match "${searchTerm}". Try adjusting your search or filters.` :
                      'Try adjusting your filters or check back later for new bounties.'
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


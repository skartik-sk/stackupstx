'use client';

import { useEffect, useState } from 'react';
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/WalletContext';
import Link from 'next/link';
import { Search, Lightbulb, TrendingUp, Heart, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Idea {
  _id: string;
  title: string;
  description: string;
  creator: string;
  status: string;
  category: string;
  tags: string[];
  votes: number;
  estimatedBudget?: number;
  createdAt: string;
  votedUsers?: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://stackup-backend-omega.vercel.app';

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voting, setVoting] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'idea' | 'funded' | 'in-development' | 'launched'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { isAuthenticated, user } = useWallet();

  // Fetch ideas from backend
  const fetchIdeas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (filter !== 'all') queryParams.append('status', filter);
      if (searchTerm) queryParams.append('search', searchTerm);
      
      const response = await fetch(`${API_BASE_URL}/api/ideas?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setIdeas(data.data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      setError('Failed to load ideas. Please try again.');
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [filter, searchTerm]);

  const handleVoteIdea = async (ideaId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setVoting(ideaId);
      
      const response = await fetch(`${API_BASE_URL}/api/ideas/${ideaId}/vote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: user.stxAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to vote on idea');
      }

      toast.success('Voted successfully!');
      fetchIdeas();
    } catch (error) {
      console.error('Error voting on idea:', error);
      toast.error('Failed to vote on idea. Please try again.');
    } finally {
      setVoting(null);
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesFilter = filter === 'all' || idea.status === filter;
    const matchesSearch = !searchTerm || 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idea': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'funded': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in-development': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'launched': return 'bg-purple-100 text-purple-800 border-purple-200';
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
            <p className="mt-6 text-gray-600 font-medium">Loading ideas from backend...</p>
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
            <div className="text-red-500 text-lg font-semibold mb-4">Error loading ideas</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchIdeas} className="bg-[#fc6431] hover:bg-[#e55a2b] text-white">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalVotes = ideas.reduce((sum, idea) => sum + (idea.votes || 0), 0);
  const fundedIdeas = ideas.filter(i => i.status === 'funded' || i.status === 'in-development').length;
  const developmentIdeas = ideas.filter(i => i.status === 'in-development').length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Innovation Hub</h1>
              <p className="text-muted-foreground">
                Share groundbreaking ideas and get community feedback
              </p>
            </div>
            <Link href="/create/idea">
              <Button className="bg-[#fc6431] hover:bg-[#e55a2b] text-white">
                Submit Idea
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fc6431]">{ideas.length}</div>
              <div className="text-sm text-muted-foreground">Total Ideas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fc6431]">{fundedIdeas}</div>
              <div className="text-sm text-muted-foreground">Funded Ideas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fc6431]">{totalVotes}</div>
              <div className="text-sm text-muted-foreground">Community Votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fc6431]">{developmentIdeas}</div>
              <div className="text-sm text-muted-foreground">In Development</div>
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
                      placeholder="Search ideas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <div className="space-y-2">
                    {(['all', 'idea', 'funded', 'in-development', 'launched'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={filter === status ? "default" : "outline"}
                        onClick={() => setFilter(status)}
                        className={`w-full justify-start ${filter === status ? 
                          "bg-[#fc6431] hover:bg-[#e55a2b] text-white" : 
                          ""
                        }`}
                      >
                        {status === 'all' ? 'All' : 
                         status === 'in-development' ? 'In Development' : 
                         status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Ideas List */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredIdeas.map((idea) => (
                <Card key={idea._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg hover:text-[#fc6431] transition-colors">
                            <Link href={`/ideas/${idea._id}`}>
                              {idea.title}
                            </Link>
                          </CardTitle>
                          <Badge className={getStatusColor(idea.status)}>
                            {idea.status === 'in-development' ? 'In Dev' : idea.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-sm line-clamp-3">
                      {idea.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {idea.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {idea.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{idea.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="font-medium text-[#fc6431]">{idea.votes || 0}</span>
                          <span>votes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className="text-xs">
                            {idea.category}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {idea.estimatedBudget && (
                      <div className="flex items-center space-x-2 text-sm">
                        <DollarSign className="h-4 w-4 text-[#fc6431]" />
                        <span className="text-gray-600">Est. Budget:</span>
                        <span className="font-semibold text-[#fc6431]">
                          {(idea.estimatedBudget || 0).toLocaleString()} STX
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <span>By {idea.creator.slice(0, 8)}...</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex gap-2">
                      <Button asChild size="sm" variant="outline" className="flex-1">
                        <Link href={`/ideas/${idea._id}`}>
                          View Idea
                        </Link>
                      </Button>
                      {isAuthenticated && user?.stxAddress !== idea.creator && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVoteIdea(idea._id)}
                          disabled={voting === idea._id || idea.votedUsers?.includes(user?.stxAddress || '')}
                          className="px-3"
                        >
                          {voting === idea._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-[#fc6431]" />
                          ) : (
                            <Heart className={`h-4 w-4 ${idea.votedUsers?.includes(user?.stxAddress || '') ? 'fill-red-500 text-red-500' : ''}`} />
                          )}
                        </Button>
                      )}
                      {!isAuthenticated && (
                        <Button variant="outline" size="sm" className="px-3" disabled>
                          <Heart className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredIdeas.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No ideas found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm ? 
                      `No ideas match "${searchTerm}". Try adjusting your search or filters.` :
                      'Try adjusting your filters or check back later for new ideas.'
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
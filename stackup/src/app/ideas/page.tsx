'use client';

import { useEffect, useState } from 'react';
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Search, Lightbulb, TrendingUp, Heart, Calendar, DollarSign } from 'lucide-react';

// Mock data for ideas (no backend dependency)
const mockIdeas = [
  {
    id: '1',
    title: 'Decentralized Identity Management',
    description: 'A comprehensive identity management system built on Stacks that allows users to control their digital identity without relying on centralized authorities.',
    creator: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    status: 'idea' as const,
    category: 'Identity',
    tags: ['Identity', 'Privacy', 'Security', 'DeFi'],
    votes: 45,
    estimatedBudget: 50000,
    createdAt: '2024-11-01'
  },
  {
    id: '2',
    title: 'Cross-Chain Bridge Protocol',
    description: 'Enable seamless asset transfers between Stacks and other major blockchains like Ethereum and Polygon with minimal fees and maximum security.',
    creator: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9',
    status: 'funded' as const,
    category: 'Infrastructure',
    tags: ['Cross-chain', 'Bridge', 'Interoperability'],
    votes: 72,
    estimatedBudget: 75000,
    createdAt: '2024-10-15'
  },
  {
    id: '3',
    title: 'NFT Marketplace with Royalties',
    description: 'A next-generation NFT marketplace that automatically handles creator royalties and provides advanced discovery features for collectors.',
    creator: 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KX6JS75K9R02',
    status: 'in-development' as const,
    category: 'NFTs',
    tags: ['NFT', 'Marketplace', 'Royalties', 'Art'],
    votes: 38,
    estimatedBudget: 30000,
    createdAt: '2024-10-20'
  }
];

export default function IdeasPage() {
  const [ideas, setIdeas] = useState(mockIdeas);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'idea' | 'funded' | 'in-development' | 'launched'>('all');
  const [searchTerm, setSearchTerm] = useState('');

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
            <p className="mt-6 text-gray-600 font-medium">Loading ideas...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalVotes = ideas.reduce((sum, idea) => sum + idea.votes, 0);
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
            <Button className="bg-[#fc6431] hover:bg-[#e55a2b] text-white">
              Submit Idea
            </Button>
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
                <Card key={idea.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg hover:text-[#fc6431] transition-colors">
                            <Link href={`/ideas/${idea.id}`}>
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
                          <span className="font-medium text-[#fc6431]">{idea.votes}</span>
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
                          {idea.estimatedBudget.toLocaleString()} STX
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
                      <Button asChild className="flex-1 bg-[#fc6431] hover:bg-[#e55a2b] text-white">
                        <Link href={`/ideas/${idea.id}`}>
                          View Idea
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="px-3">
                        <Heart className="h-4 w-4" />
                      </Button>
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
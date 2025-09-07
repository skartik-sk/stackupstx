'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchBounties, Bounty } from '@/lib/data';
import Link from 'next/link';
import { ExternalLink, Code, DollarSign, Clock, Users, Search, Filter, Target, Plus } from 'lucide-react';

export default function BountiesPage() {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBounties().then(data => {
      setBounties(data);
      setLoading(false);
    });
  }, []);

  const filteredBounties = bounties.filter(bounty => {
    const matchesFilter = filter === 'all' || bounty.status === filter;
    const matchesSearch = !searchTerm || 
      bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bounty.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expert': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-[#fc6431]/20 border-t-[#fc6431] rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-gray-600">Loading bounties...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#fc6431] via-orange-500 to-red-500">
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20"></div>
        <div className="absolute inset-0 opacity-20">
          <div style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} className="w-full h-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Bounty Marketplace
            </h1>
            <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover coding challenges, solve problems, and earn rewards in the Stacks ecosystem. 
              Connect with talented developers and get your projects built.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#fc6431] hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300">
                <Code className="mr-2 h-5 w-5" />
                Browse Bounties
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 backdrop-blur-sm">
                <Plus className="mr-2 h-5 w-5" />
                Create Bounty
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto text-orange-50">
            <path fill="currentColor" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 -mt-8 relative z-10">
          {[
            { title: 'Active Bounties', value: filteredBounties.filter(b => b.status === 'open').length, icon: Target, gradient: 'from-blue-500 to-cyan-500' },
            { title: 'Total Rewards', value: `${bounties.reduce((sum, b) => sum + b.amount, 0)} STX`, icon: DollarSign, gradient: 'from-emerald-500 to-green-500' },
            { title: 'Completed', value: bounties.filter(b => b.status === 'completed').length, icon: Users, gradient: 'from-purple-500 to-pink-500' },
            { title: 'In Progress', value: bounties.filter(b => b.status === 'in-progress').length, icon: Clock, gradient: 'from-orange-500 to-red-500' }
          ].map((stat, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search bounties by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-0 bg-white/50 focus:bg-white/80 transition-all duration-200"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {(['all', 'open', 'in-progress', 'completed'] as const).map((status) => (
                    <Button
                      key={status}
                      variant={filter === status ? "default" : "outline"}
                      onClick={() => setFilter(status)}
                      className={filter === status ? 
                        "bg-[#fc6431] hover:bg-[#e55a2b] text-white shadow-lg" : 
                        "bg-white/50 hover:bg-white/80 border-gray-200"
                      }
                    >
                      {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </Button>
                  ))}
                </div>
                
                <Button variant="outline" className="bg-white/50 hover:bg-white/80 border-gray-200">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bounties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredBounties.map((bounty, index) => (
            <Card key={bounty.id} className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#fc6431]/5 to-orange-200/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="pb-3 relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(bounty.status)}>
                      {bounty.status}
                    </Badge>
                    <Badge className={getDifficultyColor(bounty.difficulty)}>
                      {bounty.difficulty}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#fc6431] group-hover:text-[#e55a2b] transition-colors">
                      {bounty.amount} STX
                    </div>
                    <div className="text-sm text-gray-500">
                      ~${(bounty.amount * 0.8).toFixed(0)} USD
                    </div>
                  </div>
                </div>
                
                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-[#fc6431] transition-colors line-clamp-2 leading-tight">
                  {bounty.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  {bounty.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 relative">
                <div className="flex flex-wrap gap-1">
                  {bounty.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-[#fc6431]/10 hover:text-[#fc6431] transition-colors">
                      {tag}
                    </Badge>
                  ))}
                  {bounty.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                      +{bounty.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{bounty.difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{Math.floor(Math.random() * 10) + 1} applicants</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>By {bounty.creator}</span>
                    <span>{new Date(bounty.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button asChild className="flex-1 bg-[#fc6431] hover:bg-[#e55a2b] text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <Link href={`/bounties/${bounty.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-200 hover:border-[#fc6431] hover:text-[#fc6431] transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredBounties.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#fc6431]/20 via-orange-200/50 to-pink-200/30 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Search className="h-16 w-16 text-[#fc6431]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No bounties found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm ? 
                `No bounties match "${searchTerm}". Try adjusting your search or filters.` :
                'Try adjusting your filters or check back later for new opportunities.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => { setSearchTerm(''); setFilter('all'); }}
                variant="outline" 
                className="bg-white/50 hover:bg-white/80 border-gray-200"
              >
                Clear Filters
              </Button>
              <Button className="bg-[#fc6431] hover:bg-[#e55a2b] text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="mr-2 h-4 w-4" />
                Create First Bounty
              </Button>
            </div>
          </div>
        )}

        {/* Create Bounty CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-[#fc6431]/10 via-orange-100/50 to-pink-100/30 border-0 shadow-xl backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#fc6431]/5 to-orange-200/10"></div>
            <CardContent className="p-12 relative">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Have a Project That Needs Help?</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Create a bounty and connect with skilled developers in the Stacks ecosystem. 
                  Set your reward, define requirements, and watch the community deliver innovative solutions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-[#fc6431] hover:bg-[#e55a2b] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <Plus className="mr-2 h-5 w-5" />
                    Create New Bounty
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/50 hover:bg-white/80 border-gray-200">
                    <Code className="mr-2 h-5 w-5" />
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

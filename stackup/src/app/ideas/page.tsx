'use client';

import { useEffect, useState } from 'react';
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchIdeas, Idea } from '@/lib/data';
import Link from 'next/link';
import { Lightbulb, Search, Filter, TrendingUp, Heart, MessageCircle, Eye, ThumbsUp, Star, Plus, Rocket, Zap } from 'lucide-react';

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'idea' | 'funded' | 'in-development' | 'launched'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchIdeas().then(data => {
      setIdeas(data);
      setLoading(false);
    });
  }, []);

  const filteredIdeas = ideas.filter(idea => {
    const matchesFilter = filter === 'all' || idea.status === filter;
    const matchesSearch = !searchTerm || 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.creator.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idea': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'funded': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-development': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'launched': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idea': return <Lightbulb className="h-3 w-3" />;
      case 'funded': return <TrendingUp className="h-3 w-3" />;
      case 'in-development': return <Rocket className="h-3 w-3" />;
      case 'launched': return <Star className="h-3 w-3" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-purple-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-200 border-t-[#fc6431] mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="h-8 w-8 text-[#fc6431] animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading ideas...</p>
            <p className="text-sm text-gray-500">Discovering innovation</p>
          </div>
        </div>
      </div>
    );
  }

  const totalVotes = ideas.reduce((sum, idea) => sum + idea.votes, 0);
  const fundedIdeas = ideas.filter(i => i.status === 'funded' || i.status === 'in-development' || i.status === 'launched').length;
  const launchedIdeas = ideas.filter(i => i.status === 'launched').length;
  const totalBudget = ideas.reduce((sum, idea) => sum + (idea.estimatedBudget || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-purple-50">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-r from-yellow-400 via-[#fc6431] to-purple-600">
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20"></div>
          
          <div className="relative container mx-auto max-w-7xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Idea Marketplace
              </h1>
              <p className="text-xl text-yellow-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Share your vision, discover inspiration, and collaborate on the next big thing in Web3. 
                From concept to launch, turn innovative ideas into reality with community support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-[#fc6431] hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Star className="mr-2 h-5 w-5" />
                  Top Ideas
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 backdrop-blur-sm">
                  <Plus className="mr-2 h-5 w-5" />
                  Submit Idea
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats & Search */}
        <section className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto max-w-7xl px-4">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 -mt-8 relative z-10">
              {[
                { title: 'Total Ideas', value: ideas.length, icon: Lightbulb, gradient: 'from-yellow-500 to-orange-500' },
                { title: 'Community Votes', value: totalVotes.toLocaleString(), icon: ThumbsUp, gradient: 'from-blue-500 to-cyan-500' },
                { title: 'Funded Ideas', value: fundedIdeas, icon: TrendingUp, gradient: 'from-green-500 to-emerald-500' },
                { title: 'Launched', value: launchedIdeas, icon: Rocket, gradient: 'from-purple-500 to-pink-500' }
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
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search ideas by title, description, or creator..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-0 bg-white/50 focus:bg-white/80 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'idea', 'funded', 'in-development', 'launched'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={filter === status ? "default" : "outline"}
                        onClick={() => setFilter(status)}
                        className={filter === status ? 
                          "bg-[#fc6431] hover:bg-[#e55a2b] text-white shadow-lg" : 
                          "bg-white/50 hover:bg-white/80 border-gray-200"
                        }
                      >
                        {status === 'all' ? 'All' : status === 'in-development' ? 'In Dev' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="bg-white/50 hover:bg-white/80 border-gray-200">
                    <Filter className="mr-2 h-4 w-4" />
                    Categories
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Ideas Grid */}
        <section className="pb-24">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeas.map((idea, index) => (
                <Card key={idea.id} className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fc6431]/5 to-yellow-200/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Idea Header */}
                  <div className="relative p-6 bg-gradient-to-br from-[#fc6431]/10 to-yellow-100/30">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#fc6431] to-yellow-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {getStatusIcon(idea.status) || <Lightbulb className="h-6 w-6 text-white" />}
                      </div>
                      <Badge className={`${getStatusColor(idea.status)} flex items-center gap-1`}>
                        {getStatusIcon(idea.status)}
                        {idea.status === 'in-development' ? 'In Dev' : idea.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#fc6431] flex items-center">
                            <ThumbsUp className="h-5 w-5 mr-1" />
                            {idea.votes}
                          </div>
                          <p className="text-xs text-gray-600">votes</p>
                        </div>
                        {idea.estimatedBudget && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-700">
                              {idea.estimatedBudget.toLocaleString()} STX
                            </div>
                            <p className="text-xs text-gray-600">budget</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-[#fc6431] transition-colors line-clamp-2 leading-tight">
                      {idea.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {idea.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {idea.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-[#fc6431]/10 hover:text-[#fc6431] transition-colors">
                          {tag}
                        </Badge>
                      ))}
                      {idea.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          +{idea.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline" className="bg-[#fc6431]/10 text-[#fc6431] border-[#fc6431]/20">
                        {idea.category}
                      </Badge>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span>By {idea.creator}</span>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{Math.floor(Math.random() * 20) + 5}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{Math.floor(Math.random() * 200) + 50}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button asChild className="flex-1 bg-[#fc6431] hover:bg-[#e55a2b] text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                          <Link href={`/ideas/${idea.id}`}>
                            View Idea
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-200 hover:border-[#fc6431] hover:text-[#fc6431] transition-colors">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredIdeas.length === 0 && (
              <div className="text-center py-16">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#fc6431]/20 via-yellow-200/50 to-purple-200/30 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Lightbulb className="h-16 w-16 text-[#fc6431]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No ideas found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchTerm ? 
                    `No ideas match "${searchTerm}". Try adjusting your search or filters.` :
                    'Be the first to share your innovative idea with the community!'
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
                    Submit Idea
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Submit Idea CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-[#fc6431] to-purple-600"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]"></div>
          
          <div className="relative container mx-auto max-w-6xl px-4 text-center">
            <div className="space-y-8 text-white">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                Got a Brilliant Idea?
              </h2>
              <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
                Share your vision with the Stacks community. Get feedback, find collaborators, 
                and turn your innovative ideas into successful projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                <Button size="lg" variant="secondary" className="bg-white text-[#fc6431] hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
                  Submit Your Idea
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm hover:border-white/40 transition-all duration-300">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Idea Guidelines
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchGrants, Grant } from '@/lib/data';
import Link from 'next/link';
import { HandHeart, Search, Filter, DollarSign, Building, Clock, Users, CheckCircle, XCircle, Eye, AlertCircle, Zap } from 'lucide-react';

export default function GrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'under-review' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGrants().then(data => {
      setGrants(data);
      setLoading(false);
    });
  }, []);

  const filteredGrants = grants.filter(grant => {
    const matchesFilter = filter === 'all' || grant.status === filter;
    const matchesSearch = !searchTerm || 
      grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grant.organization.toLowerCase().includes(searchTerm.toLowerCase());
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Eye className="h-3 w-3" />;
      case 'under-review': return <AlertCircle className="h-3 w-3" />;
      case 'approved': return <CheckCircle className="h-3 w-3" />;
      case 'rejected': return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-200 border-t-[#fc6431] mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="h-8 w-8 text-[#fc6431] animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading grants...</p>
            <p className="text-sm text-gray-500">Discovering funding opportunities</p>
          </div>
        </div>
      </div>
    );
  }

  const totalFunding = grants.reduce((sum, grant) => sum + grant.amount, 0);
  const openGrants = grants.filter(g => g.status === 'open').length;
  const approvedGrants = grants.filter(g => g.status === 'approved').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-r from-green-600 via-[#fc6431] to-blue-600">
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20"></div>
          
          <div className="relative container mx-auto max-w-7xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                <HandHeart className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Grant Opportunities
              </h1>
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Access funding from leading organizations in the Stacks ecosystem. 
                Whether you're building the next DeFi protocol or launching a Web3 startup, find the perfect grant for your project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-[#fc6431] hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Browse Grants
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 backdrop-blur-sm">
                  <HandHeart className="mr-2 h-5 w-5" />
                  Application Guide
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
                { title: 'Total Available', value: `${totalFunding.toLocaleString()} STX`, icon: DollarSign, gradient: 'from-green-500 to-emerald-500' },
                { title: 'Open Grants', value: openGrants, icon: Eye, gradient: 'from-blue-500 to-cyan-500' },
                { title: 'Approved Projects', value: approvedGrants, icon: CheckCircle, gradient: 'from-purple-500 to-pink-500' },
                { title: 'Organizations', value: new Set(grants.map(g => g.organization)).size, icon: Building, gradient: 'from-orange-500 to-red-500' }
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
                      placeholder="Search grants by title, organization, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-0 bg-white/50 focus:bg-white/80 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'open', 'under-review', 'approved', 'rejected'] as const).map((status) => (
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
                    Categories
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Grants Grid */}
        <section className="pb-24">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGrants.map((grant, index) => (
                <Card key={grant.id} className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fc6431]/5 to-blue-200/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Grant Header */}
                  <div className="relative p-6 bg-gradient-to-br from-[#fc6431]/10 to-blue-100/30">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#fc6431] to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                      <Badge className={`${getStatusColor(grant.status)} flex items-center gap-1`}>
                        {getStatusIcon(grant.status)}
                        {grant.status}
                      </Badge>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-[#fc6431] mb-1">
                        {grant.amount.toLocaleString()} STX
                      </h3>
                      <p className="text-sm text-gray-600">Grant Amount</p>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-[#fc6431] transition-colors line-clamp-2 leading-tight">
                      {grant.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {grant.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Building className="h-4 w-4" />
                      <span className="font-medium">{grant.organization}</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Category</p>
                      <Badge variant="secondary" className="bg-[#fc6431]/10 text-[#fc6431] hover:bg-[#fc6431]/20 transition-colors">
                        {grant.category}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Requirements</p>
                      <div className="space-y-1 max-h-20 overflow-y-auto">
                        {grant.requirements.slice(0, 3).map((req, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-xs text-gray-600">
                            <div className="w-1.5 h-1.5 bg-[#fc6431] rounded-full mt-1.5 flex-shrink-0"></div>
                            <span className="line-clamp-1">{req}</span>
                          </div>
                        ))}
                        {grant.requirements.length > 3 && (
                          <p className="text-xs text-gray-500 italic">
                            +{grant.requirements.length - 3} more requirements
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{grant.deadline ? new Date(grant.deadline).toLocaleDateString() : 'No deadline'}</span>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {grant.applicants || Math.floor(Math.random() * 50) + 5} applicants
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <Button asChild className="w-full bg-[#fc6431] hover:bg-[#e55a2b] text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                          <Link href={`/grants/${grant.id}`}>
                            {grant.status === 'open' ? 'Apply Now' : 'View Details'}
                          </Link>
                        </Button>
                        {grant.status === 'open' && (
                          <Button 
                            variant="outline" 
                            className="w-full border-gray-200 hover:border-[#fc6431] hover:text-[#fc6431] transition-colors text-sm"
                          >
                            Save for Later
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredGrants.length === 0 && (
              <div className="text-center py-16">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#fc6431]/20 via-blue-200/50 to-green-200/30 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <HandHeart className="h-16 w-16 text-[#fc6431]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No grants found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchTerm ? 
                    `No grants match "${searchTerm}". Try adjusting your search or filters.` :
                    'Try adjusting your filters or check back later for new grant opportunities.'
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
                    <Eye className="mr-2 h-4 w-4" />
                    View All Grants
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Apply CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-[#fc6431] to-blue-600"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]"></div>
          
          <div className="relative container mx-auto max-w-6xl px-4 text-center">
            <div className="space-y-8 text-white">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                Ready to Scale Your Idea?
              </h2>
              <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
                From pre-seed funding to growth grants, find the perfect financial support for your Stacks project. 
                Join hundreds of funded projects building the future of Web3.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                <Button size="lg" variant="secondary" className="bg-white text-[#fc6431] hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <DollarSign className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Start Application
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm hover:border-white/40 transition-all duration-300">
                  <HandHeart className="mr-2 h-5 w-5" />
                  Grant Guidelines
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

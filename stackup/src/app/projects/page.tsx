'use client';

import { useEffect, useState } from 'react';
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchProjects, Project } from '@/lib/data';
import Link from 'next/link';
import { ExternalLink, Rocket, Heart, Users, Search, Filter, Star, GitBranch, Globe, Calendar, Eye, Zap } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'funded'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.status === filter;
    const matchesSearch = !searchTerm || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'funded': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-200 border-t-[#fc6431] mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="h-8 w-8 text-[#fc6431] animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading projects...</p>
            <p className="text-sm text-gray-500">Discovering innovation</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-r from-purple-600 via-[#fc6431] to-pink-600">
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20"></div>
          
          <div className="relative container mx-auto max-w-7xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Project Showcase
              </h1>
              <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover innovative projects built on Stacks. From DeFi protocols to NFT marketplaces, 
                explore the cutting-edge applications shaping the future of Web3.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-[#fc6431] hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Star className="mr-2 h-5 w-5" />
                  Featured Projects
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 backdrop-blur-sm">
                  <GitBranch className="mr-2 h-5 w-5" />
                  Submit Project
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
                { title: 'Total Projects', value: projects.length, icon: Rocket, gradient: 'from-blue-500 to-cyan-500' },
                { title: 'Active Projects', value: projects.filter(p => p.status === 'active').length, icon: GitBranch, gradient: 'from-emerald-500 to-green-500' },
                { title: 'Total Funding', value: `${projects.reduce((sum, p) => sum + p.fundingGoal, 0).toLocaleString()} STX`, icon: Heart, gradient: 'from-purple-500 to-pink-500' },
                { title: 'Contributors', value: projects.reduce((sum, p) => sum + p.supporters, 0), icon: Users, gradient: 'from-orange-500 to-red-500' }
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
                      placeholder="Search projects by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-0 bg-white/50 focus:bg-white/80 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'active', 'completed', 'funded'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={filter === status ? "default" : "outline"}
                        onClick={() => setFilter(status)}
                        className={filter === status ? 
                          "bg-[#fc6431] hover:bg-[#e55a2b] text-white shadow-lg" : 
                          "bg-white/50 hover:bg-white/80 border-gray-200"
                        }
                      >
                        {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
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

        {/* Projects Grid */}
        <section className="pb-24">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <Card key={project.id} className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fc6431]/5 to-purple-200/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Project Image/Icon */}
                  <div className="relative h-48 bg-gradient-to-br from-[#fc6431]/10 to-purple-100/30 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#fc6431] to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Rocket className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-[#fc6431] transition-colors line-clamp-2 leading-tight">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-[#fc6431]/10 hover:text-[#fc6431] transition-colors">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Funding Progress</span>
                        <span className="font-semibold text-[#fc6431]">
                          {Math.round((project.currentFunding / project.fundingGoal) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#fc6431] to-purple-500 h-2 rounded-full transition-all duration-500 group-hover:shadow-lg"
                          style={{ width: `${Math.min((project.currentFunding / project.fundingGoal) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{project.currentFunding.toLocaleString()} STX</span>
                        <span>Goal: {project.fundingGoal.toLocaleString()} STX</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{project.supporters} supporters</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span>By {project.creator}</span>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4 text-red-400" />
                          <span>{Math.floor(Math.random() * 100) + 10}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button asChild className="flex-1 bg-[#fc6431] hover:bg-[#e55a2b] text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                          <Link href={`/projects/${project.id}`}>
                            View Project
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-200 hover:border-[#fc6431] hover:text-[#fc6431] transition-colors">
                          <Globe className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#fc6431]/20 via-purple-200/50 to-pink-200/30 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Rocket className="h-16 w-16 text-[#fc6431]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchTerm ? 
                    `No projects match "${searchTerm}". Try adjusting your search or filters.` :
                    'Try adjusting your filters or check back later for new projects.'
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
                    <GitBranch className="mr-2 h-4 w-4" />
                    Submit Project
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Submit Project CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-[#fc6431] to-pink-600"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]"></div>
          
          <div className="relative container mx-auto max-w-6xl px-4 text-center">
            <div className="space-y-8 text-white">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                Built Something Amazing?
              </h2>
              <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
                Showcase your project to the Stacks community. Whether it's a DeFi protocol, NFT platform, 
                or innovative dApp, let the world discover your creation.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                <Button size="lg" variant="secondary" className="bg-white text-[#fc6431] hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <GitBranch className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Submit Your Project
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm hover:border-white/40 transition-all duration-300">
                  <Star className="mr-2 h-5 w-5" />
                  View Guidelines
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

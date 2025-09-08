'use client';

import { useEffect, useState } from 'react';
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/WalletContextNew';
import Link from 'next/link';
import { Search, Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Project {
  _id: string;
  title: string;
  description: string;
  creator: string;
  status: string;
  tags: string[];
  funding: number;
  fundingGoal: number;
  contributors: number;
  createdAt: string;
  category?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://stackup-backend-omega.vercel.app';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'planning'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  


  // Fetch projects from backend
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (filter !== 'all') queryParams.append('status', filter);
      if (searchTerm) queryParams.append('search', searchTerm);
      
      const response = await fetch(`${API_BASE_URL}/api/projects?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProjects(data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects. Please try again.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filter, searchTerm]);

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
      case 'planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
            <p className="mt-6 text-gray-600 font-medium">Loading projects from backend...</p>
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
            <div className="text-red-500 text-lg font-semibold mb-4">Error loading projects</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchProjects} className="bg-[#fc6431] hover:bg-[#e55a2b] text-white">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalFunding = projects.reduce((sum, project) => sum + (project.fundingGoal || 0), 0);
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalContributors = projects.reduce((sum, p) => sum + (p.contributors || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Project Showcase</h1>
              <p className="text-muted-foreground">
                Discover innovative projects built on Stacks blockchain
              </p>
            </div>
            <Link href="/apply/project">
              <Button className="bg-[#fc6431] hover:bg-[#e55a2b] text-white">
                Submit Project
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fc6431]">{projects.length}</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fc6431]">{activeProjects}</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fc6431]">{(totalFunding / 1000).toFixed(0)}K STX</div>
              <div className="text-sm text-muted-foreground">Total Funding</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#fc6431]">{totalContributors}</div>
              <div className="text-sm text-muted-foreground">Contributors</div>
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
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <div className="space-y-2">
                    {(['all', 'active', 'completed', 'planning'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={filter === status ? "default" : "outline"}
                        onClick={() => setFilter(status)}
                        className={`w-full justify-start ${filter === status ? 
                          "bg-[#fc6431] hover:bg-[#e55a2b] text-white" : 
                          ""
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Projects List */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg hover:text-[#fc6431] transition-colors">
                            <Link href={`/projects/${project._id}`}>
                              {project.title}
                            </Link>
                          </CardTitle>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-sm line-clamp-3">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Funding Progress</span>
                        <span className="font-semibold text-[#fc6431]">
                          {(project.fundingGoal || 0) > 0 ? Math.round(((project.funding || 0) / (project.fundingGoal || 1)) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#fc6431] h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(project.fundingGoal || 0) > 0 ? Math.min(((project.funding || 0) / (project.fundingGoal || 1)) * 100, 100) : 0}%` 
                          }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{(project.funding || 0).toLocaleString()} STX</span>
                        <span>Goal: {(project.fundingGoal || 0).toLocaleString()} STX</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{project.contributors || 0} contributors</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        {project.creator ? project.creator.slice(0, 8) : ''}...
                      </div>
                      
                      <Button asChild className="w-full bg-[#fc6431] hover:bg-[#e55a2b] text-white">
                        <Link href={`/projects/${project._id}`}>
                          View Project
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredProjects.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm ? 
                      `No projects match "${searchTerm}". Try adjusting your search or filters.` :
                      'Try adjusting your filters or check back later for new projects.'
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

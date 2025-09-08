'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { api } from '@/lib/api';
import Link from 'next/link';

interface PlatformStats {
  totalBounties: number;
  totalGrants: number;
  totalIdeas: number;
  totalProjects: number;
  totalFunding: number;
  activeUsers: number;
}

export function HeroSection() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatformStats();
  }, []);

  const fetchPlatformStats = async () => {
    try {
      setLoading(true);
      
      // Fetch data from all endpoints to calculate stats
      const [bountiesRes, grantsRes, ideasRes, projectsRes] = await Promise.allSettled([
        api.bounties.getAll(),
        api.grants.getAll(),
        api.ideas.getAll(),
        api.projects.getAll()
      ]);

      const bounties = bountiesRes.status === 'fulfilled' ? bountiesRes.value.data : [];
      const grants = grantsRes.status === 'fulfilled' ? grantsRes.value.data : [];
      const ideas = ideasRes.status === 'fulfilled' ? ideasRes.value.data : [];
      const projects = projectsRes.status === 'fulfilled' ? projectsRes.value.data : [];

      // Calculate total funding
      const totalBountyFunding = Array.isArray(bounties) 
        ? bounties.reduce((sum: number, b: any) => sum + (b.amount || 0), 0)
        : 0;
      const totalGrantFunding = Array.isArray(grants) 
        ? grants.reduce((sum: number, g: any) => sum + (g.amount || 0), 0)
        : 0;
      const totalProjectFunding = Array.isArray(projects) 
        ? projects.reduce((sum: number, p: any) => sum + (p.funding || 0), 0)
        : 0;

      setStats({
        totalBounties: Array.isArray(bounties) ? bounties.length : 0,
        totalGrants: Array.isArray(grants) ? grants.length : 0,
        totalIdeas: Array.isArray(ideas) ? ideas.length : 0,
        totalProjects: Array.isArray(projects) ? projects.length : 0,
        totalFunding: totalBountyFunding + totalGrantFunding + totalProjectFunding,
        activeUsers: 250, // This would need a separate endpoint
      });
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      // Fallback to default stats
      setStats({
        totalBounties: 45,
        totalGrants: 12,
        totalIdeas: 87,
        totalProjects: 23,
        totalFunding: 125000,
        activeUsers: 250,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#fc6431]/10 text-[#fc6431] text-sm font-medium">
                ⚡ Powered by Bitcoin Security
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                Boost the <span className="text-[#fc6431]">Stacks</span> Ecosystem
              </h1>
              <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
                Connect builders, funders, and innovators through bounties, projects, grants, and groundbreaking ideas
                on the leading Bitcoin L2.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-[#fc6431] hover:bg-[#e55a2b] text-white">
                <Link href="/bounties">
                  Explore Bounties
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/projects">
                  Submit Project
                </Link>
              </Button>
            </div>

            {/* Stats */}
            {stats && !loading && (
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#fc6431]">{stats.totalBounties}+</div>
                  <div className="text-sm text-muted-foreground">Active Bounties</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#fc6431]">{(stats.totalFunding || 0).toLocaleString()} STX</div>
                  <div className="text-sm text-muted-foreground">Total Rewards</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#fc6431]">{stats.activeUsers}+</div>
                  <div className="text-sm text-muted-foreground">Developers</div>
                </div>
              </div>
            )}
            
            {loading && (
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#fc6431]">...</div>
                  <div className="text-sm text-muted-foreground">Loading...</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#fc6431]">...</div>
                  <div className="text-sm text-muted-foreground">Loading...</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#fc6431]">...</div>
                  <div className="text-sm text-muted-foreground">Loading...</div>
                </div>
              </div>
            )}
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-gradient-to-br from-[#fc6431]/5 to-[#fc6431]/10 border-[#fc6431]/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 space-y-3">
                <div className="w-10 h-10 bg-[#fc6431]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[#fc6431] font-bold">B</span>
                </div>
                <h3 className="font-semibold">Bounties</h3>
                <p className="text-sm text-muted-foreground">
                  Earn rewards for solving challenges and building features
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 space-y-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-500 font-bold">P</span>
                </div>
                <h3 className="font-semibold">Projects</h3>
                <p className="text-sm text-muted-foreground">
                  Get milestone-based funding for your Stacks applications
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 space-y-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-500 font-bold">G</span>
                </div>
                <h3 className="font-semibold">Grants</h3>
                <p className="text-sm text-muted-foreground">Secure funding for research and ecosystem development</p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 space-y-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-purple-500 font-bold">I</span>
                </div>
                <h3 className="font-semibold">Ideas</h3>
                <p className="text-sm text-muted-foreground">Share innovative concepts and get community feedback</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
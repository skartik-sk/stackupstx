'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { fetchPlatformStats, type PlatformStats } from '@/lib/data'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Target, Rocket, Award, Lightbulb, ArrowRight } from 'lucide-react'

export function HeroSection() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlatformStats().then(data => {
      setStats(data)
      setLoading(false)
    })
  }, [])

  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#fc6431]/10 text-[#fc6431] text-sm font-medium border border-[#fc6431]/20">
                ⚡ Powered by Bitcoin Security
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                Boost the <span className="text-[#fc6431]">Stacks</span> Ecosystem
              </h1>
              <p className="text-xl text-gray-600 text-pretty max-w-2xl">
                Connect builders, funders, and innovators through bounties, projects, grants, and groundbreaking ideas
                on the leading Bitcoin L2.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-[#fc6431] text-white hover:bg-[#e55a2b] shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/bounties" className="flex items-center">
                  Explore Bounties
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-[#fc6431]/20 hover:bg-[#fc6431]/5 hover:border-[#fc6431]/40">
                <Link href="/create/project">
                  Submit Project
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#fc6431]">
                  {loading ? '...' : `${stats?.activeBounties || 0}+`}
                </div>
                <div className="text-sm text-gray-600">Active Bounties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#fc6431]">
                  {loading ? '...' : `${Math.round((stats?.totalStxDistributed || 0) / 1000)}K STX`}
                </div>
                <div className="text-sm text-gray-600">Total Rewards</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#fc6431]">
                  {loading ? '...' : `${Math.round((stats?.totalUsers || 0) / 100)}+`}
                </div>
                <div className="text-sm text-gray-600">Developers</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-gradient-to-br from-[#fc6431]/5 to-[#fc6431]/10 border-[#fc6431]/20 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-0 space-y-3">
                <div className="w-10 h-10 bg-[#fc6431]/20 rounded-lg flex items-center justify-center group-hover:bg-[#fc6431]/30 transition-colors">
                  <Target className="h-6 w-6 text-[#fc6431]" />
                </div>
                <h3 className="font-semibold">Bounties</h3>
                <p className="text-sm text-gray-600">
                  Earn rewards for solving challenges and building features
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-0 space-y-3">
                <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center group-hover:bg-purple-300 transition-colors">
                  <Rocket className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">Projects</h3>
                <p className="text-sm text-gray-600">
                  Get milestone-based funding for your Stacks applications
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-0 space-y-3">
                <div className="w-10 h-10 bg-emerald-200 rounded-lg flex items-center justify-center group-hover:bg-emerald-300 transition-colors">
                  <Award className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold">Grants</h3>
                <p className="text-sm text-gray-600">Secure funding for research and ecosystem development</p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-0 space-y-3">
                <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center group-hover:bg-amber-300 transition-colors">
                  <Lightbulb className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-semibold">Ideas</h3>
                <p className="text-sm text-gray-600">Share innovative concepts and get AI-powered insights</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

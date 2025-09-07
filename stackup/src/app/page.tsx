'use client'

import React, { useState, useEffect } from 'react'
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useStacks } from '@/providers/StacksProvider'
import { 
  Target, 
  Rocket, 
  Coins, 
  Users, 
  Award,
  ArrowRight,
  Lightbulb,
  Zap,
  TrendingUp,
  Code,
  Shield,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import { fetchPlatformStats, fetchBounties, type PlatformStats, type Bounty } from '@/lib/data'

export default function HomePage() {
  const { isConnected, account } = useStacks()
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [recentBounties, setRecentBounties] = useState<Bounty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [platformStats, bounties] = await Promise.all([
          fetchPlatformStats(),
          fetchBounties()
        ])
        setStats(platformStats)
        setRecentBounties(bounties.slice(0, 3))
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

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
            <p className="mt-6 text-gray-600 font-medium">Loading StackUp platform...</p>
            <p className="text-sm text-gray-500">Powered by Stacks Blockchain</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <Navigation />
      <main>
        <HeroSection />

        {/* Recent Bounties Section */}
        <section className="py-24 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-6">
              <div>
                <h2 className="text-4xl font-bold mb-4 text-gray-900">Latest Opportunities</h2>
                <p className="text-lg text-gray-600">Fresh bounties from the community</p>
              </div>
              <Button asChild variant="outline" size="lg" className="border-[#fc6431]/20 hover:bg-[#fc6431] hover:text-white hover:border-[#fc6431] transition-all duration-300">
                <Link href="/bounties" className="flex items-center">
                  View All Bounties <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentBounties.map((bounty) => (
                <Card key={bounty.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:scale-105 cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-[#fc6431] transition-colors">
                        {bounty.title}
                      </CardTitle>
                      <div className="text-right shrink-0">
                        <div className="text-2xl font-bold text-[#fc6431]">
                          {bounty.amount}
                        </div>
                        <div className="text-sm font-medium text-[#fc6431]">STX</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{bounty.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs border-[#fc6431]/20 text-[#fc6431]">
                          {bounty.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {bounty.difficulty}
                        </Badge>
                      </div>
                      <Button asChild size="sm" className="bg-[#fc6431] hover:bg-[#e55a2b] text-white shadow-md hover:shadow-lg transition-all duration-300">
                        <Link href={`/bounties/${bounty.id}`}>Apply</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#fc6431] via-orange-500 to-purple-600"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]"></div>
          
          <div className="relative container mx-auto max-w-6xl px-4 text-center">
            <div className="space-y-8 text-white">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                Ready to Shape the Future?
              </h2>
              <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
                Join thousands of innovators building the decentralized web. 
                Create bounties, launch projects, or contribute your expertise today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                <Button asChild size="lg" variant="secondary" className="bg-white text-[#fc6431] hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <Link href="/create/bounty" className="flex items-center">
                    Create a Bounty
                    <Target className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm hover:border-white/40 transition-all duration-300">
                  <Link href="/projects" className="flex items-center">
                    Browse Projects
                    <Rocket className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              {isConnected && account && (
                <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 inline-block">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium">
                      Connected as <span className="font-mono text-orange-200 font-semibold">{account.address.slice(0, 8)}...{account.address.slice(-8)}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

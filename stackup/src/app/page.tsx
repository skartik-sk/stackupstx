'use client'

import React from 'react'
import { Navigation } from "@/components/navigation"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useStacks } from '@/providers/StacksProvider'
import { 
  Target, 
  Rocket, 
  Code, 
  Coins, 
  Users, 
  TrendingUp, 
  Award,
  ArrowRight,
  Lightbulb,
  Shield,
  Zap,
  Globe
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { isConnected, account } = useStacks()

  const stats = [
    { label: 'Active Bounties', value: '24', icon: Target, color: 'text-blue-500' },
    { label: 'Total Projects', value: '156', icon: Rocket, color: 'text-green-500' },
    { label: 'Community Members', value: '2.1K', icon: Users, color: 'text-purple-500' },
    { label: 'STX Distributed', value: '48.2K', icon: Coins, color: 'text-yellow-500' },
  ]

  const features = [
    {
      icon: Target,
      title: 'Create Bounties',
      description: 'Post bounties for specific development tasks and attract skilled contributors to your project.',
      href: '/create/bounty'
    },
    {
      icon: Rocket,
      title: 'Launch Projects',
      description: 'Showcase your project ideas and get milestone-based funding from the community.',
      href: '/create/project'
    },
    {
      icon: Award,
      title: 'Apply for Grants',
      description: 'Get funding for innovative ideas that will boost the Stacks ecosystem.',
      href: '/grants'
    },
    {
      icon: Lightbulb,
      title: 'Share Ideas',
      description: 'Propose innovative concepts and collaborate with the community to bring them to life.',
      href: '/ideas'
    }
  ]

  const recentBounties = [
    {
      title: 'Build NFT Marketplace UI',
      amount: 50,
      difficulty: 'intermediate',
      category: 'Frontend'
    },
    {
      title: 'Smart Contract Audit',
      amount: 100,
      difficulty: 'advanced',
      category: 'Security'
    },
    {
      title: 'API Documentation',
      amount: 25,
      difficulty: 'beginner',
      category: 'Docs'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto max-w-7xl px-4 py-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="text-sm px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                Powered by Stacks Blockchain
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Boost the{' '}
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Stacks Ecosystem
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Connect builders, creators, and stakeholders through bounties, projects, grants, and innovative ideas. 
                Get paid in STX for contributing to the decentralized web.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isConnected ? (
                <div className="flex gap-4">
                  <Button size="lg" asChild>
                    <Link href="/bounties">
                      Explore Bounties
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/dashboard">
                      Dashboard
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Button size="lg" asChild>
                    <Link href="/bounties">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </div>
              )}
            </div>
            
            {isConnected && account && (
              <Card className="inline-block bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Wallet Connected</span>
                    <Badge variant="secondary">
                      {(account.balance / 1_000_000).toFixed(2)} STX
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center shadow-sm">
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How StackUp Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Multiple ways to contribute and get rewarded in the Stacks ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="mb-4">
                      {feature.description}
                    </CardDescription>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={feature.href}>
                        Learn More
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent Bounties Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Latest Bounties</h2>
              <p className="text-muted-foreground">
                Discover the newest opportunities to contribute and earn STX
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/bounties">
                View All Bounties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentBounties.map((bounty, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">
                      {bounty.title}
                    </CardTitle>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {bounty.amount} STX
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {bounty.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {bounty.difficulty}
                      </Badge>
                    </div>
                    <Button size="sm">Apply</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <Card className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Building?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of developers contributing to the Stacks ecosystem. 
                Create your first bounty or apply to existing ones today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/create/bounty">
                    Create Bounty
                    <Target className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
                  <Link href="/bounties">
                    Browse Opportunities
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

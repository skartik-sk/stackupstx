'use client'

import React, { useState, useEffect } from 'react'
import { Navigation } from "@/components/navigation"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CreateBountyForm } from '@/components/bounties/CreateBountyForm'
import { useStacks } from '@/providers/StacksProvider'
import { formatStx, microStxToStx } from '@/lib/contracts'
import { 
  Search, 
  Plus, 
  Filter, 
  Target, 
  Clock, 
  Coins, 
  Users, 
  Eye,
  TrendingUp,
  Star
} from 'lucide-react'
import Link from 'next/link'

interface Bounty {
  id: string
  title: string
  description: string
  amount: number
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  status: 'open' | 'in-progress' | 'completed' | 'cancelled'
  creatorAddress: string
  workerAddress?: string
  timeline: string
  createdAt: string
  applications: number
  viewCount: number
}

export default function BountiesPage() {
  const { isConnected } = useStacks()
  const [bounties, setBounties] = useState<Bounty[]>([])
  const [filteredBounties, setFilteredBounties] = useState<Bounty[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Mock data for demo
  const mockBounties: Bounty[] = [
    {
      id: '1',
      title: 'Build a Modern NFT Marketplace UI',
      description: 'Create a responsive, modern UI for an NFT marketplace on Stacks blockchain. Should include listing, buying, and selling functionality.',
      amount: 50,
      category: 'Frontend Development',
      difficulty: 'intermediate',
      status: 'open',
      creatorAddress: 'ST1ABC...XYZ',
      timeline: '2 weeks',
      createdAt: '2024-01-15T10:00:00Z',
      applications: 5,
      viewCount: 124
    },
    {
      id: '2',
      title: 'Smart Contract Security Audit',
      description: 'Perform a comprehensive security audit of our DeFi smart contracts. Must identify vulnerabilities and provide detailed report.',
      amount: 100,
      category: 'Smart Contracts',
      difficulty: 'advanced',
      status: 'open',
      creatorAddress: 'ST2DEF...ABC',
      timeline: '1 month',
      createdAt: '2024-01-14T15:30:00Z',
      applications: 3,
      viewCount: 89
    },
    {
      id: '3',
      title: 'Documentation for Clarity Contract',
      description: 'Write comprehensive documentation for a complex Clarity smart contract including examples and tutorials.',
      amount: 25,
      category: 'Documentation',
      difficulty: 'beginner',
      status: 'in-progress',
      creatorAddress: 'ST3GHI...DEF',
      workerAddress: 'ST4JKL...GHI',
      timeline: '1 week',
      createdAt: '2024-01-13T09:15:00Z',
      applications: 8,
      viewCount: 156
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBounties(mockBounties)
      setFilteredBounties(mockBounties)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = bounties

    if (searchTerm) {
      filtered = filtered.filter(bounty =>
        bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bounty.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter(bounty => bounty.category === categoryFilter)
    }

    if (difficultyFilter) {
      filtered = filtered.filter(bounty => bounty.difficulty === difficultyFilter)
    }

    if (statusFilter) {
      filtered = filtered.filter(bounty => bounty.status === statusFilter)
    }

    setFilteredBounties(filtered)
  }, [bounties, searchTerm, categoryFilter, difficultyFilter, statusFilter])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const categories = ['Frontend Development', 'Backend Development', 'Smart Contracts', 'UI/UX Design', 'Documentation', 'Testing', 'Marketing']
  const difficulties = ['beginner', 'intermediate', 'advanced']
  const statuses = ['open', 'in-progress', 'completed', 'cancelled']

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading bounties...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Target className="h-8 w-8 text-primary" />
              Bounties
            </h1>
            <p className="text-muted-foreground mt-2">
              Discover opportunities to contribute to the Stacks ecosystem and earn STX
            </p>
          </div>
          
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={!isConnected}>
                <Plus className="h-4 w-4" />
                Create Bounty
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Bounty</DialogTitle>
              </DialogHeader>
              <CreateBountyForm 
                onSuccess={() => setShowCreateForm(false)}
                onCancel={() => setShowCreateForm(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bounties</p>
                  <p className="text-2xl font-bold">{bounties.length}</p>
                </div>
                <Target className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Bounties</p>
                  <p className="text-2xl font-bold">{bounties.filter(b => b.status === 'open').length}</p>
                </div>
                <Clock className="h-8 w-8 text-green-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">{bounties.reduce((sum, b) => sum + b.amount, 0)} STX</p>
                </div>
                <Coins className="h-8 w-8 text-yellow-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="text-2xl font-bold">{bounties.reduce((sum, b) => sum + b.applications, 0)}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search bounties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Difficulties</SelectItem>
                    {difficulties.map(diff => (
                      <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bounty Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBounties.map((bounty) => (
            <Card key={bounty.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-2">
                      {bounty.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getDifficultyColor(bounty.difficulty)}>
                        {bounty.difficulty}
                      </Badge>
                      <Badge className={getStatusColor(bounty.status)}>
                        {bounty.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {bounty.amount} STX
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ~${(bounty.amount * 0.8).toFixed(0)} USD
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-3">
                  {bounty.description}
                </CardDescription>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {bounty.timeline}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {bounty.applications} applicants
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {bounty.viewCount} views
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {bounty.creatorAddress.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground font-mono">
                      {bounty.creatorAddress.slice(0, 8)}...
                    </span>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {bounty.category}
                  </Badge>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  {bounty.status === 'open' && (
                    <Button size="sm" className="flex-1">
                      Apply Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBounties.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No bounties found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('')
                setCategoryFilter('')
                setDifficultyFilter('')
                setStatusFilter('')
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

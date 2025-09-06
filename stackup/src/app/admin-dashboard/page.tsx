"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  DollarSign, 
  Eye, 
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Flag,
  Search,
  Filter,
  Calendar,
  Activity,
  BarChart3
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

// Mock data - replace with actual blockchain data
const mockPlatformMetrics = {
  totalUsers: 1247,
  projectsToday: 8,
  totalEscrow: 2847.5,
  activeProjects: 156,
  totalValue: 12450.8,
  growthRate: 23.5
}

const mockChartData = [
  { date: '2024-08-01', projects: 12, users: 45 },
  { date: '2024-08-08', projects: 18, users: 62 },
  { date: '2024-08-15', projects: 25, users: 78 },
  { date: '2024-08-22', projects: 31, users: 94 },
  { date: '2024-08-29', projects: 28, users: 105 },
  { date: '2024-09-05', projects: 35, users: 123 }
]

const mockPendingSubmissions = [
  {
    id: 1,
    type: 'bounty',
    title: 'Stacks DEX Aggregator',
    creator: 'DeFi Protocol Labs',
    creatorAvatar: '/api/placeholder/40/40',
    submittedDate: '2024-09-06',
    reward: 50.0,
    description: 'Build a decentralized exchange aggregator for optimal trading routes across Stacks DeFi protocols...',
    status: 'pending',
    category: 'DeFi',
    tags: ['Smart Contracts', 'DeFi', 'Trading']
  },
  {
    id: 2,
    type: 'project',
    title: 'NFT Analytics Platform',
    creator: 'ArtStack Solutions',
    creatorAvatar: '/api/placeholder/40/40',
    submittedDate: '2024-09-05',
    reward: 35.0,
    description: 'Comprehensive analytics platform for NFT collections on Stacks blockchain with market insights...',
    status: 'pending',
    category: 'NFT',
    tags: ['Analytics', 'NFT', 'Data']
  },
  {
    id: 3,
    type: 'grant',
    title: 'Educational Content Series',
    creator: 'Stacks Academy',
    creatorAvatar: '/api/placeholder/40/40',
    submittedDate: '2024-09-04',
    reward: 15.0,
    description: 'Create comprehensive video tutorials for developers new to Stacks and Clarity programming...',
    status: 'pending',
    category: 'Education',
    tags: ['Education', 'Documentation', 'Video']
  },
  {
    id: 4,
    type: 'idea',
    title: 'DAO Governance Tool',
    creator: 'Community Builder',
    creatorAvatar: '/api/placeholder/40/40',
    submittedDate: '2024-09-03',
    reward: 0,
    description: 'A comprehensive governance platform for DAOs built on Stacks with voting mechanisms...',
    status: 'flagged',
    category: 'Governance',
    tags: ['DAO', 'Governance', 'Voting'],
    flagReason: 'Similar idea already exists'
  }
]

const mockUsers = [
  {
    id: 1,
    name: 'Alice Chen',
    email: 'alice.chen@example.com',
    stackerScore: 4.8,
    joinDate: '2024-07-15',
    projectsCompleted: 8,
    status: 'active',
    lastSeen: '2024-09-06',
    walletAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
  },
  {
    id: 2,
    name: 'Bob Rodriguez',
    email: 'bob.rodriguez@example.com',
    stackerScore: 4.5,
    joinDate: '2024-06-20',
    projectsCompleted: 12,
    status: 'active',
    lastSeen: '2024-09-05',
    walletAddress: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
  },
  {
    id: 3,
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    stackerScore: 3.2,
    joinDate: '2024-08-01',
    projectsCompleted: 2,
    status: 'warned',
    lastSeen: '2024-08-30',
    walletAddress: 'ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ',
    warning: 'Late delivery on recent project'
  }
]

export default function AdminDashboard() {
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const handleApprove = async (submissionId: number) => {
    console.log('Approving submission:', submissionId)
    // Implementation for approving submission
  }

  const handleReject = async (submissionId: number, reason: string) => {
    console.log('Rejecting submission:', submissionId, 'Reason:', reason)
    // Implementation for rejecting submission
  }

  const handleFlag = async (submissionId: number, reason: string) => {
    console.log('Flagging submission:', submissionId, 'Reason:', reason)
    // Implementation for flagging submission
  }

  const handleUserAction = async (userId: number, action: string) => {
    console.log('User action:', action, 'for user:', userId)
    // Implementation for user management actions
  }

  const filteredSubmissions = mockPendingSubmissions.filter(submission => {
    const matchesFilter = filter === 'all' || submission.type === filter
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.creator.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Admin Sentinel</h1>
          <p className="text-lg text-gray-600">
            Platform oversight and moderation center
          </p>
        </div>

        {/* Platform Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-[#fc6431]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPlatformMetrics.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-gray-600">
                +{mockPlatformMetrics.growthRate}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects Today</CardTitle>
              <Activity className="h-4 w-4 text-[#fc6431]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPlatformMetrics.projectsToday}</div>
              <p className="text-xs text-gray-600">
                New submissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total in Escrow</CardTitle>
              <DollarSign className="h-4 w-4 text-[#fc6431]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPlatformMetrics.totalEscrow.toLocaleString()} STX</div>
              <p className="text-xs text-gray-600">
                Across {mockPlatformMetrics.activeProjects} active projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#fc6431]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPlatformMetrics.totalValue.toLocaleString()} STX</div>
              <p className="text-xs text-gray-600">
                Total value transacted
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
            <CardDescription>Project submissions and user growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="projects" 
                    stackId="1" 
                    stroke="#fc6431" 
                    fill="#fc6431" 
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stackId="2" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="moderation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="moderation">Moderation Queue</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          {/* Moderation Queue Tab */}
          <TabsContent value="moderation" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Moderation Queue</CardTitle>
                    <CardDescription>
                      Review and moderate new submissions
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search submissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="bounty">Bounties</SelectItem>
                        <SelectItem value="project">Projects</SelectItem>
                        <SelectItem value="grant">Grants</SelectItem>
                        <SelectItem value="idea">Ideas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredSubmissions.map((submission) => (
                    <div key={submission.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={submission.creatorAvatar} />
                            <AvatarFallback>{submission.creator.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{submission.title}</h3>
                              <Badge variant="outline" className="capitalize">{submission.type}</Badge>
                              <Badge variant="secondary">{submission.category}</Badge>
                              {submission.status === 'flagged' && (
                                <Badge variant="destructive">
                                  <Flag className="h-3 w-3 mr-1" />
                                  Flagged
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-gray-600 max-w-3xl">{submission.description}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Creator: {submission.creator}</span>
                              <span>Submitted: {new Date(submission.submittedDate).toLocaleDateString()}</span>
                              {submission.reward > 0 && <span>Reward: {submission.reward} STX</span>}
                            </div>

                            <div className="flex gap-1">
                              {submission.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            {submission.flagReason && (
                              <div className="bg-red-50 border border-red-200 p-2 rounded text-sm text-red-700">
                                Flag reason: {submission.flagReason}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Review Submission</DialogTitle>
                                <DialogDescription>
                                  Review and take action on this submission
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold">{submission.title}</h4>
                                  <p className="text-gray-600 mt-2">{submission.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Type:</span> {submission.type}
                                  </div>
                                  <div>
                                    <span className="font-medium">Category:</span> {submission.category}
                                  </div>
                                  <div>
                                    <span className="font-medium">Creator:</span> {submission.creator}
                                  </div>
                                  <div>
                                    <span className="font-medium">Reward:</span> {submission.reward} STX
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                  <Button 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleApprove(submission.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="destructive">
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Reject Submission</DialogTitle>
                                        <DialogDescription>
                                          Please provide a reason for rejection
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <Textarea
                                          placeholder="Reason for rejection..."
                                          value={rejectReason}
                                          onChange={(e) => setRejectReason(e.target.value)}
                                        />
                                        <div className="flex gap-2 justify-end">
                                          <Button variant="outline">Cancel</Button>
                                          <Button 
                                            variant="destructive"
                                            onClick={() => {
                                              handleReject(submission.id, rejectReason)
                                              setRejectReason('')
                                            }}
                                          >
                                            Reject
                                          </Button>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                  
                                  <Button variant="outline">
                                    <Flag className="h-4 w-4 mr-2" />
                                    Flag for Review
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage users, their scores, and platform standing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold">{user.name}</h3>
                              <Badge 
                                variant={user.status === 'active' ? 'default' : 
                                        user.status === 'warned' ? 'destructive' : 'secondary'}
                              >
                                {user.status}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600">{user.email}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <span>Score: {user.stackerScore}/5.0</span>
                              <span>Projects: {user.projectsCompleted}</span>
                              <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                              <span>Last seen: {new Date(user.lastSeen).toLocaleDateString()}</span>
                            </div>

                            {user.warning && (
                              <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-sm text-yellow-700 mt-2">
                                Warning: {user.warning}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                          
                          {user.status === 'active' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleUserAction(user.id, 'warn')}
                            >
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Warn
                            </Button>
                          )}
                          
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'suspend')}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Suspend
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

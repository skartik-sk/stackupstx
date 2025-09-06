"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  Trophy,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  TrendingUp,
  Wallet,
  Activity
} from 'lucide-react'

// Mock data - replace with actual blockchain data
const mockStackerData = {
  activeApplications: 5,
  projectsInProgress: 2,
  totalEarned: 45.8,
  stackerScore: 4.7,
  completionRate: 94,
  currentRank: 12
}

const mockApplications = [
  {
    id: 1,
    projectTitle: "DeFi Yield Farming Protocol",
    type: "bounty",
    status: "pending-review",
    reward: 25.5,
    appliedDate: "2024-09-01",
    deadline: "2024-10-15",
    creator: "Stacks Foundation",
    description: "Build a comprehensive yield farming protocol for the Stacks ecosystem"
  },
  {
    id: 2,
    projectTitle: "Cross-chain Bridge Interface",
    type: "project",
    status: "in-progress",
    reward: 40.0,
    appliedDate: "2024-08-15",
    deadline: "2024-11-30",
    creator: "DeFi Labs",
    description: "Create a user-friendly interface for cross-chain asset transfers",
    milestones: [
      { id: 1, title: "Smart Contract Integration", completed: true, amount: 15 },
      { id: 2, title: "Frontend Development", completed: false, amount: 15 },
      { id: 3, title: "Testing & Deployment", completed: false, amount: 10 }
    ],
    progress: 40
  },
  {
    id: 3,
    projectTitle: "NFT Marketplace Optimization",
    type: "bounty",
    status: "awarded",
    reward: 18.3,
    appliedDate: "2024-07-20",
    deadline: "2024-08-30",
    creator: "ArtBlocks",
    description: "Optimize smart contracts for gas efficiency and performance",
    completedDate: "2024-08-25"
  },
  {
    id: 4,
    projectTitle: "Stacks Analytics Dashboard",
    type: "grant",
    status: "not-selected",
    reward: 30.0,
    appliedDate: "2024-08-01",
    deadline: "2024-09-15",
    creator: "Community Grant",
    description: "Build comprehensive analytics for Stacks ecosystem metrics"
  }
]

const mockTransactionHistory = [
  {
    id: 1,
    type: "reward",
    amount: 18.3,
    project: "NFT Marketplace Optimization",
    date: "2024-08-25",
    txHash: "0xabcd...1234"
  },
  {
    id: 2,
    type: "milestone",
    amount: 15.0,
    project: "Cross-chain Bridge Interface",
    date: "2024-08-20",
    txHash: "0xefgh...5678"
  },
  {
    id: 3,
    type: "reward",
    amount: 12.5,
    project: "Smart Contract Audit Tool",
    date: "2024-07-10",
    txHash: "0xijkl...9012"
  }
]

export default function StackerDashboard() {
  const [selectedTab, setSelectedTab] = useState("applications")

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending-review':
        return 'bg-yellow-100 text-yellow-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'awarded':
        return 'bg-green-100 text-green-800'
      case 'not-selected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending-review':
        return <Clock className="h-4 w-4" />
      case 'in-progress':
        return <Activity className="h-4 w-4" />
      case 'awarded':
        return <Trophy className="h-4 w-4" />
      case 'not-selected':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const formatStatus = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Your Mission Control</h1>
          <p className="text-lg text-gray-600">
            Track your progress and watch your hard work pay off
          </p>
        </div>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-[#fc6431]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStackerData.activeApplications}</div>
              <p className="text-xs text-gray-600">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Activity className="h-4 w-4 text-[#fc6431]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStackerData.projectsInProgress}</div>
              <p className="text-xs text-gray-600">
                Projects active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <DollarSign className="h-4 w-4 text-[#fc6431]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStackerData.totalEarned} STX</div>
              <p className="text-xs text-gray-600">
                All time earnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stacker Score</CardTitle>
              <Star className="h-4 w-4 text-[#fc6431]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStackerData.stackerScore}</div>
              <p className="text-xs text-gray-600">
                Rank #{mockStackerData.currentRank} globally
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="progress">Project Progress</TabsTrigger>
            <TabsTrigger value="wallet">Wallet & Earnings</TabsTrigger>
          </TabsList>

          {/* My Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Application History</CardTitle>
                <CardDescription>
                  Track all your bounty and project applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockApplications.map((application) => (
                    <div key={application.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{application.projectTitle}</h3>
                            <Badge variant="outline">{application.type}</Badge>
                            <Badge className={getStatusColor(application.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(application.status)}
                                {formatStatus(application.status)}
                              </div>
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 max-w-2xl">{application.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Creator: {application.creator}</span>
                            <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                            <span>Deadline: {new Date(application.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-lg">{application.reward} STX</div>
                          {application.status === 'awarded' && application.completedDate && (
                            <div className="text-sm text-green-600">
                              Completed: {new Date(application.completedDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress for in-progress projects */}
                      {application.status === 'in-progress' && application.milestones && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Project Progress</h4>
                            <span className="text-sm text-blue-600">{application.progress}% Complete</span>
                          </div>
                          <Progress value={application.progress} className="mb-3" />
                          
                          <div className="space-y-2">
                            {application.milestones.map((milestone) => (
                              <div key={milestone.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  {milestone.completed ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-gray-400" />
                                  )}
                                  <span className={milestone.completed ? 'text-green-700' : 'text-gray-600'}>
                                    {milestone.title}
                                  </span>
                                </div>
                                <span className="font-medium">{milestone.amount} STX</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Project Progress Tab */}
          <TabsContent value="progress" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Your track record as a developer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span>{mockStackerData.completionRate}%</span>
                    </div>
                    <Progress value={mockStackerData.completionRate} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Stacker Score</span>
                      <span>{mockStackerData.stackerScore}/5.0</span>
                    </div>
                    <Progress value={(mockStackerData.stackerScore / 5) * 100} />
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Achievements</h4>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="mr-2">
                        <Trophy className="h-3 w-3 mr-1" />
                        Top 20 Developer
                      </Badge>
                      <Badge variant="secondary" className="mr-2">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Fast Delivery
                      </Badge>
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        Quality Code
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Projects</CardTitle>
                  <CardDescription>Projects you're actively working on</CardDescription>
                </CardHeader>
                <CardContent>
                  {mockApplications
                    .filter(app => app.status === 'in-progress')
                    .map((project) => (
                      <div key={project.id} className="space-y-3">
                        <div>
                          <h4 className="font-medium">{project.projectTitle}</h4>
                          <p className="text-sm text-gray-600">{project.description}</p>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} />
                        </div>

                        <div className="text-sm text-gray-500">
                          Deadline: {new Date(project.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  
                  {mockApplications.filter(app => app.status === 'in-progress').length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No active projects. Apply to bounties to get started!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Wallet & Earnings Tab */}
          <TabsContent value="wallet" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Wallet Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Wallet Overview
                  </CardTitle>
                  <CardDescription>Your STX earnings and balance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-r from-[#fc6431] to-orange-500 text-white rounded-lg">
                    <div className="text-sm opacity-90">Total Earned</div>
                    <div className="text-3xl font-bold">{mockStackerData.totalEarned} STX</div>
                    <div className="text-sm opacity-90">≈ ${(mockStackerData.totalEarned * 1.2).toFixed(2)} USD</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">This Month</div>
                      <div className="text-xl font-bold">18.3 STX</div>
                      <div className="text-xs text-green-600">+15% from last month</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Projects</div>
                      <div className="text-xl font-bold">8</div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction History */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Recent payments and earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTransactionHistory.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-full">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">{tx.project}</div>
                            <div className="text-sm text-gray-600 capitalize">
                              {tx.type} payment
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(tx.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-green-600">+{tx.amount} STX</div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(`https://explorer.stacks.co/txid/${tx.txHash}`, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    View All Transactions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Type definitions
interface Applicant {
  id: number
  name: string
  avatar: string
  stackerScore: number
  githubRepo: string
  proposal: string
  skills: string[]
}

interface Project {
  id: number
  title: string
  description: string
  skills: string[]
  status: string
  applicants: number
  budget: number
  deadline: string
}
import { 
  Users, 
  DollarSign, 
  Clock, 
  Trophy,
  Eye,
  GitBranch,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react'

// Mock data - replace with actual blockchain data
const mockProjectData = {
  totalProjects: 12,
  pendingApplications: 28,
  totalEscrow: 125.8,
  activeProjects: 8,
  completedProjects: 3,
  pausedProjects: 1
}

const mockProjects = [
  {
    id: 1,
    title: "DeFi Yield Farming Protocol",
    type: "bounty",
    status: "live",
    escrowAmount: 25.5,
    applications: 8,
    deadline: "2024-10-15",
    milestones: [
      { id: 1, title: "Smart Contract Development", completed: true, amount: 10 },
      { id: 2, title: "Frontend Integration", completed: false, amount: 10 },
      { id: 3, title: "Testing & Deployment", completed: false, amount: 5.5 }
    ],
    applicants: [
      {
        id: 1,
        name: "Alice Chen",
        avatar: "/api/placeholder/40/40",
        stackerScore: 4.8,
        githubRepo: "https://github.com/alice/defi-protocol",
        proposal: "Experienced DeFi developer with 3+ years in Clarity. Previous work includes...",
        skills: ["Clarity", "DeFi", "React"]
      },
      {
        id: 2,
        name: "Bob Rodriguez",
        avatar: "/api/placeholder/40/40",
        stackerScore: 4.5,
        githubRepo: "https://github.com/bob/farming-solution",
        proposal: "Full-stack developer specializing in yield farming protocols...",
        skills: ["Stacks", "TypeScript", "Smart Contracts"]
      }
    ]
  },
  {
    id: 2,
    title: "NFT Marketplace for Stacks",
    type: "project",
    status: "completed",
    escrowAmount: 45.0,
    applications: 15,
    deadline: "2024-09-30",
    winner: "Charlie Davis",
    milestones: [
      { id: 1, title: "Core Marketplace Logic", completed: true, amount: 20 },
      { id: 2, title: "User Interface", completed: true, amount: 15 },
      { id: 3, title: "Final Testing", completed: true, amount: 10 }
    ]
  }
]

export default function CreatorDashboard() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showWinnerModal, setShowWinnerModal] = useState(false)
  const [selectedWinner, setSelectedWinner] = useState<Applicant | null>(null)

  const handleSelectWinner = async (projectId: number, applicantId: number) => {
    // Here you would integrate with Stacks.js to call the smart contract
    console.log("Selecting winner for project:", projectId, "applicant:", applicantId)
    
    // Mock transaction call to smart contract
    try {
      // const response = await callContractFunction({
      //   contractAddress: 'your-contract-address',
      //   contractName: 'escrow-contract',
      //   functionName: 'approve-winner',
      //   functionArgs: [uintCV(projectId), uintCV(applicantId)]
      // })
      
      setShowWinnerModal(false)
      // Show success notification
    } catch (error) {
      console.error("Transaction failed:", error)
    }
  }

  const approveMilestone = async (projectId: number, milestoneId: number) => {
    // Integrate with smart contract to approve milestone
    console.log("Approving milestone:", milestoneId, "for project:", projectId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-orange-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Your Command Center</h1>
          <p className="text-lg text-gray-600">
            Total control over your bounties, projects, and grants
          </p>
        </div>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Projects</CardTitle>
              <Trophy className="h-4 w-4 text-[#fc6431]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockProjectData.activeProjects}</div>
              <p className="text-xs text-gray-600">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <Users className="h-4 w-4 text-[#fc6431]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockProjectData.pendingApplications}</div>
              <p className="text-xs text-gray-600">
                Awaiting your review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total in Escrow</CardTitle>
              <DollarSign className="h-4 w-4 text-[#fc6431]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockProjectData.totalEscrow} STX</div>
              <p className="text-xs text-gray-600">
                Across all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-[#fc6431]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-gray-600">
                Projects delivered on time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* My Projects Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">My Projects</CardTitle>
            <CardDescription>
              Manage all your bounties, grants, and projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProjects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      <Badge 
                        variant={project.status === 'live' ? 'default' : 
                                project.status === 'completed' ? 'secondary' : 'outline'}
                        className={project.status === 'live' ? 'bg-[#fc6431] hover:bg-[#e55428]' : ''}
                      >
                        {project.status}
                      </Badge>
                      <Badge variant="outline">{project.type}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{project.escrowAmount} STX</div>
                      <div className="text-sm text-gray-600">{project.applications} applications</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {/* Project Details */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Deadline: {new Date(project.deadline).toLocaleDateString()}
                      </p>
                      {project.status === 'live' && (
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                className="bg-[#fc6431] hover:bg-[#e55428]"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Applications
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Applications for {project.title}</DialogTitle>
                                <DialogDescription>
                                  Review and select the winner for this project
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4 max-h-96 overflow-y-auto">
                                {project.applicants?.map((applicant) => (
                                  <div key={applicant.id} className="border rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center gap-3">
                                        <Avatar>
                                          <AvatarImage src={applicant.avatar} />
                                          <AvatarFallback>{applicant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h4 className="font-semibold">{applicant.name}</h4>
                                          <div className="flex items-center gap-2">
                                            <Star className="h-4 w-4 text-yellow-500" />
                                            <span className="text-sm">{applicant.stackerScore} Stacker Score</span>
                                          </div>
                                          <div className="flex gap-1 mt-1">
                                            {applicant.skills.map((skill) => (
                                              <Badge key={skill} variant="outline" className="text-xs">
                                                {skill}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => window.open(applicant.githubRepo, '_blank')}
                                        >
                                          <GitBranch className="h-4 w-4 mr-2" />
                                          View Code
                                        </Button>
                                        <Button 
                                          size="sm"
                                          className="bg-[#fc6431] hover:bg-[#e55428]"
                                          onClick={() => {
                                            setSelectedWinner(applicant)
                                            setShowWinnerModal(true)
                                          }}
                                        >
                                          Select Winner
                                        </Button>
                                      </div>
                                    </div>
                                    <p className="mt-3 text-sm text-gray-600">
                                      {applicant.proposal}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>

                    {/* Milestones */}
                    <div className="md:col-span-2">
                      <h4 className="font-medium mb-2">Milestones</h4>
                      <div className="space-y-2">
                        {project.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              {milestone.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-gray-400" />
                              )}
                              <span className="text-sm">{milestone.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{milestone.amount} STX</span>
                              {!milestone.completed && project.status === 'live' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => approveMilestone(project.id, milestone.id)}
                                >
                                  Approve
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Winner Selection Confirmation Modal */}
        <Dialog open={showWinnerModal} onOpenChange={setShowWinnerModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Winner Selection</DialogTitle>
              <DialogDescription>
                You are about to select {selectedWinner?.name} as the winner for this project.
                This action will trigger a blockchain transaction to release the funds.
              </DialogDescription>
            </DialogHeader>
            
            {selectedWinner && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded">
                  <Avatar>
                    <AvatarImage src={selectedWinner.avatar} />
                    <AvatarFallback>{selectedWinner.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{selectedWinner.name}</h4>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{selectedWinner.stackerScore} Stacker Score</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 p-4 rounded">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-orange-800">Transaction Details</span>
                  </div>
                  <p className="text-sm text-orange-700 mt-2">
                    This will call the <code>approve-winner</code> function on the escrow smart contract.
                    Gas fees will apply.
                  </p>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowWinnerModal(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-[#fc6431] hover:bg-[#e55428]"
                    onClick={() => {
                      if (selectedProject?.id && selectedWinner?.id) {
                        handleSelectWinner(selectedProject.id, selectedWinner.id)
                      }
                    }}
                  >
                    Confirm & Execute Transaction
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

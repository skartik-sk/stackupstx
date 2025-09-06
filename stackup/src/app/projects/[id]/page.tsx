"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Clock, CheckCircle, AlertCircle, Github, ExternalLink, Heart, Share2, Flag } from "lucide-react"

export default function ProjectDetailPage() {
  const [isApplying, setIsApplying] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const project = {
    id: "1",
    title: "Stacks DeFi Analytics Platform",
    description:
      "A comprehensive analytics dashboard for tracking DeFi protocols, liquidity pools, and yield farming opportunities across the Stacks ecosystem.",
    category: "DeFi",
    fundingGoal: 50000,
    currentFunding: 32500,
    backers: 47,
    timeLeft: "23 days",
    creator: {
      name: "DeFi Builders",
      avatar: "/defi-team.png",
      verified: true,
      reputation: 4.9,
      completedProjects: 8,
    },
    milestones: [
      {
        title: "MVP Development",
        description: "Core dashboard with basic analytics",
        amount: 15000,
        status: "completed",
        dueDate: "2024-01-15",
        completedDate: "2024-01-12",
      },
      {
        title: "Advanced Features",
        description: "Portfolio tracking and yield optimization",
        amount: 20000,
        status: "in-progress",
        dueDate: "2024-02-28",
        progress: 65,
      },
      {
        title: "Mobile App",
        description: "iOS and Android applications",
        amount: 15000,
        status: "pending",
        dueDate: "2024-04-15",
      },
    ],
    techStack: ["React", "TypeScript", "Stacks.js", "Clarity", "Node.js", "PostgreSQL"],
    features: [
      "Real-time DeFi protocol analytics",
      "Portfolio tracking and management",
      "Yield farming opportunity scanner",
      "Risk assessment tools",
      "Mobile-responsive design",
      "API for third-party integrations",
    ],
    updates: [
      {
        date: "2024-01-20",
        title: "Milestone 1 Completed!",
        content:
          "We've successfully delivered the MVP with core analytics features. The dashboard is now live and tracking 15+ DeFi protocols.",
      },
      {
        date: "2024-01-15",
        title: "Beta Testing Phase",
        content: "Started beta testing with 50 selected users. Initial feedback has been overwhelmingly positive!",
      },
    ],
  }

  const fundingProgress = (project.currentFunding / project.fundingGoal) * 100

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>Projects</span>
            <span>/</span>
            <span>{project.category}</span>
            <span>/</span>
            <span className="text-foreground">{project.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary">{project.category}</Badge>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Active Funding
                </Badge>
              </div>

              <h1 className="text-4xl font-bold mb-4 text-balance">{project.title}</h1>
              <p className="text-lg text-muted-foreground mb-6 text-pretty">{project.description}</p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={project.creator.avatar || "/placeholder.svg"} alt={project.creator.name} />
                    <AvatarFallback>DB</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{project.creator.name}</span>
                      {project.creator.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {project.creator.reputation}/5 • {project.creator.completedProjects} projects
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="px-8">
                      Fund This Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Fund Project</DialogTitle>
                      <DialogDescription>Support this project by contributing STX tokens</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="amount">Amount (STX)</Label>
                        <Input id="amount" placeholder="Enter amount" />
                      </div>
                      <div>
                        <Label htmlFor="message">Message (optional)</Label>
                        <Textarea id="message" placeholder="Leave a message for the team" />
                      </div>
                      <Button className="w-full">Confirm Funding</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="lg">
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="lg">
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </Button>
              </div>
            </div>

            {/* Funding Card */}
            <Card className="lg:w-96">
              <CardHeader>
                <CardTitle>Funding Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold">{project.currentFunding.toLocaleString()} STX</span>
                    <span className="text-muted-foreground">of {project.fundingGoal.toLocaleString()} STX</span>
                  </div>
                  <Progress value={fundingProgress} className="mb-2" />
                  <div className="text-sm text-muted-foreground">{Math.round(fundingProgress)}% funded</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{project.backers}</div>
                    <div className="text-sm text-muted-foreground">Backers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{project.timeLeft}</div>
                    <div className="text-sm text-muted-foreground">Remaining</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Recent Backers</h4>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback>U{i}</AvatarFallback>
                          </Avatar>
                          <span>User{i}</span>
                        </div>
                        <span className="text-muted-foreground">{500 * i} STX</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Project Details Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="backers">Backers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Description</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none">
                    <p>
                      The Stacks DeFi Analytics Platform aims to become the go-to destination for DeFi users and
                      developers in the Stacks ecosystem. Our comprehensive dashboard will provide real-time insights
                      into protocol performance, liquidity metrics, and yield opportunities.
                    </p>
                    <h4>Key Features:</h4>
                    <ul>
                      {project.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                    <h4>Why This Matters:</h4>
                    <p>
                      As the Stacks DeFi ecosystem grows, users need better tools to navigate the complex landscape of
                      protocols, yields, and risks. Our platform will democratize access to sophisticated analytics
                      previously only available to institutional players.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Technical Stack</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, index) => (
                        <Badge key={index} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Category</span>
                      <span className="font-medium">{project.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created</span>
                      <span className="font-medium">Dec 15, 2023</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration</span>
                      <span className="font-medium">4 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Level</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Medium
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub Repository
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Documentation
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4">
            {project.milestones.map((milestone, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {milestone.status === "completed" ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : milestone.status === "in-progress" ? (
                        <Clock className="w-6 h-6 text-blue-600" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{milestone.title}</h3>
                        <div className="text-right">
                          <div className="font-medium">{milestone.amount.toLocaleString()} STX</div>
                          <div className="text-sm text-muted-foreground">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{milestone.description}</p>

                      {milestone.status === "in-progress" && milestone.progress && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{milestone.progress}%</span>
                          </div>
                          <Progress value={milestone.progress} />
                        </div>
                      )}

                      {milestone.status === "completed" && milestone.completedDate && (
                        <div className="text-sm text-green-600">
                          Completed on {new Date(milestone.completedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="updates" className="space-y-4">
            {project.updates.map((update, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{update.title}</CardTitle>
                    <span className="text-sm text-muted-foreground">{new Date(update.date).toLocaleDateString()}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{update.content}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={project.creator.avatar || "/placeholder.svg"} alt={project.creator.name} />
                    <AvatarFallback>DB</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{project.creator.name}</h3>
                      {project.creator.verified && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                    <p className="text-muted-foreground mb-2">Lead Developer & Project Creator</p>
                    <div className="flex gap-4 text-sm">
                      <span>{project.creator.reputation}/5 rating</span>
                      <span>{project.creator.completedProjects} completed projects</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Backers ({project.backers})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>U{i + 1}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Backer {i + 1}</div>
                          <div className="text-sm text-muted-foreground">
                            {Math.floor(Math.random() * 30) + 1} days ago
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{(Math.random() * 2000 + 500).toFixed(0)} STX</div>
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

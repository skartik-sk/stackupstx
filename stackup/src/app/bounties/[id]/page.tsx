"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, CheckCircle, Heart, Share2, Flag, Trophy, Zap } from "lucide-react"

export default function BountyDetailPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [applicationData, setApplicationData] = useState({
    approach: "",
    timeline: "",
    experience: "",
    portfolio: "",
    questions: "",
  })

  const bounty = {
    id: "1",
    title: "Smart Contract Security Audit Tool",
    description:
      "Develop an automated security audit tool for Clarity smart contracts that can detect common vulnerabilities and provide detailed reports with recommendations.",
    category: "Security",
    difficulty: "Expert",
    reward: 5000,
    currency: "STX",
    deadline: "2024-02-28",
    applicants: 12,
    status: "open",
    creator: {
      name: "SecureStacks",
      avatar: "/security-company-logo.png",
      verified: true,
      reputation: 4.9,
      completedBounties: 15,
    },
    requirements: [
      "Experience with smart contract security",
      "Knowledge of Clarity programming language",
      "Previous audit tool development",
      "Understanding of common vulnerabilities",
      "Ability to create comprehensive reports",
    ],
    deliverables: [
      "Automated scanning engine",
      "Web-based dashboard interface",
      "Detailed vulnerability reports",
      "Integration with popular IDEs",
      "Documentation and user guide",
    ],
    techStack: ["Clarity", "TypeScript", "React", "Node.js", "Security Analysis"],
    skills: ["Smart Contract Security", "Static Analysis", "Web Development", "Clarity", "Vulnerability Assessment"],
    timeline: "6-8 weeks",
    applications: [
      {
        id: "1",
        applicant: {
          name: "Alex Security",
          avatar: "/developer-avatar.png",
          reputation: 4.8,
          completedBounties: 8,
        },
        appliedDate: "2024-01-15",
        status: "pending",
        proposal:
          "I have 5+ years of experience in smart contract security and have built similar tools for Ethereum...",
      },
      {
        id: "2",
        applicant: {
          name: "CryptoAuditor",
          avatar: "/auditor-avatar.jpg",
          reputation: 4.9,
          completedBounties: 12,
        },
        appliedDate: "2024-01-14",
        status: "shortlisted",
        proposal:
          "As a certified security auditor with extensive Clarity experience, I can deliver a comprehensive solution...",
      },
    ],
    similarBounties: [
      {
        title: "DeFi Protocol Audit",
        reward: 3500,
        difficulty: "Expert",
        status: "completed",
      },
      {
        title: "NFT Contract Security Review",
        reward: 2000,
        difficulty: "Intermediate",
        status: "in-progress",
      },
    ],
  }

  const handleApplicationSubmit = () => {
    console.log("Application submitted:", applicationData)
    // Handle application submission
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Bounty Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>Bounties</span>
            <span>/</span>
            <span>{bounty.category}</span>
            <span>/</span>
            <span className="text-foreground">{bounty.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary">{bounty.category}</Badge>
                <Badge className={getDifficultyColor(bounty.difficulty)}>
                  <Zap className="w-3 h-3 mr-1" />
                  {bounty.difficulty}
                </Badge>
                <Badge variant="outline" className={getStatusColor(bounty.status)}>
                  {bounty.status === "open" && <Clock className="w-3 h-3 mr-1" />}
                  {bounty.status.charAt(0).toUpperCase() + bounty.status.slice(1)}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold mb-4 text-balance">{bounty.title}</h1>
              <p className="text-lg text-muted-foreground mb-6 text-pretty">{bounty.description}</p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={bounty.creator.avatar || "/placeholder.svg"} alt={bounty.creator.name} />
                    <AvatarFallback>SS</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{bounty.creator.name}</span>
                      {bounty.creator.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {bounty.creator.reputation}/5 • {bounty.creator.completedBounties} bounties posted
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="px-8">
                      Apply for Bounty
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Apply for {bounty.title}</DialogTitle>
                      <DialogDescription>Submit your application with your approach and timeline</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="approach">Your Approach *</Label>
                        <Textarea
                          id="approach"
                          placeholder="Describe your technical approach and methodology"
                          className="min-h-[120px]"
                          value={applicationData.approach}
                          onChange={(e) => setApplicationData({ ...applicationData, approach: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="timeline">Estimated Timeline *</Label>
                        <Select
                          value={applicationData.timeline}
                          onValueChange={(value) => setApplicationData({ ...applicationData, timeline: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-2">1-2 weeks</SelectItem>
                            <SelectItem value="2-4">2-4 weeks</SelectItem>
                            <SelectItem value="4-6">4-6 weeks</SelectItem>
                            <SelectItem value="6-8">6-8 weeks</SelectItem>
                            <SelectItem value="8+">8+ weeks</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="experience">Relevant Experience *</Label>
                        <Textarea
                          id="experience"
                          placeholder="Describe your relevant experience and qualifications"
                          className="min-h-[100px]"
                          value={applicationData.experience}
                          onChange={(e) => setApplicationData({ ...applicationData, experience: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="portfolio">Portfolio/Previous Work</Label>
                        <Textarea
                          id="portfolio"
                          placeholder="Links to relevant projects, GitHub repos, or previous work"
                          className="min-h-[80px]"
                          value={applicationData.portfolio}
                          onChange={(e) => setApplicationData({ ...applicationData, portfolio: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="questions">Questions/Clarifications</Label>
                        <Textarea
                          id="questions"
                          placeholder="Any questions about the requirements or scope?"
                          className="min-h-[80px]"
                          value={applicationData.questions}
                          onChange={(e) => setApplicationData({ ...applicationData, questions: e.target.value })}
                        />
                      </div>

                      <Button
                        className="w-full"
                        onClick={handleApplicationSubmit}
                        disabled={!applicationData.approach || !applicationData.timeline || !applicationData.experience}
                      >
                        Submit Application
                      </Button>
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

            {/* Bounty Info Card */}
            <Card className="lg:w-96">
              <CardHeader>
                <CardTitle>Bounty Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span className="text-3xl font-bold text-primary">
                      {bounty.reward.toLocaleString()} {bounty.currency}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">Bounty reward</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{bounty.applicants}</div>
                    <div className="text-sm text-muted-foreground">Applicants</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{bounty.timeline}</div>
                    <div className="text-sm text-muted-foreground">Timeline</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Deadline</span>
                  </div>
                  <div className="text-lg font-semibold">{new Date(bounty.deadline).toLocaleDateString()}</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.ceil((new Date(bounty.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}{" "}
                    days remaining
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {bounty.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {bounty.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{bounty.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Similar Bounties</h4>
                  <div className="space-y-2">
                    {bounty.similarBounties.map((similar, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-medium text-sm">{similar.title}</h5>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(similar.status)}`}>
                            {similar.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{similar.reward} STX</span>
                          <Badge variant="secondary" className={`text-xs ${getDifficultyColor(similar.difficulty)}`}>
                            {similar.difficulty}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bounty Details Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="discussion">Discussion</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bounty Description</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none">
                    <p>
                      We're looking for an experienced developer to create a comprehensive security audit tool
                      specifically designed for Clarity smart contracts. This tool should help developers identify
                      potential vulnerabilities before deployment.
                    </p>
                    <h4>Key Features Needed:</h4>
                    <ul>
                      <li>Static code analysis for common vulnerability patterns</li>
                      <li>Integration with popular development environments</li>
                      <li>Detailed reporting with severity levels and recommendations</li>
                      <li>Support for custom rule definitions</li>
                      <li>Batch processing capabilities for multiple contracts</li>
                    </ul>
                    <h4>Success Criteria:</h4>
                    <p>
                      The tool should be able to detect at least 15 common vulnerability types, provide actionable
                      recommendations, and have a user-friendly interface. Performance should allow scanning of large
                      contracts within reasonable time limits.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Technical Stack</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {bounty.techStack.map((tech, index) => (
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
                    <CardTitle>Bounty Creator</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={bounty.creator.avatar || "/placeholder.svg"} alt={bounty.creator.name} />
                        <AvatarFallback>SS</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{bounty.creator.name}</span>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="text-sm text-muted-foreground">Verified Creator</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Reputation</span>
                        <span className="font-medium">{bounty.creator.reputation}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bounties Posted</span>
                        <span className="font-medium">{bounty.creator.completedBounties}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Application Process</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        1
                      </div>
                      <span>Submit application</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        2
                      </div>
                      <span>Creator reviews proposals</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        3
                      </div>
                      <span>Selected applicant starts work</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        4
                      </div>
                      <span>Submit deliverables</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        5
                      </div>
                      <span>Receive payment</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {bounty.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deliverables" className="space-y-4">
            {bounty.deliverables.map((deliverable, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{deliverable}</h3>
                      <p className="text-muted-foreground text-sm">
                        Detailed specifications and acceptance criteria will be provided upon selection.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Applications ({bounty.applications.length})</h3>
              <Badge variant="secondary">
                {bounty.applications.filter((app) => app.status === "shortlisted").length} shortlisted
              </Badge>
            </div>
            {bounty.applications.map((application) => (
              <Card key={application.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={application.applicant.avatar || "/placeholder.svg"}
                          alt={application.applicant.name}
                        />
                        <AvatarFallback>{application.applicant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{application.applicant.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {application.applicant.reputation}/5 • {application.applicant.completedBounties} bounties
                          completed
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={application.status === "shortlisted" ? "default" : "secondary"}>
                        {application.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{application.proposal.substring(0, 150)}...</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="discussion" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Discussion</CardTitle>
                <CardDescription>Ask questions and discuss requirements with the bounty creator</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">John Developer</span>
                        <span className="text-sm text-muted-foreground ml-2">2 days ago</span>
                      </div>
                    </div>
                    <p className="text-sm">
                      What specific vulnerability types should the tool prioritize? Are there any existing tools we
                      should integrate with or avoid competing against?
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={bounty.creator.avatar || "/placeholder.svg"} alt={bounty.creator.name} />
                        <AvatarFallback>SS</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">{bounty.creator.name}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Creator
                        </Badge>
                        <span className="text-sm text-muted-foreground ml-2">1 day ago</span>
                      </div>
                    </div>
                    <p className="text-sm">
                      Great question! Priority should be on reentrancy, integer overflow/underflow, and access control
                      vulnerabilities. We want this to complement existing tools, not replace them entirely.
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <Textarea placeholder="Ask a question or share your thoughts..." className="mb-3" />
                    <Button>Post Comment</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

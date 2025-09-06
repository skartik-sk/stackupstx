"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Flag,
  Lightbulb,
  Brain,
  Target,
  Users,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react"

export default function IdeaDetailPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null)
  const [comment, setComment] = useState("")

  const idea = {
    id: "1",
    title: "Decentralized Code Review Platform",
    description:
      "A blockchain-based platform where developers can submit code for peer review, earn tokens for quality reviews, and build reputation through community validation.",
    category: "Developer Tools",
    submitter: {
      name: "Alice Developer",
      avatar: "/alice-avatar.png",
      verified: true,
      reputation: 4.7,
      ideasSubmitted: 12,
    },
    submittedDate: "2024-01-20",
    votes: {
      up: 156,
      down: 23,
      total: 179,
    },
    aiAnalysis: {
      difficultyScore: 7.5,
      innovationScore: 8.2,
      feasibilityScore: 6.8,
      marketPotentialScore: 7.9,
      overallScore: 7.6,
      confidence: 85,
      duplicateRisk: "Low",
      estimatedTimeframe: "6-9 months",
      estimatedCost: "25,000 - 40,000 STX",
    },
    requiredSkills: [
      "Smart Contract Development",
      "Web3 Integration",
      "React/Frontend",
      "Node.js/Backend",
      "Cryptography",
      "Game Theory",
    ],
    similarIdeas: [
      {
        title: "Peer Review DAO",
        similarity: 78,
        status: "implemented",
      },
      {
        title: "Code Quality Marketplace",
        similarity: 65,
        status: "in-development",
      },
    ],
    potentialChallenges: [
      "Incentive alignment for quality reviews",
      "Preventing gaming of the reputation system",
      "Scaling review throughput",
      "Ensuring code privacy when needed",
    ],
    marketOpportunities: [
      "Growing demand for code quality assurance",
      "Remote development team coordination",
      "Open source project maintenance",
      "Enterprise code review workflows",
    ],
    comments: [
      {
        id: "1",
        author: {
          name: "Bob Reviewer",
          avatar: "/bob-avatar.png",
          reputation: 4.5,
        },
        content:
          "This could revolutionize how we approach code quality in decentralized teams. The tokenomics would need careful design to prevent spam reviews.",
        timestamp: "2024-01-21T10:30:00Z",
        votes: { up: 12, down: 1 },
      },
      {
        id: "2",
        author: {
          name: "Carol Architect",
          avatar: "/carol-avatar.png",
          reputation: 4.8,
        },
        content:
          "I love the concept! Have you considered integration with existing Git workflows? That could be a key adoption factor.",
        timestamp: "2024-01-21T14:15:00Z",
        votes: { up: 8, down: 0 },
      },
    ],
    relatedProjects: [
      {
        title: "GitCoin Code Review Bounties",
        type: "bounty",
        reward: 2500,
        status: "active",
      },
      {
        title: "Decentralized Git Protocol",
        type: "project",
        funding: 15000,
        status: "funded",
      },
    ],
  }

  const handleVote = (voteType: "up" | "down") => {
    if (userVote === voteType) {
      setUserVote(null)
    } else {
      setUserVote(voteType)
    }
  }

  const handleCommentSubmit = () => {
    console.log("Comment submitted:", comment)
    setComment("")
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 8) return "bg-green-100"
    if (score >= 6) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Idea Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>Ideas</span>
            <span>/</span>
            <span>{idea.category}</span>
            <span>/</span>
            <span className="text-foreground">{idea.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary">{idea.category}</Badge>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Community Idea
                </Badge>
                <Badge
                  variant="outline"
                  className={`${getScoreBg(idea.aiAnalysis.overallScore)} ${getScoreColor(idea.aiAnalysis.overallScore)} border-current`}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI Score: {idea.aiAnalysis.overallScore}/10
                </Badge>
              </div>

              <h1 className="text-4xl font-bold mb-4 text-balance">{idea.title}</h1>
              <p className="text-lg text-muted-foreground mb-6 text-pretty">{idea.description}</p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={idea.submitter.avatar || "/placeholder.svg"} alt={idea.submitter.name} />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{idea.submitter.name}</span>
                      {idea.submitter.verified && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {idea.submitter.reputation}/5 • {idea.submitter.ideasSubmitted} ideas submitted
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Submitted {new Date(idea.submittedDate).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={userVote === "up" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVote("up")}
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {idea.votes.up + (userVote === "up" ? 1 : 0)}
                  </Button>
                  <Button
                    variant={userVote === "down" ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => handleVote("down")}
                    className="flex items-center gap-2"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    {idea.votes.down + (userVote === "down" ? 1 : 0)}
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {idea.comments.length} Comments
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </Button>
              </div>
            </div>

            {/* AI Analysis Card */}
            <Card className="lg:w-96">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Analysis
                </CardTitle>
                <CardDescription>Automated analysis with {idea.aiAnalysis.confidence}% confidence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Difficulty</span>
                    <div className="flex items-center gap-2">
                      <Progress value={idea.aiAnalysis.difficultyScore * 10} className="w-16 h-2" />
                      <span className={`text-sm font-medium ${getScoreColor(idea.aiAnalysis.difficultyScore)}`}>
                        {idea.aiAnalysis.difficultyScore}/10
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Innovation</span>
                    <div className="flex items-center gap-2">
                      <Progress value={idea.aiAnalysis.innovationScore * 10} className="w-16 h-2" />
                      <span className={`text-sm font-medium ${getScoreColor(idea.aiAnalysis.innovationScore)}`}>
                        {idea.aiAnalysis.innovationScore}/10
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Feasibility</span>
                    <div className="flex items-center gap-2">
                      <Progress value={idea.aiAnalysis.feasibilityScore * 10} className="w-16 h-2" />
                      <span className={`text-sm font-medium ${getScoreColor(idea.aiAnalysis.feasibilityScore)}`}>
                        {idea.aiAnalysis.feasibilityScore}/10
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Market Potential</span>
                    <div className="flex items-center gap-2">
                      <Progress value={idea.aiAnalysis.marketPotentialScore * 10} className="w-16 h-2" />
                      <span className={`text-sm font-medium ${getScoreColor(idea.aiAnalysis.marketPotentialScore)}`}>
                        {idea.aiAnalysis.marketPotentialScore}/10
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Duplicate Risk</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {idea.aiAnalysis.duplicateRisk}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Est. Timeframe</span>
                    <span className="text-sm font-medium">{idea.aiAnalysis.estimatedTimeframe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Est. Cost</span>
                    <span className="text-sm font-medium">{idea.aiAnalysis.estimatedCost}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {idea.requiredSkills.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {idea.requiredSkills.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{idea.requiredSkills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Idea Details Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="similar">Similar Ideas</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="related">Related</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Description</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none">
                    <p>
                      The decentralized code review platform would leverage blockchain technology to create a trustless
                      system for peer code review. Developers could submit code snippets, functions, or entire projects
                      for community review.
                    </p>
                    <h4>Core Features:</h4>
                    <ul>
                      <li>Anonymous or pseudonymous code submission</li>
                      <li>Token-based incentive system for reviewers</li>
                      <li>Reputation scoring based on review quality</li>
                      <li>Integration with popular version control systems</li>
                      <li>Automated vulnerability detection</li>
                      <li>Collaborative improvement suggestions</li>
                    </ul>
                    <h4>Value Proposition:</h4>
                    <p>
                      This platform would address the growing need for code quality assurance in decentralized
                      development teams, while creating economic incentives for thorough, constructive reviews.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Implementation Approach</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Phase 1: MVP Development</h4>
                        <p className="text-sm text-muted-foreground">
                          Basic review submission and voting system with simple token rewards
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Phase 2: Advanced Features</h4>
                        <p className="text-sm text-muted-foreground">
                          Reputation system, automated analysis, and Git integration
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Phase 3: Enterprise Features</h4>
                        <p className="text-sm text-muted-foreground">
                          Private review pools, advanced analytics, and team management
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Overall Rating</span>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= 4 ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">4.2/5</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Upvotes</span>
                          <span className="font-medium text-green-600">{idea.votes.up}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Downvotes</span>
                          <span className="font-medium text-red-600">{idea.votes.down}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Engagement</span>
                          <span className="font-medium">{idea.comments.length} comments</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full">
                      <Target className="w-4 h-4 mr-2" />
                      Convert to Project
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Users className="w-4 h-4 mr-2" />
                      Find Collaborators
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Create Bounty
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Potential Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {idea.potentialChallenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Market Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {idea.marketOpportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Technical Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {idea.requiredSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Estimated Resources</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Development Time</span>
                        <span className="font-medium">{idea.aiAnalysis.estimatedTimeframe}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Budget</span>
                        <span className="font-medium">{idea.aiAnalysis.estimatedCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Team Size</span>
                        <span className="font-medium">3-5 developers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="similar" className="space-y-4">
            {idea.similarIdeas.map((similar, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{similar.title}</h3>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{similar.similarity}% similar</Badge>
                      <Badge variant={similar.status === "implemented" ? "default" : "secondary"}>
                        {similar.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This idea shares core concepts but has different implementation approaches and target markets.
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Discussion ({idea.comments.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {idea.comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{comment.author.name}</span>
                          <span className="text-sm text-muted-foreground">{comment.author.reputation}/5</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm mb-3">{comment.content}</p>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {comment.votes.up}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <ThumbsDown className="w-3 h-3 mr-1" />
                            {comment.votes.down}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <Textarea
                    placeholder="Share your thoughts on this idea..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mb-3"
                  />
                  <Button onClick={handleCommentSubmit} disabled={!comment.trim()}>
                    Post Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="related" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Related Projects & Bounties</CardTitle>
                <CardDescription>Existing initiatives that might be relevant to this idea</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {idea.relatedProjects.map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{project.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {project.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {project.type === "bounty" ? `${project.reward} STX` : `${project.funding} STX`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {project.type === "bounty" ? "Reward" : "Funding"}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

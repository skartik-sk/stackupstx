import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, MessageCircle, TrendingUp, Sparkles, Brain, Target } from "lucide-react"

const mockIdeas = [
  {
    id: 1,
    title: "Decentralized Identity Verification for Stacks",
    description:
      "A comprehensive identity verification system built on Stacks that allows users to verify their identity once and use it across multiple dApps without compromising privacy.",
    author: {
      name: "Alice Johnson",
      avatar: "/alice-avatar.png",
      verified: true,
    },
    category: "Infrastructure",
    aiAnalysis: {
      difficulty: "Advanced",
      difficultyColor: "bg-red-500",
      feasibilityScore: 78,
      innovationScore: 92,
      impactScore: 85,
      marketReadiness: 65,
      similarIdeas: 2,
      estimatedTimeframe: "8-12 months",
      requiredSkills: ["Clarity", "Cryptography", "Frontend Development"],
    },
    communityMetrics: {
      upvotes: 156,
      comments: 23,
      views: 1240,
      trending: true,
    },
    tags: ["Identity", "Privacy", "Infrastructure", "dApps"],
    status: "AI Analyzed",
    submittedAt: "2 days ago",
  },
  {
    id: 2,
    title: "Cross-Chain NFT Bridge for Bitcoin-Stacks",
    description:
      "Enable seamless transfer of NFTs between Bitcoin ordinals and Stacks blockchain, creating a unified NFT ecosystem with enhanced liquidity and utility.",
    author: {
      name: "Bob Chen",
      avatar: "/bob-avatar.png",
      verified: false,
    },
    category: "NFT & Gaming",
    aiAnalysis: {
      difficulty: "Expert",
      difficultyColor: "bg-purple-500",
      feasibilityScore: 45,
      innovationScore: 95,
      impactScore: 88,
      marketReadiness: 40,
      similarIdeas: 1,
      estimatedTimeframe: "12-18 months",
      requiredSkills: ["Bitcoin Protocol", "Clarity", "Cryptography", "Bridge Architecture"],
    },
    communityMetrics: {
      upvotes: 89,
      comments: 34,
      views: 890,
      trending: false,
    },
    tags: ["NFT", "Cross-Chain", "Bitcoin", "Bridge"],
    status: "AI Analyzed",
    submittedAt: "5 days ago",
  },
  {
    id: 3,
    title: "AI-Powered DeFi Yield Optimizer",
    description:
      "Smart contract system that automatically optimizes yield farming strategies across Stacks DeFi protocols using machine learning algorithms.",
    author: {
      name: "Carol Davis",
      avatar: "/carol-avatar.png",
      verified: true,
    },
    category: "DeFi",
    aiAnalysis: {
      difficulty: "Intermediate",
      difficultyColor: "bg-yellow-500",
      feasibilityScore: 82,
      innovationScore: 76,
      impactScore: 79,
      marketReadiness: 85,
      similarIdeas: 4,
      estimatedTimeframe: "4-6 months",
      requiredSkills: ["DeFi Protocols", "Smart Contracts", "Machine Learning", "Data Analysis"],
    },
    communityMetrics: {
      upvotes: 234,
      comments: 45,
      views: 1890,
      trending: true,
    },
    tags: ["DeFi", "AI", "Yield Farming", "Optimization"],
    status: "In Development",
    submittedAt: "1 week ago",
  },
]

export function IdeasList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">284 Ideas Found</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Button variant="ghost" size="sm">
            AI Score
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {mockIdeas.map((idea) => (
          <Card key={idea.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-balance">{idea.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {idea.status}
                    </Badge>
                    {idea.communityMetrics.trending && (
                      <Badge variant="outline" className="text-xs text-primary border-primary">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-pretty">{idea.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Author */}
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={idea.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{idea.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{idea.author.name}</span>
                  {idea.author.verified && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      ✓
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">• {idea.submittedAt}</span>
                </div>

                {/* AI Analysis */}
                <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">AI Analysis</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Brain className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Innovation</span>
                      </div>
                      <div className="text-lg font-bold text-primary">{idea.aiAnalysis.innovationScore}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Target className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Impact</span>
                      </div>
                      <div className="text-lg font-bold text-primary">{idea.aiAnalysis.impactScore}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Feasibility</div>
                      <div className="text-lg font-bold text-primary">{idea.aiAnalysis.feasibilityScore}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${idea.aiAnalysis.difficultyColor}`} />
                        <span className="text-xs text-muted-foreground">Difficulty</span>
                      </div>
                      <div className="text-sm font-medium">{idea.aiAnalysis.difficulty}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Est. Timeline: {idea.aiAnalysis.estimatedTimeframe}</span>
                    <span>{idea.aiAnalysis.similarIdeas} similar ideas found</span>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Required Skills (AI Suggested)</h4>
                  <div className="flex flex-wrap gap-2">
                    {idea.aiAnalysis.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {idea.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Community Metrics */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{idea.communityMetrics.upvotes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{idea.communityMetrics.comments}</span>
                    </div>
                    <span>{idea.communityMetrics.views} views</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {idea.category}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Upvote
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Comment
                    </Button>
                  </div>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-8">
        <Button variant="outline" size="lg">
          Load More Ideas
        </Button>
      </div>
    </div>
  )
}

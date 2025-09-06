import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

const mockProjects = [
  {
    id: 1,
    title: "StacksSwap - Decentralized Exchange",
    description:
      "Building a comprehensive DEX on Stacks with advanced trading features, liquidity pools, and yield farming capabilities.",
    totalFunding: "$45,000",
    raisedFunding: "$32,000",
    fundingProgress: 71,
    category: "DeFi",
    stage: "Development",
    timeline: "6 months",
    team: {
      name: "DeFi Builders",
      avatar: "/defi-team.png",
      members: 4,
      verified: true,
    },
    milestones: [
      { title: "Smart Contract Development", status: "completed", amount: "$15,000" },
      { title: "Frontend Implementation", status: "active", amount: "$12,000" },
      { title: "Security Audit", status: "pending", amount: "$10,000" },
      { title: "Mainnet Launch", status: "pending", amount: "$8,000" },
    ],
    tags: ["DeFi", "AMM", "Yield Farming", "Liquidity"],
    backers: 23,
  },
  {
    id: 2,
    title: "Stacks NFT Gaming Platform",
    description:
      "Revolutionary gaming platform combining NFTs with play-to-earn mechanics, built specifically for the Stacks ecosystem.",
    totalFunding: "$60,000",
    raisedFunding: "$18,000",
    fundingProgress: 30,
    category: "NFT & Gaming",
    stage: "Concept",
    timeline: "8 months",
    team: {
      name: "GameFi Studios",
      avatar: "/gaming-team.png",
      members: 6,
      verified: true,
    },
    milestones: [
      { title: "Game Design & Architecture", status: "active", amount: "$20,000" },
      { title: "NFT Smart Contracts", status: "pending", amount: "$15,000" },
      { title: "Game Development", status: "pending", amount: "$15,000" },
      { title: "Beta Testing & Launch", status: "pending", amount: "$10,000" },
    ],
    tags: ["Gaming", "NFT", "Play-to-Earn", "Metaverse"],
    backers: 15,
  },
  {
    id: 3,
    title: "Stacks Analytics Dashboard",
    description:
      "Comprehensive analytics platform providing real-time insights into Stacks blockchain metrics, DeFi protocols, and market data.",
    totalFunding: "$25,000",
    raisedFunding: "$22,000",
    fundingProgress: 88,
    category: "Infrastructure",
    stage: "Testing",
    timeline: "4 months",
    team: {
      name: "Data Insights",
      avatar: "/analytics-team.png",
      members: 3,
      verified: false,
    },
    milestones: [
      { title: "Data Pipeline Setup", status: "completed", amount: "$8,000" },
      { title: "Dashboard Development", status: "completed", amount: "$10,000" },
      { title: "API Integration", status: "active", amount: "$4,000" },
      { title: "Public Launch", status: "pending", amount: "$3,000" },
    ],
    tags: ["Analytics", "Dashboard", "API", "Data"],
    backers: 31,
  },
]

export function ProjectsList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">73 Projects Found</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Button variant="ghost" size="sm">
            Most Funded
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {mockProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-balance">{project.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {project.stage}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-pretty">{project.description}</p>
                </div>
                <div className="text-right space-y-1 ml-4">
                  <div className="text-2xl font-bold text-primary">{project.totalFunding}</div>
                  <div className="text-xs text-muted-foreground">Total Funding</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Funding Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Funding Progress</span>
                    <span className="font-medium">
                      {project.raisedFunding} / {project.totalFunding} ({project.fundingProgress}%)
                    </span>
                  </div>
                  <Progress value={project.fundingProgress} className="h-2" />
                </div>

                {/* Milestones Preview */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Current Milestones</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {project.milestones.slice(0, 2).map((milestone, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            milestone.status === "completed"
                              ? "bg-green-500"
                              : milestone.status === "active"
                                ? "bg-primary"
                                : "bg-muted"
                          }`}
                        />
                        <span className="truncate">{milestone.title}</span>
                        <span className="text-muted-foreground">{milestone.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={project.team.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{project.team.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{project.team.name}</span>
                      {project.team.verified && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {project.category}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>{project.backers} backers</span>
                    <span>{project.timeline}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Fund Project
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
          Load More Projects
        </Button>
      </div>
    </div>
  )
}

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mockBounties = [
  {
    id: 1,
    title: "Build a Stacks NFT Marketplace Frontend",
    description:
      "Create a modern, responsive frontend for an NFT marketplace on Stacks blockchain with wallet integration and real-time updates.",
    reward: "$2,500",
    currency: "STX",
    difficulty: "Intermediate",
    category: "Frontend",
    timeLeft: "12 days",
    applicants: 8,
    poster: {
      name: "Alex Chen",
      avatar: "/developer-working.png",
      verified: true,
    },
    tags: ["React", "Next.js", "Stacks.js", "TypeScript"],
    status: "Open",
  },
  {
    id: 2,
    title: "Smart Contract for Decentralized Voting",
    description:
      "Develop a secure voting smart contract in Clarity with features for proposal creation, voting, and result tallying.",
    reward: "$4,000",
    currency: "STX",
    difficulty: "Advanced",
    category: "Smart Contracts",
    timeLeft: "8 days",
    applicants: 12,
    poster: {
      name: "Sarah Kim",
      avatar: "/interconnected-blocks.png",
      verified: true,
    },
    tags: ["Clarity", "Smart Contracts", "Governance"],
    status: "Open",
  },
  {
    id: 3,
    title: "DeFi Yield Farming Dashboard",
    description:
      "Build a comprehensive dashboard for tracking yield farming opportunities across Stacks DeFi protocols.",
    reward: "$3,200",
    currency: "STX",
    difficulty: "Intermediate",
    category: "DeFi",
    timeLeft: "15 days",
    applicants: 6,
    poster: {
      name: "Mike Rodriguez",
      avatar: "/defi-concept.png",
      verified: false,
    },
    tags: ["DeFi", "Dashboard", "Analytics", "Web3"],
    status: "Open",
  },
  {
    id: 4,
    title: "Mobile Wallet Integration Library",
    description: "Create a TypeScript library for easy mobile wallet integration with Stacks applications.",
    reward: "$1,800",
    currency: "STX",
    difficulty: "Advanced",
    category: "Tooling",
    timeLeft: "20 days",
    applicants: 4,
    poster: {
      name: "Emma Wilson",
      avatar: "/modern-smartphone-display.png",
      verified: true,
    },
    tags: ["TypeScript", "Mobile", "SDK", "Wallet"],
    status: "Open",
  },
]

export function BountiesList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">147 Bounties Found</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Button variant="ghost" size="sm">
            Newest First
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {mockBounties.map((bounty) => (
          <Card key={bounty.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-balance">{bounty.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {bounty.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-pretty">{bounty.description}</p>
                </div>
                <div className="text-right space-y-1 ml-4">
                  <div className="text-2xl font-bold text-primary">{bounty.reward}</div>
                  <div className="text-xs text-muted-foreground">{bounty.currency}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {bounty.tags.map((tag) => (
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
                        <AvatarImage src={bounty.poster.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{bounty.poster.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{bounty.poster.name}</span>
                      {bounty.poster.verified && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {bounty.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {bounty.category}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>{bounty.applicants} applicants</span>
                    <span>{bounty.timeLeft} left</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Apply Now
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
          Load More Bounties
        </Button>
      </div>
    </div>
  )
}

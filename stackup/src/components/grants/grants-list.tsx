import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, Clock } from "lucide-react"

const mockGrants = [
  {
    id: 1,
    title: "Bitcoin L2 Research Initiative",
    description:
      "Comprehensive research program focused on advancing Bitcoin Layer 2 technologies, scalability solutions, and interoperability protocols.",
    amount: "$75,000",
    category: "Research & Development",
    provider: {
      name: "Stacks Foundation",
      avatar: "/stacks-foundation.png",
      verified: true,
    },
    deadline: "March 15, 2024",
    duration: "12 months",
    applicants: 23,
    requirements: [
      "PhD in Computer Science or equivalent experience",
      "Previous blockchain research publications",
      "Experience with Bitcoin protocol",
    ],
    milestones: [
      { title: "Research Proposal & Literature Review", amount: "$20,000", duration: "2 months" },
      { title: "Protocol Design & Specification", amount: "$25,000", duration: "4 months" },
      { title: "Implementation & Testing", amount: "$20,000", duration: "4 months" },
      { title: "Final Report & Publication", amount: "$10,000", duration: "2 months" },
    ],
    tags: ["Research", "Bitcoin", "Layer 2", "Scalability"],
    status: "Open",
    type: "Individual",
  },
  {
    id: 2,
    title: "Stacks Developer Education Program",
    description:
      "Create comprehensive educational content, tutorials, and workshops to onboard new developers to the Stacks ecosystem.",
    amount: "$35,000",
    category: "Education & Outreach",
    provider: {
      name: "Bitcoin Dev Fund",
      avatar: "/bitcoin-dev-fund.png",
      verified: true,
    },
    deadline: "February 28, 2024",
    duration: "6 months",
    applicants: 15,
    requirements: [
      "Experience in developer education",
      "Strong understanding of Stacks ecosystem",
      "Content creation portfolio",
    ],
    milestones: [
      { title: "Curriculum Development", amount: "$10,000", duration: "1 month" },
      { title: "Content Creation", amount: "$15,000", duration: "3 months" },
      { title: "Workshop Delivery", amount: "$7,000", duration: "1 month" },
      { title: "Community Feedback & Iteration", amount: "$3,000", duration: "1 month" },
    ],
    tags: ["Education", "Content", "Workshops", "Community"],
    status: "Open",
    type: "Team",
  },
  {
    id: 3,
    title: "DeFi Security Audit Framework",
    description:
      "Develop standardized security audit framework and tools specifically designed for Stacks DeFi protocols and smart contracts.",
    amount: "$50,000",
    category: "Security & Audits",
    provider: {
      name: "DeFi Alliance",
      avatar: "/defi-alliance.png",
      verified: true,
    },
    deadline: "April 10, 2024",
    duration: "8 months",
    applicants: 8,
    requirements: ["Security audit experience", "Clarity smart contract expertise", "Previous DeFi protocol analysis"],
    milestones: [
      { title: "Framework Design", amount: "$15,000", duration: "2 months" },
      { title: "Tool Development", amount: "$20,000", duration: "3 months" },
      { title: "Testing & Validation", amount: "$10,000", duration: "2 months" },
      { title: "Documentation & Release", amount: "$5,000", duration: "1 month" },
    ],
    tags: ["Security", "Audits", "DeFi", "Framework"],
    status: "Open",
    type: "Organization",
  },
]

export function GrantsList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">42 Grants Available</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Button variant="ghost" size="sm">
            Deadline
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {mockGrants.map((grant) => (
          <Card key={grant.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-balance">{grant.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {grant.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {grant.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-pretty">{grant.description}</p>
                </div>
                <div className="text-right space-y-1 ml-4">
                  <div className="text-2xl font-bold text-primary">{grant.amount}</div>
                  <div className="text-xs text-muted-foreground">Grant Amount</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Grant Provider */}
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={grant.provider.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{grant.provider.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{grant.provider.name}</span>
                  {grant.provider.verified && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      ✓
                    </Badge>
                  )}
                </div>

                {/* Key Info */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Deadline</div>
                      <div className="text-muted-foreground">{grant.deadline}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Duration</div>
                      <div className="text-muted-foreground">{grant.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Applicants</div>
                      <div className="text-muted-foreground">{grant.applicants}</div>
                    </div>
                  </div>
                </div>

                {/* Milestones Preview */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Milestone Structure</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {grant.milestones.slice(0, 2).map((milestone, index) => (
                      <div key={index} className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded">
                        <span className="truncate">{milestone.title}</span>
                        <span className="text-primary font-medium">{milestone.amount}</span>
                      </div>
                    ))}
                  </div>
                  {grant.milestones.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{grant.milestones.length - 2} more milestones
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {grant.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Requirements Preview */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Key Requirements</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {grant.requirements.slice(0, 2).map((req, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Apply for Grant
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
          Load More Grants
        </Button>
      </div>
    </div>
  )
}

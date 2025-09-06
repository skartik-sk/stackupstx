import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export function ProjectsFilters() {
  const categories = [
    { id: "defi", label: "DeFi", count: 28 },
    { id: "nft", label: "NFT & Gaming", count: 22 },
    { id: "infrastructure", label: "Infrastructure", count: 18 },
    { id: "tooling", label: "Developer Tools", count: 15 },
    { id: "social", label: "Social", count: 12 },
    { id: "dao", label: "DAO & Governance", count: 8 },
  ]

  const stages = [
    { id: "concept", label: "Concept", count: 15 },
    { id: "development", label: "In Development", count: 32 },
    { id: "testing", label: "Testing", count: 18 },
    { id: "launch", label: "Pre-Launch", count: 8 },
  ]

  const fundingStatus = [
    { id: "seeking", label: "Seeking Funding", count: 45 },
    { id: "partially", label: "Partially Funded", count: 20 },
    { id: "milestone", label: "Milestone Active", count: 8 },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id={category.id} />
                <Label htmlFor={category.id} className="text-sm font-medium">
                  {category.label}
                </Label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Stage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stages.map((stage) => (
            <div key={stage.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id={stage.id} />
                <Label htmlFor={stage.id} className="text-sm font-medium">
                  {stage.label}
                </Label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {stage.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Funding Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {fundingStatus.map((status) => (
            <div key={status.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id={status.id} />
                <Label htmlFor={status.id} className="text-sm font-medium">
                  {status.label}
                </Label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {status.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Funding Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$1K</span>
              <span>$100K+</span>
            </div>
            <Slider defaultValue={[1000, 50000]} max={100000} min={1000} step={1000} className="w-full" />
          </div>
          <div className="text-center text-sm text-muted-foreground">$1K - $50K</div>
        </CardContent>
      </Card>
    </div>
  )
}

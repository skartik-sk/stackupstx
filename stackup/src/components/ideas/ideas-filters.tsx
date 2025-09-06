import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export function IdeasFilters() {
  const categories = [
    { id: "defi", label: "DeFi", count: 45 },
    { id: "nft", label: "NFT & Gaming", count: 38 },
    { id: "infrastructure", label: "Infrastructure", count: 32 },
    { id: "tooling", label: "Developer Tools", count: 28 },
    { id: "social", label: "Social & Community", count: 24 },
    { id: "governance", label: "Governance", count: 18 },
  ]

  const aiDifficulty = [
    { id: "beginner", label: "Beginner", count: 78, color: "bg-green-500" },
    { id: "intermediate", label: "Intermediate", count: 124, color: "bg-yellow-500" },
    { id: "advanced", label: "Advanced", count: 67, color: "bg-red-500" },
    { id: "expert", label: "Expert", count: 15, color: "bg-purple-500" },
  ]

  const aiInsights = [
    { id: "high-impact", label: "High Impact Potential", count: 42 },
    { id: "innovative", label: "Highly Innovative", count: 38 },
    { id: "feasible", label: "Technically Feasible", count: 156 },
    { id: "market-ready", label: "Market Ready", count: 23 },
  ]

  const status = [
    { id: "new", label: "New Ideas", count: 89 },
    { id: "analyzed", label: "AI Analyzed", count: 156 },
    { id: "trending", label: "Trending", count: 34 },
    { id: "in-development", label: "In Development", count: 5 },
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
          <CardTitle className="text-lg flex items-center space-x-2">
            <span>AI Difficulty Rating</span>
            <Badge variant="outline" className="text-xs">
              AI
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiDifficulty.map((difficulty) => (
            <div key={difficulty.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id={difficulty.id} />
                <div className={`w-2 h-2 rounded-full ${difficulty.color}`} />
                <Label htmlFor={difficulty.id} className="text-sm font-medium">
                  {difficulty.label}
                </Label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {difficulty.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <span>AI Insights</span>
            <Badge variant="outline" className="text-xs">
              AI
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiInsights.map((insight) => (
            <div key={insight.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id={insight.id} />
                <Label htmlFor={insight.id} className="text-sm font-medium">
                  {insight.label}
                </Label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {insight.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {status.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id={item.id} />
                <Label htmlFor={item.id} className="text-sm font-medium">
                  {item.label}
                </Label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {item.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

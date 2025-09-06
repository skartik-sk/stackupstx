import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export function BountiesFilters() {
  const categories = [
    { id: "smart-contracts", label: "Smart Contracts", count: 45 },
    { id: "frontend", label: "Frontend", count: 32 },
    { id: "backend", label: "Backend", count: 28 },
    { id: "defi", label: "DeFi", count: 24 },
    { id: "nft", label: "NFTs", count: 18 },
    { id: "tooling", label: "Developer Tools", count: 15 },
  ]

  const difficulties = [
    { id: "beginner", label: "Beginner", count: 42 },
    { id: "intermediate", label: "Intermediate", count: 67 },
    { id: "advanced", label: "Advanced", count: 38 },
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
          <CardTitle className="text-lg">Difficulty</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {difficulties.map((difficulty) => (
            <div key={difficulty.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id={difficulty.id} />
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
          <CardTitle className="text-lg">Reward Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$100</span>
              <span>$10,000+</span>
            </div>
            <Slider defaultValue={[100, 5000]} max={10000} min={100} step={100} className="w-full" />
          </div>
          <div className="text-center text-sm text-muted-foreground">$100 - $5,000</div>
        </CardContent>
      </Card>
    </div>
  )
}

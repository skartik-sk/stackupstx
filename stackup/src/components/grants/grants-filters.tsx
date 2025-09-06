import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export function GrantsFilters() {
  const categories = [
    { id: "research", label: "Research & Development", count: 18 },
    { id: "infrastructure", label: "Infrastructure", count: 12 },
    { id: "education", label: "Education & Outreach", count: 8 },
    { id: "tooling", label: "Developer Tooling", count: 6 },
    { id: "security", label: "Security & Audits", count: 4 },
    { id: "community", label: "Community Building", count: 3 },
  ]

  const providers = [
    { id: "stacks-foundation", label: "Stacks Foundation", count: 15 },
    { id: "bitcoin-dev-fund", label: "Bitcoin Dev Fund", count: 8 },
    { id: "web3-grants", label: "Web3 Grants", count: 6 },
    { id: "defi-alliance", label: "DeFi Alliance", count: 4 },
    { id: "ecosystem-fund", label: "Ecosystem Fund", count: 3 },
  ]

  const grantTypes = [
    { id: "individual", label: "Individual", count: 25 },
    { id: "team", label: "Team", count: 12 },
    { id: "organization", label: "Organization", count: 5 },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Grant Categories</CardTitle>
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
          <CardTitle className="text-lg">Grant Providers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {providers.map((provider) => (
            <div key={provider.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id={provider.id} />
                <Label htmlFor={provider.id} className="text-sm font-medium">
                  {provider.label}
                </Label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {provider.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Grant Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {grantTypes.map((type) => (
            <div key={type.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id={type.id} />
                <Label htmlFor={type.id} className="text-sm font-medium">
                  {type.label}
                </Label>
              </div>
              <Badge variant="secondary" className="text-xs">
                {type.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Grant Amount</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$5K</span>
              <span>$100K+</span>
            </div>
            <Slider defaultValue={[5000, 50000]} max={100000} min={5000} step={5000} className="w-full" />
          </div>
          <div className="text-center text-sm text-muted-foreground">$5K - $50K</div>
        </CardContent>
      </Card>
    </div>
  )
}

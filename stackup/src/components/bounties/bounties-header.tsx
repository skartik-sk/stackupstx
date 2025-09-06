import { Button } from "@/components/ui/button"

export function BountiesHeader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Active Bounties</h1>
          <p className="text-muted-foreground text-pretty">
            Discover and complete bounties to earn rewards in the Stacks ecosystem
          </p>
        </div>
        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Create Bounty</Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">147</div>
          <div className="text-sm text-muted-foreground">Open Bounties</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">$125K</div>
          <div className="text-sm text-muted-foreground">Total Rewards</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">89</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">24h</div>
          <div className="text-sm text-muted-foreground">Avg Response</div>
        </div>
      </div>
    </div>
  )
}

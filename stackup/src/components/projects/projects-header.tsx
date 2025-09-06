import { Button } from "@/components/ui/button"

export function ProjectsHeader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Active Projects</h1>
          <p className="text-muted-foreground text-pretty">
            Discover innovative Stacks projects seeking milestone-based funding
          </p>
        </div>
        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Submit Project</Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">73</div>
          <div className="text-sm text-muted-foreground">Active Projects</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">$890K</div>
          <div className="text-sm text-muted-foreground">Total Funding</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">45</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">92%</div>
          <div className="text-sm text-muted-foreground">Success Rate</div>
        </div>
      </div>
    </div>
  )
}

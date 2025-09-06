import { Button } from "@/components/ui/button"
import Link from "next/link"

export function GrantsHeader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Available Grants</h1>
          <p className="text-muted-foreground text-pretty">
            Secure funding for research, development, and ecosystem growth initiatives
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Link href="/create/grant">Become Grant Provider</Link>
          </Button>
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Apply for Grant</Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">42</div>
          <div className="text-sm text-muted-foreground">Open Grants</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">$1.2M</div>
          <div className="text-sm text-muted-foreground">Available Funding</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">156</div>
          <div className="text-sm text-muted-foreground">Grants Awarded</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">15</div>
          <div className="text-sm text-muted-foreground">Grant Providers</div>
        </div>
      </div>
    </div>
  )
}

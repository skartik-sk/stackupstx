import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export function IdeasHeader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-balance">Innovation Hub</h1>
            <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary">AI Powered</span>
            </div>
          </div>
          <p className="text-muted-foreground text-pretty">
            Share innovative ideas and get AI-powered insights, difficulty analysis, and community feedback
          </p>
        </div>
        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
          <Link href="/create/idea">Submit Idea</Link>
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">284</div>
          <div className="text-sm text-muted-foreground">Ideas Submitted</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">156</div>
          <div className="text-sm text-muted-foreground">AI Analyzed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">89</div>
          <div className="text-sm text-muted-foreground">In Development</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">4.2</div>
          <div className="text-sm text-muted-foreground">Avg Rating</div>
        </div>
      </div>
    </div>
  )
}

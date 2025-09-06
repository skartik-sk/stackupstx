import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function HeroSection() {
  return (
    <section className="relative py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                ⚡ Powered by Bitcoin Security
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                Boost the <span className="text-primary">Stacks</span> Ecosystem
              </h1>
              <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
                Connect builders, funders, and innovators through bounties, projects, grants, and groundbreaking ideas
                on the leading Bitcoin L2.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Explore Bounties
              </Button>
              <Button size="lg" variant="outline">
                Submit Project
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">150+</div>
                <div className="text-sm text-muted-foreground">Active Bounties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">$2.5M</div>
                <div className="text-sm text-muted-foreground">Total Rewards</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Developers</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-0 space-y-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">B</span>
                </div>
                <h3 className="font-semibold">Bounties</h3>
                <p className="text-sm text-muted-foreground">
                  Earn rewards for solving challenges and building features
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardContent className="p-0 space-y-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <span className="text-secondary font-bold">P</span>
                </div>
                <h3 className="font-semibold">Projects</h3>
                <p className="text-sm text-muted-foreground">
                  Get milestone-based funding for your Stacks applications
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-0 space-y-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">G</span>
                </div>
                <h3 className="font-semibold">Grants</h3>
                <p className="text-sm text-muted-foreground">Secure funding for research and ecosystem development</p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardContent className="p-0 space-y-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <span className="text-secondary font-bold">I</span>
                </div>
                <h3 className="font-semibold">Ideas</h3>
                <p className="text-sm text-muted-foreground">Share innovative concepts and get AI-powered insights</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

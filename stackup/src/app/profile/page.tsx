"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, MapPin, LinkIcon, Github, Twitter, Award, Clock, CheckCircle } from "lucide-react"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  const userStats = {
    totalApplications: 12,
    acceptedApplications: 8,
    completedProjects: 5,
    totalEarnings: 15750,
    reputation: 4.8,
    monthlyLimit: 4,
    usedThisMonth: 2,
  }

  const recentActivity = [
    { type: "bounty", title: "Smart Contract Audit", status: "completed", reward: 2500, date: "2 days ago" },
    { type: "project", title: "DeFi Dashboard", status: "in-progress", reward: 8000, date: "1 week ago" },
    { type: "grant", title: "Research Grant", status: "approved", reward: 5000, date: "2 weeks ago" },
    { type: "idea", title: "NFT Marketplace Concept", status: "submitted", reward: 0, date: "3 weeks ago" },
  ]

  const skills = ["Smart Contracts", "React", "TypeScript", "Clarity", "DeFi", "Web3", "UI/UX", "Blockchain"]
  const achievements = [
    { title: "Top Contributor", description: "Completed 5+ projects", icon: Award },
    { title: "Fast Delivery", description: "Average delivery time: 3 days", icon: Clock },
    { title: "High Quality", description: "4.8/5 average rating", icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src="/user-avatar.png" alt="Profile" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Github className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Twitter className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">John Developer</h1>
                    <p className="text-muted-foreground mb-2">Full-stack developer specializing in Stacks ecosystem</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        San Francisco, CA
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        Joined March 2024
                      </div>
                      <div className="flex items-center gap-1">
                        <LinkIcon className="w-4 h-4" />
                        johndeveloper.dev
                      </div>
                    </div>
                  </div>
                  <Button>Edit Profile</Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userStats.totalApplications}</div>
                    <div className="text-sm text-muted-foreground">Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{userStats.completedProjects}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-2xl font-bold text-center">
                    <div className="text-primary">{userStats.totalEarnings.toLocaleString()} STX</div>
                    <div className="text-sm text-muted-foreground">Total Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{userStats.reputation}/5</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Usage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Application Limit</CardTitle>
            <CardDescription>
              You've used {userStats.usedThisMonth} of {userStats.monthlyLimit} free applications this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={(userStats.usedThisMonth / userStats.monthlyLimit) * 100} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {userStats.monthlyLimit - userStats.usedThisMonth} applications remaining
            </p>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Experienced full-stack developer with 5+ years in blockchain development. Specialized in Stacks
                  ecosystem, smart contracts, and DeFi applications. Passionate about building decentralized solutions
                  that empower users and contribute to the Bitcoin economy.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.slice(0, 3).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                      <Badge variant={activity.status === "completed" ? "default" : "secondary"}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Success Rate</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg. Delivery Time</span>
                    <span className="font-medium">3.2 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Client Satisfaction</span>
                    <span className="font-medium">4.8/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Response Time</span>
                    <span className="font-medium">&lt; 2 hours</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            {recentActivity.map((activity, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          activity.status === "completed"
                            ? "bg-green-500"
                            : activity.status === "in-progress"
                              ? "bg-blue-500"
                              : activity.status === "approved"
                                ? "bg-green-500"
                                : "bg-gray-400"
                        }`}
                      />
                      <div>
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{activity.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{activity.reward > 0 ? `${activity.reward} STX` : "Pending"}</div>
                      <div className="text-sm text-muted-foreground">{activity.date}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            {achievements.map((achievement, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <achievement.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

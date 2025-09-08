"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/WalletContextNew"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, UserIcon, Wallet, TrendingUp, Award, Target } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { isAuthenticated, user, connectWallet } = useWallet()
  const [activeTab, setActiveTab] = useState("overview")

  // If wallet not connected, show connect prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Wallet className="h-16 w-16 mx-auto mb-4 text-[#fc6431]" />
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your Stacks wallet to view your profile and activity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={connectWallet}
              className="w-full bg-[#fc6431] hover:bg-[#e55a2b] text-white"
            >
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-shrink-0">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user?.profileData?.avatar} alt="Profile" />
              <AvatarFallback className="text-2xl bg-[#fc6431] text-white">
                <UserIcon className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {user?.profileData?.name || user?.username || 'Stacks User'}
                </h1>
                <p className="text-muted-foreground mb-2">
                  {user?.profileData?.bio || 'Welcome to StackUp! Complete your profile to get started.'}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </div>
              </div>
              <Link href="/settings">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>

            {/* Wallet Address */}
            <div className="mb-4">
              <Badge variant="secondary" className="font-mono">
                {user?.stxAddress}
              </Badge>
            </div>

            {/* Skills */}
            {user?.profileData?.skills && user.profileData.skills.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.profileData.skills.map((skill: string) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-[#fc6431]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Stacker Score</p>
                  <p className="text-2xl font-bold">{user?.stackerScore || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-[#fc6431]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                  <p className="text-2xl font-bold">{user?.totalEarned || 0} STX</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-[#fc6431]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Completed Projects</p>
                  <p className="text-2xl font-bold">{user?.completedProjects || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserIcon className="h-8 w-8 text-[#fc6431]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Reputation</p>
                  <p className="text-2xl font-bold">{user?.reputation || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bounties">Bounties</TabsTrigger>
            <TabsTrigger value="ideas">Ideas</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to StackUp!</CardTitle>
                <CardDescription>
                  Your journey in the Stacks ecosystem starts here. Complete your profile and start participating in bounties, sharing ideas, and building projects.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/bounties">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">Explore Bounties</h3>
                          <p className="text-sm text-muted-foreground">Find and complete bounties to earn STX tokens</p>
                        </CardContent>
                      </Card>
                    </Link>
                    
                    <Link href="/ideas">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">Share Ideas</h3>
                          <p className="text-sm text-muted-foreground">Submit innovative ideas and get community feedback</p>
                        </CardContent>
                      </Card>
                    </Link>
                    
                    <Link href="/grants">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">Apply for Grants</h3>
                          <p className="text-sm text-muted-foreground">Get funding for your research and projects</p>
                        </CardContent>
                      </Card>
                    </Link>
                    
                    <Link href="/projects">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">View Projects</h3>
                          <p className="text-sm text-muted-foreground">Discover and contribute to ongoing projects</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bounties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Bounties</CardTitle>
                <CardDescription>Bounties you've created or applied to</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No bounties yet. Start by creating or applying to bounties!</p>
                  <Link href="/bounties">
                    <Button className="mt-4 bg-[#fc6431] hover:bg-[#e55a2b] text-white">
                      Explore Bounties
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ideas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Ideas</CardTitle>
                <CardDescription>Ideas you've submitted to the community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No ideas submitted yet. Share your innovative ideas with the community!</p>
                  <Link href="/create/idea">
                    <Button className="mt-4 bg-[#fc6431] hover:bg-[#e55a2b] text-white">
                      Submit an Idea
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Projects</CardTitle>
                <CardDescription>Projects you're working on or have contributed to</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No projects yet. Start contributing to existing projects or create your own!</p>
                  <Link href="/projects">
                    <Button className="mt-4 bg-[#fc6431] hover:bg-[#e55a2b] text-white">
                      View Projects
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

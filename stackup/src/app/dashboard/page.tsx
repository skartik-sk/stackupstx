"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { 
  Crown, 
  Rocket, 
  Shield,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Trophy,
  Settings,
  Plus
} from 'lucide-react'

// Sample data for platform overview
const platformStats = [
  {
    title: 'Total Bounties',
    value: '1,247',
    change: '+15.2%',
    icon: Rocket
  },
  {
    title: 'Active Projects',
    value: '892',
    change: '+8.1%',
    icon: Crown
  },
  {
    title: 'Total Users',
    value: '12,847',
    change: '+22.4%',
    icon: Users
  },
  {
    title: 'Total Value Locked',
    value: '247,832 STX',
    change: '+11.8%',
    icon: DollarSign
  }
]

// Sample recent activity data
const recentActivity = [
  {
    type: 'project_completed',
    title: 'DEX UI Redesign completed',
    time: '2 hours ago',
    value: 150.0
  },
  {
    type: 'new_bounty',
    title: 'New bounty: Smart Contract Audit',
    time: '4 hours ago',
    value: 75.0
  },
  {
    type: 'winner_selected',
    title: 'Winner selected for NFT Marketplace',
    time: '6 hours ago',
    value: 30.0
  }
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to StackUp</h1>
          <p className="text-xl text-gray-600">Your gateway to the Stacks ecosystem</p>
        </div>

        {/* Platform Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-[#fc6431]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Creator Dashboard */}
          <Link href="/creator-dashboard">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow hover:border-[#fc6431]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="h-5 w-5 mr-2 text-[#fc6431]" />
                  Creator Dashboard
                </CardTitle>
                <CardDescription>Manage your bounties and projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Bounties</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ongoing Projects</span>
                    <Badge variant="secondary">8</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Earned</span>
                    <Badge className="bg-[#fc6431] hover:bg-[#e55428]">2,450 STX</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Stacker Dashboard */}
          <Link href="/stacker-dashboard">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow hover:border-[#fc6431]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="h-5 w-5 mr-2 text-[#fc6431]" />
                  Stacker Dashboard
                </CardTitle>
                <CardDescription>Find and apply for opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Applications</span>
                    <Badge variant="secondary">5</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completed</span>
                    <Badge variant="secondary">23</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Stacker Score</span>
                    <Badge className="bg-[#fc6431] hover:bg-[#e55428]">4.8</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Admin Dashboard */}
          <Link href="/admin-dashboard">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow hover:border-[#fc6431]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-[#fc6431]" />
                  Admin Dashboard
                </CardTitle>
                <CardDescription>Platform administration tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Users</span>
                    <Badge variant="secondary">12,847</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Reports</span>
                    <Badge variant="destructive">3</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <Badge className="bg-[#fc6431] hover:bg-[#e55428]">125K STX</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-[#fc6431]" />
              Recent Platform Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-full">
                      {activity.type === 'project_completed' && <Crown className="h-4 w-4 text-[#fc6431]" />}
                      {activity.type === 'new_bounty' && <Rocket className="h-4 w-4 text-[#fc6431]" />}
                      {activity.type === 'winner_selected' && <Trophy className="h-4 w-4 text-[#fc6431]" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <Badge className="bg-[#fc6431] hover:bg-[#e55428]">{activity.value} STX</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/create/bounty">
                <Button variant="outline" className="w-full h-16 text-left justify-start hover:border-[#fc6431] hover:text-[#fc6431]">
                  <div>
                    <div className="font-semibold">Create Bounty</div>
                    <div className="text-sm text-gray-500">Post a new task</div>
                  </div>
                </Button>
              </Link>
              
              <Link href="/bounties">
                <Button variant="outline" className="w-full h-16 text-left justify-start hover:border-[#fc6431] hover:text-[#fc6431]">
                  <div>
                    <div className="font-semibold">Browse Bounties</div>
                    <div className="text-sm text-gray-500">Find opportunities</div>
                  </div>
                </Button>
              </Link>
              
              <Link href="/create/grant">
                <Button variant="outline" className="w-full h-16 text-left justify-start hover:border-[#fc6431] hover:text-[#fc6431]">
                  <div>
                    <div className="font-semibold">Create Grant</div>
                    <div className="text-sm text-gray-500">Fund the ecosystem</div>
                  </div>
                </Button>
              </Link>
              
              <Link href="/create/idea">
                <Button variant="outline" className="w-full h-16 text-left justify-start hover:border-[#fc6431] hover:text-[#fc6431]">
                  <div>
                    <div className="font-semibold">Share Idea</div>
                    <div className="text-sm text-gray-500">Propose new concepts</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

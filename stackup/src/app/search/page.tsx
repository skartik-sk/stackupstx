"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  DollarSign,
  Users,
  Lightbulb,
  Code,
  Award,
  Building,
} from "lucide-react"
import Link from "next/link"

// Mock search data
const mockSearchResults = {
  bounties: [
    {
      id: 1,
      title: "Smart Contract Security Audit",
      description: "Comprehensive security audit for DeFi protocol smart contracts",
      reward: "5000 STX",
      difficulty: "Expert",
      category: "Security",
      deadline: "2024-02-15",
      applicants: 12,
    },
    {
      id: 2,
      title: "Frontend Development for NFT Marketplace",
      description: "Build responsive React frontend for NFT trading platform",
      reward: "3000 STX",
      difficulty: "Intermediate",
      category: "Development",
      deadline: "2024-02-20",
      applicants: 8,
    },
  ],
  projects: [
    {
      id: 1,
      title: "Decentralized Social Media Platform",
      description: "Building a censorship-resistant social platform on Stacks",
      funding: "50000 STX",
      progress: 65,
      team: "SocialStack Team",
      category: "Social",
    },
    {
      id: 2,
      title: "Cross-chain Bridge Protocol",
      description: "Enabling seamless asset transfers between Bitcoin and Stacks",
      funding: "75000 STX",
      progress: 40,
      team: "Bridge Builders",
      category: "Infrastructure",
    },
  ],
  grants: [
    {
      id: 1,
      title: "Stacks Education Initiative",
      description: "Creating comprehensive educational content for Stacks developers",
      amount: "25000 STX",
      provider: "Stacks Foundation",
      deadline: "2024-03-01",
      category: "Education",
    },
    {
      id: 2,
      title: "DeFi Research Grant",
      description: "Research on novel DeFi mechanisms and their implementation on Stacks",
      amount: "40000 STX",
      provider: "DeFi Alliance",
      deadline: "2024-02-28",
      category: "Research",
    },
  ],
  ideas: [
    {
      id: 1,
      title: "AI-Powered Code Review Tool",
      description: "Automated code review system specifically for Clarity smart contracts",
      votes: 45,
      difficulty: 7.5,
      innovation: 8.2,
      author: "DevTools Pro",
      category: "Tools",
    },
    {
      id: 2,
      title: "Decentralized Identity Verification",
      description: "Privacy-preserving identity verification system using zero-knowledge proofs",
      votes: 38,
      difficulty: 9.1,
      innovation: 9.5,
      author: "Privacy Advocate",
      category: "Identity",
    },
  ],
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [sortOrder, setSortOrder] = useState("desc")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    categories: [] as string[],
    difficulty: [] as string[],
    dateRange: "all",
    minReward: "",
    maxReward: "",
  })

  const [searchResults, setSearchResults] = useState(mockSearchResults)
  const [isSearching, setIsSearching] = useState(false)

  const categories = [
    "Development",
    "Security",
    "Design",
    "Research",
    "Education",
    "Infrastructure",
    "DeFi",
    "Social",
    "Tools",
    "Identity",
  ]

  const difficulties = ["Beginner", "Intermediate", "Advanced", "Expert"]

  const handleSearch = async (searchQuery: string) => {
    setIsSearching(true)
    setQuery(searchQuery)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Filter results based on query (mock implementation)
    const filteredResults = {
      bounties: mockSearchResults.bounties.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
      projects: mockSearchResults.projects.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
      grants: mockSearchResults.grants.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
      ideas: mockSearchResults.ideas.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }

    setSearchResults(filteredResults)
    setIsSearching(false)
  }

  const handleFilterChange = (filterType: string, value: string | string[]) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      difficulty: [],
      dateRange: "all",
      minReward: "",
      maxReward: "",
    })
  }

  const getTotalResults = () => {
    return (
      searchResults.bounties.length +
      searchResults.projects.length +
      searchResults.grants.length +
      searchResults.ideas.length
    )
  }

  useEffect(() => {
    if (query) {
      handleSearch(query)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bounties, projects, grants, and ideas..."
                className="pl-10 h-12 text-base"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(query)}
              />
            </div>
            <Button onClick={() => handleSearch(query)} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          {query && (
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {getTotalResults()} results for "{query}"
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-transparent"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="reward">Reward</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                  {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Filters</CardTitle>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Categories */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Categories</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={filters.categories.includes(category)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange("categories", [...filters.categories, category])
                              } else {
                                handleFilterChange(
                                  "categories",
                                  filters.categories.filter((c) => c !== category),
                                )
                              }
                            }}
                          />
                          <Label htmlFor={category} className="text-sm font-normal">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Difficulty</Label>
                    <div className="space-y-2">
                      {difficulties.map((difficulty) => (
                        <div key={difficulty} className="flex items-center space-x-2">
                          <Checkbox
                            id={difficulty}
                            checked={filters.difficulty.includes(difficulty)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange("difficulty", [...filters.difficulty, difficulty])
                              } else {
                                handleFilterChange(
                                  "difficulty",
                                  filters.difficulty.filter((d) => d !== difficulty),
                                )
                              }
                            }}
                          />
                          <Label htmlFor={difficulty} className="text-sm font-normal">
                            {difficulty}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Date Range</Label>
                    <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="quarter">This Quarter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reward Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Reward Range (STX)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min"
                        type="number"
                        value={filters.minReward}
                        onChange={(e) => handleFilterChange("minReward", e.target.value)}
                      />
                      <Input
                        placeholder="Max"
                        type="number"
                        value={filters.maxReward}
                        onChange={(e) => handleFilterChange("maxReward", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search Results */}
          <div className="flex-1">
            {!query ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Search the Stacks Ecosystem</h3>
                  <p className="text-muted-foreground">
                    Find bounties, projects, grants, and innovative ideas across the platform
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All ({getTotalResults()})</TabsTrigger>
                  <TabsTrigger value="bounties">
                    <Code className="h-4 w-4 mr-1" />
                    Bounties ({searchResults.bounties.length})
                  </TabsTrigger>
                  <TabsTrigger value="projects">
                    <Building className="h-4 w-4 mr-1" />
                    Projects ({searchResults.projects.length})
                  </TabsTrigger>
                  <TabsTrigger value="grants">
                    <Award className="h-4 w-4 mr-1" />
                    Grants ({searchResults.grants.length})
                  </TabsTrigger>
                  <TabsTrigger value="ideas">
                    <Lightbulb className="h-4 w-4 mr-1" />
                    Ideas ({searchResults.ideas.length})
                  </TabsTrigger>
                </TabsList>

                {/* All Results */}
                <TabsContent value="all" className="space-y-6">
                  {searchResults.bounties.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Bounties</h3>
                      {searchResults.bounties.map((bounty) => (
                        <Card key={bounty.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <Link href={`/bounties/${bounty.id}`}>
                                  <h4 className="font-semibold hover:text-primary cursor-pointer">{bounty.title}</h4>
                                </Link>
                                <p className="text-muted-foreground text-sm mt-1">{bounty.description}</p>
                              </div>
                              <Badge variant="secondary">{bounty.category}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {bounty.reward}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {bounty.applicants} applicants
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Due {bounty.deadline}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {searchResults.projects.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Projects</h3>
                      {searchResults.projects.map((project) => (
                        <Card key={project.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <Link href={`/projects/${project.id}`}>
                                  <h4 className="font-semibold hover:text-primary cursor-pointer">{project.title}</h4>
                                </Link>
                                <p className="text-muted-foreground text-sm mt-1">{project.description}</p>
                              </div>
                              <Badge variant="secondary">{project.category}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {project.funding}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {project.team}
                              </div>
                              <div>Progress: {project.progress}%</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Similar sections for grants and ideas... */}
                </TabsContent>

                {/* Individual category tabs would have similar structure */}
                <TabsContent value="bounties" className="space-y-4">
                  {searchResults.bounties.map((bounty) => (
                    <Card key={bounty.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <Link href={`/bounties/${bounty.id}`}>
                              <h4 className="font-semibold hover:text-primary cursor-pointer">{bounty.title}</h4>
                            </Link>
                            <p className="text-muted-foreground text-sm mt-1">{bounty.description}</p>
                          </div>
                          <Badge variant="secondary">{bounty.category}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {bounty.reward}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {bounty.applicants} applicants
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due {bounty.deadline}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Add similar TabsContent for projects, grants, and ideas */}
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

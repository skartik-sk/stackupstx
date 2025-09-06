"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Users, Target, Clock, CheckCircle, AlertCircle, FileText, Award, Building, Globe, Heart, Share2, Flag } from 'lucide-react'

export default function GrantDetailPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [applicationData, setApplicationData] = useState({
    projectTitle: "",
    description: "",
    category: "",
    requestedAmount: "",
    timeline: "",
    teamSize: "",
    experience: "",
    github: "",
    previousWork: "",
    agreeTerms: false
  })

  const grant = {
    id: "1",
    title: "Stacks Education Initiative Grant",
    description: "Supporting educational content, tutorials, and developer resources to grow the Stacks ecosystem through knowledge sharing and community building.",
    category: "Education",
    provider: {
      name: "Stacks Foundation",
      avatar: "/stacks-foundation.png",
      verified: true,
      totalGrants: 156,
      totalFunded: 2500000
    },
    amount: 25000,
    currency: "STX",
    deadline: "2024-03-15",
    applicants: 23,
    approved: 8,
    requirements: [
      "Educational focus on Stacks ecosystem",
      "Open source materials preferred",
      "Clear learning objectives",
      "Measurable impact metrics",
      "Community engagement plan"
    ],
    eligibility: [
      "Individual developers or teams",
      "Educational institutions",
      "Developer communities",
      "Content creators with proven track record"
    ],
    milestones: [
      {
        title: "Content Planning & Research",
        description: "Detailed curriculum and content outline",
        percentage: 25,
        deliverables: ["Content roadmap", "Learning objectives", "Target audience analysis"]
      },
      {
        title: "Content Development",
        description: "Create educational materials and resources",
        percentage: 50,
        deliverables: ["Written tutorials", "Code examples", "Interactive demos"]
      },
      {
        title: "Community Testing",
        description: "Beta testing with community feedback",
        percentage: 15,
        deliverables: ["Beta testing results", "Community feedback", "Content revisions"]
      },
      {
        title: "Launch & Distribution",
        description: "Public release and promotion",
        percentage: 10,
        deliverables: ["Public launch", "Marketing materials", "Impact metrics"]
      }
    ],
    focusAreas: [
      "Smart Contract Development",
      "DeFi Protocols",
      "Web3 Integration",
      "Clarity Programming",
      "Developer Tools",
      "Community Building"
    ],
    previousGrants: [
      {
        title: "Clarity Tutorial Series",
        recipient: "DevEducator",
        amount: 15000,
        status: "completed",
        impact: "5,000+ developers trained"
      },
      {
        title: "Stacks Workshop Program",
        recipient: "BlockchainAcademy",
        amount: 20000,
        status: "in-progress",
        impact: "50+ workshops conducted"
      }
    ]
  }

  const handleApplicationSubmit = () => {
    console.log("Application submitted:", applicationData)
    // Handle application submission
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Grant Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>Grants</span>
            <span>/</span>
            <span>{grant.category}</span>
            <span>/</span>
            <span className="text-foreground">{grant.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary">{grant.category}</Badge>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Clock className="w-3 h-3 mr-1" />
                  Open for Applications
                </Badge>
              </div>

              <h1 className="text-4xl font-bold mb-4 text-balance">{grant.title}</h1>
              <p className="text-lg text-muted-foreground mb-6 text-pretty">{grant.description}</p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={grant.provider.avatar || "/placeholder.svg"} alt={grant.provider.name} />
                    <AvatarFallback>SF</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{grant.provider.name}</span>
                      {grant.provider.verified && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {grant.provider.totalGrants} grants • {grant.provider.totalFunded.toLocaleString()} STX funded
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="px-8">
                      Apply for Grant
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Apply for {grant.title}</DialogTitle>
                      <DialogDescription>
                        Fill out the application form below. All fields are required.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="projectTitle">Project Title *</Label>
                          <Input 
                            id="projectTitle" 
                            placeholder="Enter your project title"
                            value={applicationData.projectTitle}
                            onChange={(e) => setApplicationData({...applicationData, projectTitle: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <Select value={applicationData.category} onValueChange={(value) => setApplicationData({...applicationData, category: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {grant.focusAreas.map((area) => (
                                <SelectItem key={area} value={area}>{area}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Project Description *</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Describe your project, its goals, and expected impact"
                          className="min-h-[100px]"
                          value={applicationData.description}
                          onChange={(e) => setApplicationData({...applicationData, description: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="requestedAmount">Requested Amount (STX) *</Label>
                          <Input 
                            id="requestedAmount" 
                            placeholder="Enter amount"
                            type="number"
                            max={grant.amount}
                            value={applicationData.requestedAmount}
                            onChange={(e) => setApplicationData({...applicationData, requestedAmount: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="timeline">Project Timeline *</Label>
                          <Select value={applicationData.timeline} onValueChange={(value) => setApplicationData({...applicationData, timeline: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-3">1-3 months</SelectItem>
                              <SelectItem value="3-6">3-6 months</SelectItem>
                              <SelectItem value="6-12">6-12 months</SelectItem>
                              <SelectItem value="12+">12+ months</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="teamSize">Team Size *</Label>
                          <Select value={applicationData.teamSize} onValueChange={(value) => setApplicationData({...applicationData, teamSize: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select team size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Individual (1 person)</SelectItem>
                              <SelectItem value="2-5">Small team (2-5 people)</SelectItem>
                              <SelectItem value="6-10">Medium team (6-10 people)</SelectItem>
                              <SelectItem value="10+">Large team (10+ people)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="github">GitHub Profile/Repository</Label>
                          <Input 
                            id="github" 
                            placeholder="https://github.com/username"
                            value={applicationData.github}
                            onChange={(e) => setApplicationData({...applicationData, github: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="experience">Relevant Experience *</Label>
                        <Textarea 
                          id="experience" 
                          placeholder="Describe your relevant experience and qualifications"
                          className="min-h-[80px]"
                          value={applicationData.experience}
                          onChange={(e) => setApplicationData({...applicationData, experience: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label htmlFor="previousWork">Previous Work/Portfolio</Label>
                        <Textarea 
                          id="previousWork" 
                          placeholder="Links to previous projects, publications, or relevant work"
                          className="min-h-[80px]"
                          value={applicationData.previousWork}
                          onChange={(e) => setApplicationData({...applicationData, previousWork: e.target.value})}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="terms" 
                          checked={applicationData.agreeTerms}
                          onCheckedChange={(checked) => setApplicationData({...applicationData, agreeTerms: checked as boolean})}
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the grant terms and conditions, and understand that funding is subject to milestone completion
                        </Label>
                      </div>

                      <Button 
                        className="w-full" 
                        onClick={handleApplicationSubmit}
                        disabled={!applicationData.agreeTerms || !applicationData.projectTitle || !applicationData.description}
                      >
                        Submit Application
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="lg">
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="lg">
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </Button>
              </div>
            </div>

            {/* Grant Info Card */}
            <Card className="lg:w-96">
              <CardHeader>
                <CardTitle>Grant Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {grant.amount.toLocaleString()} {grant.currency}
                  </div>
                  <div className="text-sm text-muted-foreground">Maximum grant amount</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{grant.applicants}</div>
                    <div className="text-sm text-muted-foreground">Applicants</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{grant.approved}</div>
                    <div className="text-sm text-muted-foreground">Approved</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Application Deadline</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {new Date(grant.deadline).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.ceil((new Date(grant.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Focus Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {grant.focusAreas.slice(0, 4).map((area, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                    {grant.focusAreas.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{grant.focusAreas.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Grant Details Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="previous">Previous Grants</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Grant Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none">
                    <p>
                      The Stacks Education Initiative Grant is designed to accelerate learning and adoption 
                      within the Stacks ecosystem by supporting high-quality educational content and resources.
                    </p>
                    <h4>What We're Looking For:</h4>
                    <ul>
                      <li>Comprehensive tutorials and guides</li>
                      <li>Interactive learning experiences</li>
                      <li>Developer documentation and tools</li>
                      <li>Community workshops and events</li>
                      <li>Educational video content</li>
                      <li>Open-source learning platforms</li>
                    </ul>
                    <h4>Impact Goals:</h4>
                    <p>
                      We aim to onboard 10,000+ new developers to the Stacks ecosystem through funded 
                      educational initiatives. Priority will be given to projects with measurable learning 
                      outcomes and community engagement metrics.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Evaluation Criteria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Educational Value</span>
                        <span className="font-medium">30%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Technical Quality</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Community Impact</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Innovation</span>
                        <span className="font-medium">15%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Team Experience</span>
                        <span className="font-medium">10%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Grant Provider</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={grant.provider.avatar || "/placeholder.svg"} alt={grant.provider.name} />
                        <AvatarFallback>SF</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{grant.provider.name}</span>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="text-sm text-muted-foreground">Verified Grant Provider</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Grants</span>
                        <span className="font-medium">{grant.provider.totalGrants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Funded</span>
                        <span className="font-medium">{grant.provider.totalFunded.toLocaleString()} STX</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Application Process</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">1</div>
                      <span>Submit application</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">2</div>
                      <span>Initial review (5-7 days)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">3</div>
                      <span>Interview process</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">4</div>
                      <span>Final decision</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {grant.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Eligibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {grant.eligibility.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4">
            {grant.milestones.map((milestone, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{milestone.title}</h3>
                        <Badge variant="secondary">{milestone.percentage}% of grant</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{milestone.description}</p>
                      <div>
                        <h4 className="font-medium mb-2">Deliverables:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {milestone.deliverables.map((deliverable, idx) => (
                            <li key={idx}>{deliverable}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="previous" className="space-y-4">
            {grant.previousGrants.map((prevGrant, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{prevGrant.title}</h3>
                    <Badge variant={prevGrant.status === "completed" ? "default" : "secondary"}>
                      {prevGrant.status}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Recipient:</span>
                      <div className="font-medium">{prevGrant.recipient}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <div className="font-medium">{prevGrant.amount.toLocaleString()} STX</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Impact:</span>
                      <div className="font-medium">{prevGrant.impact}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">How long does the application process take?</h4>
                  <p className="text-sm text-muted-foreground">
                    The typical application process takes 2-3 weeks from submission to final decision. 
                    This includes initial review, potential interviews, and final evaluation.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Can I apply for multiple grants?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can apply for multiple grants, but each application should be for a distinct project. 
                    We encourage focusing on quality over quantity.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">What happens if I don't meet a milestone?</h4>
                  <p className="text-sm text-muted-foreground">
                    We work with grantees to address challenges. Extensions may be granted for valid reasons, 
                    but consistent failure to meet milestones may result in grant termination.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Are there any restrictions on the content?</h4>
                  <p className="text-sm text-muted-foreground">
                    Content should be educational, accurate, and aligned with Stacks ecosystem values. 
                    We prefer open-source materials that can benefit the broader community.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

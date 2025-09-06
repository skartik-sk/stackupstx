"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Plus, X, DollarSign } from "lucide-react"

export default function ProjectApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [milestones, setMilestones] = useState([{ title: "", description: "", amount: "", timeline: "" }])

  const [formData, setFormData] = useState({
    // Project Info
    projectName: "",
    category: "",
    description: "",
    problem: "",
    solution: "",

    // Funding
    totalFunding: "",
    fundingBreakdown: "",

    // Team
    teamSize: "",
    teamExperience: "",
    teamMembers: "",

    // Technical
    techStack: [] as string[],
    architecture: "",
    challenges: "",

    // Market
    targetAudience: "",
    marketSize: "",
    competition: "",

    // Additional
    timeline: "",
    risks: "",
    agreeTerms: false,
  })

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100

  const categories = [
    "DeFi",
    "NFTs",
    "Gaming",
    "Infrastructure",
    "Analytics",
    "Developer Tools",
    "Social",
    "Marketplace",
    "Other",
  ]

  const techOptions = [
    "Clarity",
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Rust",
    "Solidity",
    "Web3",
    "Stacks.js",
    "Next.js",
    "PostgreSQL",
  ]

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", description: "", amount: "", timeline: "" }])
  }

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index))
    }
  }

  const updateMilestone = (index: number, field: string, value: string) => {
    const updated = milestones.map((milestone, i) => (i === index ? { ...milestone, [field]: value } : milestone))
    setMilestones(updated)
  }

  const handleTechStackChange = (tech: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, tech],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        techStack: prev.techStack.filter((t) => t !== tech),
      }))
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    console.log("Project application submitted:", { formData, milestones })
    // Handle form submission
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.projectName && formData.category && formData.description
      case 2:
        return formData.totalFunding && milestones[0].title
      case 3:
        return formData.teamSize && formData.teamExperience
      case 4:
        return formData.techStack.length > 0 && formData.architecture
      case 5:
        return formData.targetAudience && formData.timeline
      case 6:
        return formData.agreeTerms
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit Project for Funding</h1>
          <p className="text-muted-foreground">
            Present your project idea to the community and secure milestone-based funding.
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Project Info</span>
              <span>Funding</span>
              <span>Team</span>
              <span>Technical</span>
              <span>Market</span>
              <span>Review</span>
            </div>
          </CardContent>
        </Card>

        {/* Form Steps */}
        <Card>
          <CardContent className="pt-6">
            {/* Step 1: Project Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Project Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="projectName">Project Name *</Label>
                      <Input
                        id="projectName"
                        placeholder="Enter your project name"
                        value={formData.projectName}
                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="description">Project Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide a comprehensive description of your project"
                        className="min-h-[120px]"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="problem">Problem Statement</Label>
                      <Textarea
                        id="problem"
                        placeholder="What problem does your project solve?"
                        className="min-h-[100px]"
                        value={formData.problem}
                        onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="solution">Proposed Solution</Label>
                      <Textarea
                        id="solution"
                        placeholder="How does your project solve this problem?"
                        className="min-h-[100px]"
                        value={formData.solution}
                        onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Funding & Milestones */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Funding & Milestones</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="totalFunding">Total Funding Requested (STX) *</Label>
                        <Input
                          id="totalFunding"
                          type="number"
                          placeholder="50000"
                          value={formData.totalFunding}
                          onChange={(e) => setFormData({ ...formData, totalFunding: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="timeline">Project Timeline</Label>
                        <Select
                          value={formData.timeline}
                          onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3m">3 months</SelectItem>
                            <SelectItem value="6m">6 months</SelectItem>
                            <SelectItem value="12m">12 months</SelectItem>
                            <SelectItem value="18m">18+ months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="fundingBreakdown">Funding Breakdown</Label>
                      <Textarea
                        id="fundingBreakdown"
                        placeholder="Explain how you plan to use the funding (development, marketing, operations, etc.)"
                        className="min-h-[100px]"
                        value={formData.fundingBreakdown}
                        onChange={(e) => setFormData({ ...formData, fundingBreakdown: e.target.value })}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Label>Project Milestones *</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Milestone
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {milestones.map((milestone, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium">Milestone {index + 1}</h4>
                              {milestones.length > 1 && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => removeMilestone(index)}>
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <Input
                                placeholder="Milestone title"
                                value={milestone.title}
                                onChange={(e) => updateMilestone(index, "title", e.target.value)}
                              />
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  placeholder="Amount (STX)"
                                  className="pl-10"
                                  value={milestone.amount}
                                  onChange={(e) => updateMilestone(index, "amount", e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <Textarea
                                placeholder="Milestone description"
                                className="min-h-[80px]"
                                value={milestone.description}
                                onChange={(e) => updateMilestone(index, "description", e.target.value)}
                              />
                              <Input
                                placeholder="Timeline (e.g., Week 4)"
                                value={milestone.timeline}
                                onChange={(e) => updateMilestone(index, "timeline", e.target.value)}
                              />
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Team Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Team Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="teamSize">Team Size *</Label>
                        <Select
                          value={formData.teamSize}
                          onValueChange={(value) => setFormData({ ...formData, teamSize: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select team size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Solo (1 person)</SelectItem>
                            <SelectItem value="2-3">Small team (2-3 people)</SelectItem>
                            <SelectItem value="4-6">Medium team (4-6 people)</SelectItem>
                            <SelectItem value="7+">Large team (7+ people)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="teamExperience">Team Experience *</Label>
                      <Textarea
                        id="teamExperience"
                        placeholder="Describe your team's relevant experience and qualifications"
                        className="min-h-[120px]"
                        value={formData.teamExperience}
                        onChange={(e) => setFormData({ ...formData, teamExperience: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="teamMembers">Team Members</Label>
                      <Textarea
                        id="teamMembers"
                        placeholder="List team members, their roles, and brief backgrounds"
                        className="min-h-[120px]"
                        value={formData.teamMembers}
                        onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Technical Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Technical Details</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Technology Stack *</Label>
                      <p className="text-sm text-muted-foreground mb-3">Select all technologies you plan to use</p>
                      <div className="grid grid-cols-3 gap-3">
                        {techOptions.map((tech) => (
                          <div key={tech} className="flex items-center space-x-2">
                            <Checkbox
                              id={tech}
                              checked={formData.techStack.includes(tech)}
                              onCheckedChange={(checked) => handleTechStackChange(tech, checked as boolean)}
                            />
                            <Label htmlFor={tech} className="text-sm">
                              {tech}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {formData.techStack.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {formData.techStack.map((tech) => (
                            <Badge key={tech} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="architecture">Technical Architecture *</Label>
                      <Textarea
                        id="architecture"
                        placeholder="Describe your technical architecture and approach"
                        className="min-h-[120px]"
                        value={formData.architecture}
                        onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="challenges">Technical Challenges</Label>
                      <Textarea
                        id="challenges"
                        placeholder="Identify potential technical challenges and your approach to solving them"
                        className="min-h-[100px]"
                        value={formData.challenges}
                        onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Market & Strategy */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Market & Strategy</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="targetAudience">Target Audience *</Label>
                      <Textarea
                        id="targetAudience"
                        placeholder="Who is your target audience? How will they benefit from your project?"
                        className="min-h-[100px]"
                        value={formData.targetAudience}
                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="marketSize">Market Size & Opportunity</Label>
                      <Textarea
                        id="marketSize"
                        placeholder="Describe the market opportunity and potential impact"
                        className="min-h-[100px]"
                        value={formData.marketSize}
                        onChange={(e) => setFormData({ ...formData, marketSize: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="competition">Competitive Analysis</Label>
                      <Textarea
                        id="competition"
                        placeholder="How does your project compare to existing solutions?"
                        className="min-h-[100px]"
                        value={formData.competition}
                        onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="risks">Risks & Mitigation</Label>
                      <Textarea
                        id="risks"
                        placeholder="Identify potential risks and your mitigation strategies"
                        className="min-h-[100px]"
                        value={formData.risks}
                        onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Review & Submit */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Project Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium">Project Name:</span>
                            <p className="text-sm text-muted-foreground">{formData.projectName}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Category:</span>
                            <p className="text-sm text-muted-foreground">{formData.category}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Total Funding:</span>
                            <p className="text-sm text-muted-foreground">{formData.totalFunding} STX</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Timeline:</span>
                            <p className="text-sm text-muted-foreground">{formData.timeline}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Team Size:</span>
                            <p className="text-sm text-muted-foreground">{formData.teamSize}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Milestones:</span>
                            <p className="text-sm text-muted-foreground">{milestones.length} milestones</p>
                          </div>
                        </div>

                        <div>
                          <span className="text-sm font-medium">Technology Stack:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {formData.techStack.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the terms and conditions, and understand that funding will be released based on
                        milestone completion
                      </Label>
                    </div>

                    {!formData.agreeTerms && (
                      <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800">
                          Please agree to the terms and conditions to submit your project
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                Previous
              </Button>

              <div className="flex gap-2">
                {currentStep < totalSteps ? (
                  <Button onClick={nextStep} disabled={!isStepValid(currentStep)}>
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStepValid(currentStep)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Submit Project
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

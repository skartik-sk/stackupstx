"use client"

import type React from "react"

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
import { AlertCircle, CheckCircle, Upload, X } from "lucide-react"

export default function BountyApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    category: "",
    description: "",
    approach: "",

    // Timeline & Budget
    estimatedHours: "",
    timeline: "",
    milestones: "",

    // Experience
    experience: "",
    portfolio: "",
    githubProfile: "",
    previousWork: "",

    // Technical Details
    techStack: [] as string[],
    challenges: "",
    deliverables: "",

    // Additional
    questions: "",
    availability: "",
    communication: "",
    agreeTerms: false,

    // Files
    attachments: [] as File[],
  })

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const categories = [
    "Smart Contracts",
    "DeFi",
    "NFTs",
    "Developer Tools",
    "Security",
    "Infrastructure",
    "Analytics",
    "Gaming",
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
  ]

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }))
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
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
    console.log("Bounty application submitted:", formData)
    // Handle form submission
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.category && formData.description && formData.approach
      case 2:
        return formData.estimatedHours && formData.timeline && formData.milestones
      case 3:
        return formData.experience && formData.portfolio
      case 4:
        return formData.techStack.length > 0 && formData.deliverables
      case 5:
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
          <h1 className="text-3xl font-bold mb-2">Apply for Bounty</h1>
          <p className="text-muted-foreground">
            Complete your bounty application by providing detailed information about your approach and experience.
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
              <span>Basic Info</span>
              <span>Timeline</span>
              <span>Experience</span>
              <span>Technical</span>
              <span>Review</span>
            </div>
          </CardContent>
        </Card>

        {/* Form Steps */}
        <Card>
          <CardContent className="pt-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Application Title *</Label>
                      <Input
                        id="title"
                        placeholder="Brief title for your application"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                        placeholder="Describe what you plan to build and why it's valuable"
                        className="min-h-[120px]"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="approach">Technical Approach *</Label>
                      <Textarea
                        id="approach"
                        placeholder="Explain your technical approach and methodology"
                        className="min-h-[120px]"
                        value={formData.approach}
                        onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Timeline & Budget */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Timeline & Planning</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="estimatedHours">Estimated Hours *</Label>
                        <Input
                          id="estimatedHours"
                          type="number"
                          placeholder="Total hours needed"
                          value={formData.estimatedHours}
                          onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="timeline">Timeline *</Label>
                        <Select
                          value={formData.timeline}
                          onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-2">1-2 weeks</SelectItem>
                            <SelectItem value="2-4">2-4 weeks</SelectItem>
                            <SelectItem value="1-2m">1-2 months</SelectItem>
                            <SelectItem value="2-3m">2-3 months</SelectItem>
                            <SelectItem value="3m+">3+ months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="milestones">Project Milestones *</Label>
                      <Textarea
                        id="milestones"
                        placeholder="Break down your project into key milestones with timelines"
                        className="min-h-[120px]"
                        value={formData.milestones}
                        onChange={(e) => setFormData({ ...formData, milestones: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="availability">Availability</Label>
                        <Select
                          value={formData.availability}
                          onValueChange={(value) => setFormData({ ...formData, availability: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Your availability" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time (40+ hrs/week)</SelectItem>
                            <SelectItem value="part-time">Part-time (20-40 hrs/week)</SelectItem>
                            <SelectItem value="weekends">Weekends only</SelectItem>
                            <SelectItem value="flexible">Flexible schedule</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="communication">Preferred Communication</Label>
                        <Select
                          value={formData.communication}
                          onValueChange={(value) => setFormData({ ...formData, communication: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Communication method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="discord">Discord</SelectItem>
                            <SelectItem value="slack">Slack</SelectItem>
                            <SelectItem value="telegram">Telegram</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Experience & Portfolio */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Experience & Portfolio</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="experience">Relevant Experience *</Label>
                      <Textarea
                        id="experience"
                        placeholder="Describe your relevant experience and qualifications"
                        className="min-h-[120px]"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="portfolio">Portfolio/Previous Work *</Label>
                      <Textarea
                        id="portfolio"
                        placeholder="Links to your portfolio, previous projects, or relevant work"
                        className="min-h-[100px]"
                        value={formData.portfolio}
                        onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="githubProfile">GitHub Profile</Label>
                        <Input
                          id="githubProfile"
                          placeholder="https://github.com/username"
                          value={formData.githubProfile}
                          onChange={(e) => setFormData({ ...formData, githubProfile: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="previousWork">Previous Bounties/Projects</Label>
                        <Input
                          id="previousWork"
                          placeholder="Number of completed projects"
                          value={formData.previousWork}
                          onChange={(e) => setFormData({ ...formData, previousWork: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>File Attachments</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload portfolio files, certificates, or relevant documents
                        </p>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <Label htmlFor="file-upload" className="cursor-pointer">
                          <Button variant="outline" size="sm" asChild>
                            <span>Choose Files</span>
                          </Button>
                        </Label>
                      </div>

                      {formData.attachments.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {formData.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">{file.name}</span>
                              <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
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
                      <Label htmlFor="deliverables">Deliverables *</Label>
                      <Textarea
                        id="deliverables"
                        placeholder="List specific deliverables you will provide"
                        className="min-h-[120px]"
                        value={formData.deliverables}
                        onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="challenges">Potential Challenges</Label>
                      <Textarea
                        id="challenges"
                        placeholder="Identify potential challenges and how you plan to address them"
                        className="min-h-[100px]"
                        value={formData.challenges}
                        onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="questions">Questions/Clarifications</Label>
                      <Textarea
                        id="questions"
                        placeholder="Any questions about the requirements or scope?"
                        className="min-h-[80px]"
                        value={formData.questions}
                        onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Application Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium">Title:</span>
                            <p className="text-sm text-muted-foreground">{formData.title}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Category:</span>
                            <p className="text-sm text-muted-foreground">{formData.category}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Timeline:</span>
                            <p className="text-sm text-muted-foreground">{formData.timeline}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Estimated Hours:</span>
                            <p className="text-sm text-muted-foreground">{formData.estimatedHours} hours</p>
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

                        <div>
                          <span className="text-sm font-medium">Attachments:</span>
                          <p className="text-sm text-muted-foreground">
                            {formData.attachments.length} file(s) attached
                          </p>
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
                        I agree to the terms and conditions, and understand that this application will be reviewed by
                        the bounty creator
                      </Label>
                    </div>

                    {!formData.agreeTerms && (
                      <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800">
                          Please agree to the terms and conditions to submit your application
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
                    Next Step
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStepValid(currentStep)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Application
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

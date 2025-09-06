"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Sparkles, Brain, Target, Users, Lightbulb, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"

const categoryOptions = [
  { value: "defi", label: "DeFi & Finance", icon: TrendingUp },
  { value: "infrastructure", label: "Infrastructure", icon: Shield },
  { value: "social", label: "Social & Community", icon: Users },
  { value: "gaming", label: "Gaming & NFTs", icon: Target },
  { value: "tools", label: "Developer Tools", icon: Brain },
  { value: "other", label: "Other", icon: Lightbulb },
]

const targetAudienceOptions = [
  "Developers",
  "End Users",
  "Businesses",
  "DeFi Users",
  "NFT Collectors",
  "Content Creators",
  "Traders",
  "Institutions",
  "Students",
  "Researchers",
]

const implementationTimeOptions = [
  { value: "1-2weeks", label: "1-2 weeks" },
  { value: "1month", label: "1 month" },
  { value: "2-3months", label: "2-3 months" },
  { value: "6months", label: "6+ months" },
  { value: "unknown", label: "Not sure" },
]

export default function CreateIdeaPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    problem: "",
    solution: "",
    category: "",
    targetAudience: [] as string[],
    implementationTime: "",
    technicalRequirements: "",
    marketPotential: "",
    uniqueValue: "",
    inspiration: "",
    additionalNotes: "",
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalSteps = 3

  const handleAudienceToggle = (audience: string) => {
    setFormData((prev) => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(audience)
        ? prev.targetAudience.filter((a) => a !== audience)
        : [...prev.targetAudience, audience],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Idea submitted:", formData)
    setIsSubmitting(false)
    // Redirect to ideas page or show success message
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/ideas">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Ideas
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold text-balance">Submit Your Idea</h1>
              <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary">AI Analysis</span>
              </div>
            </div>
            <p className="text-muted-foreground">
              Share your innovative idea and get AI-powered insights and community feedback
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i + 1 <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`h-0.5 w-16 mx-2 ${i + 1 < currentStep ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}:{" "}
            {currentStep === 1 ? "Basic Information" : currentStep === 2 ? "Problem & Solution" : "Details & Analysis"}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Tell us about your idea in simple terms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Idea Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Decentralized Social Media Platform for Creators"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Brief Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a concise overview of your idea in 2-3 sentences..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => {
                          const Icon = category.icon
                          return (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {category.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Estimated Implementation Time</Label>
                    <Select
                      value={formData.implementationTime}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, implementationTime: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="How long to build?" />
                      </SelectTrigger>
                      <SelectContent>
                        {implementationTimeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Target Audience *</Label>
                  <p className="text-sm text-muted-foreground">Who would benefit from this idea?</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {targetAudienceOptions.map((audience) => (
                      <div key={audience} className="flex items-center space-x-2">
                        <Checkbox
                          id={audience}
                          checked={formData.targetAudience.includes(audience)}
                          onCheckedChange={() => handleAudienceToggle(audience)}
                        />
                        <Label htmlFor={audience} className="text-sm font-normal">
                          {audience}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.targetAudience.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.targetAudience.map((audience) => (
                        <Badge key={audience} variant="secondary">
                          {audience}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Problem & Solution */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Problem & Solution</CardTitle>
                <CardDescription>Help us understand the problem you're solving</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="problem">What problem does this solve? *</Label>
                  <Textarea
                    id="problem"
                    placeholder="Describe the specific problem or pain point your idea addresses..."
                    rows={4}
                    value={formData.problem}
                    onChange={(e) => setFormData((prev) => ({ ...prev, problem: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solution">How does your idea solve it? *</Label>
                  <Textarea
                    id="solution"
                    placeholder="Explain your proposed solution and how it works..."
                    rows={4}
                    value={formData.solution}
                    onChange={(e) => setFormData((prev) => ({ ...prev, solution: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uniqueValue">What makes this unique?</Label>
                  <Textarea
                    id="uniqueValue"
                    placeholder="What sets your idea apart from existing solutions?"
                    rows={3}
                    value={formData.uniqueValue}
                    onChange={(e) => setFormData((prev) => ({ ...prev, uniqueValue: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inspiration">Inspiration (Optional)</Label>
                  <Textarea
                    id="inspiration"
                    placeholder="What inspired this idea? Any existing solutions you're improving upon?"
                    rows={3}
                    value={formData.inspiration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, inspiration: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Technical Details */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Technical Details & Market Potential</CardTitle>
                <CardDescription>Additional details for AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="technicalRequirements">Technical Requirements</Label>
                  <Textarea
                    id="technicalRequirements"
                    placeholder="What technologies, skills, or resources would be needed to build this?"
                    rows={4}
                    value={formData.technicalRequirements}
                    onChange={(e) => setFormData((prev) => ({ ...prev, technicalRequirements: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marketPotential">Market Potential</Label>
                  <Textarea
                    id="marketPotential"
                    placeholder="How big is the potential market? Who are the competitors?"
                    rows={4}
                    value={formData.marketPotential}
                    onChange={(e) => setFormData((prev) => ({ ...prev, marketPotential: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="Any other details, concerns, or thoughts about your idea?"
                    rows={3}
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    AI Analysis Preview
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Once submitted, our AI will analyze your idea for:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Technical difficulty and feasibility assessment</li>
                    <li>• Innovation score and market potential</li>
                    <li>• Similar existing solutions detection</li>
                    <li>• Required skills and resource estimation</li>
                    <li>• Development timeline prediction</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing Idea...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Submit for AI Analysis
                  </div>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

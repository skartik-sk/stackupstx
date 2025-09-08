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
import { ArrowLeft, Sparkles, Brain, Target, Users, Lightbulb, TrendingUp, Shield, Wallet } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/contexts/WalletContext"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://stackup-backend-36eb8e6c-singupalli-kartiks-projects.vercel.app';

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
  const { isAuthenticated, user, connectWallet } = useWallet()
  const router = useRouter()
  
  const [creating, setCreating] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    problem: "",
    solution: "",
    category: "",
    targetAudience: [] as string[],
    implementationTime: "",
    technicalRequirements: "",
    estimatedBudget: "",
    additionalInfo: "",
    uniqueValue: "",
    inspiration: "",
    marketPotential: "",
    additionalNotes: "",
  })

  const [currentStep, setCurrentStep] = useState(1)
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
    
    if (!isAuthenticated || !user) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!formData.title || !formData.description || !formData.problem || !formData.solution) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setCreating(true)
      
      const ideaData = {
        title: formData.title,
        description: formData.description,
        problem: formData.problem,
        solution: formData.solution,
        category: formData.category,
        creator: user.stxAddress,
        targetAudience: formData.targetAudience,
        implementationTime: formData.implementationTime,
        technicalRequirements: formData.technicalRequirements,
        estimatedBudget: formData.estimatedBudget ? Number(formData.estimatedBudget) : undefined,
        tags: [...formData.targetAudience, formData.category].filter(Boolean),
        status: 'idea',
        votes: 0,
      }

      const response = await fetch(`${API_BASE_URL}/api/ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ideaData),
      })

      if (!response.ok) {
        throw new Error('Failed to create idea')
      }

      const newIdea = await response.json()
      toast.success('Idea submitted successfully!')
      router.push(`/ideas/${newIdea.data._id}`)
    } catch (error) {
      console.error('Error creating idea:', error)
      toast.error('Failed to create idea. Please try again.')
    } finally {
      setCreating(false)
    }
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
            <h1 className="text-3xl font-bold text-balance">Share Your Idea</h1>
            <p className="text-muted-foreground mt-1">Submit an innovative idea for the Stacks ecosystem</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i + 1 <= currentStep ? "bg-[#fc6431] text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`h-0.5 w-16 mx-2 ${i + 1 < currentStep ? "bg-[#fc6431]" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          {/* Wallet Connection Check */}
          {!isAuthenticated && (
            <Card className="mb-6 border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Wallet className="h-8 w-8 text-orange-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-800">Connect Your Wallet</h3>
                    <p className="text-orange-700 text-sm">
                      You need to connect your Stacks wallet to submit an idea. Your wallet address will be used as the idea creator.
                    </p>
                  </div>
                  <Button 
                    type="button"
                    onClick={connectWallet}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Connect Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Connected Wallet Info */}
          {isAuthenticated && user && (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-800 text-sm font-medium">
                    Connected as: {user.stxAddress}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 1: Core Idea */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-[#fc6431]" />
                  Core Idea
                </CardTitle>
                <CardDescription>Describe the fundamental concept of your idea</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Idea Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Decentralized Social Media for Developers"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Brief Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a clear, concise overview of your idea..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problem">Problem Statement *</Label>
                  <Textarea
                    id="problem"
                    placeholder="What problem does this idea solve? Why is it important?"
                    rows={4}
                    value={formData.problem}
                    onChange={(e) => setFormData((prev) => ({ ...prev, problem: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solution">Proposed Solution *</Label>
                  <Textarea
                    id="solution"
                    placeholder="How does your idea solve the problem? What makes it unique?"
                    rows={4}
                    value={formData.solution}
                    onChange={(e) => setFormData((prev) => ({ ...prev, solution: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
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
              </CardContent>
            </Card>
          )}

          {/* Step 2: Target & Implementation */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#fc6431]" />
                  Target & Implementation
                </CardTitle>
                <CardDescription>Define who this is for and how it could be built</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Target Audience</Label>
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

                <div className="space-y-2">
                  <Label>Estimated Implementation Time</Label>
                  <Select
                    value={formData.implementationTime}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, implementationTime: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="How long might this take to build?" />
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

                <div className="space-y-2">
                  <Label htmlFor="technical">Technical Requirements</Label>
                  <Textarea
                    id="technical"
                    placeholder="What technologies, skills, or resources would be needed?"
                    rows={4}
                    value={formData.technicalRequirements}
                    onChange={(e) => setFormData((prev) => ({ ...prev, technicalRequirements: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Estimated Budget (STX)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="50000"
                    value={formData.estimatedBudget}
                    onChange={(e) => setFormData((prev) => ({ ...prev, estimatedBudget: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Optional: Rough estimate of funding needed to develop this idea
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Additional Details */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#fc6431]" />
                  Additional Details
                </CardTitle>
                <CardDescription>Provide more context and review your submission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="unique">What Makes This Unique?</Label>
                  <Textarea
                    id="unique"
                    placeholder="How is this different from existing solutions?"
                    rows={3}
                    value={formData.uniqueValue}
                    onChange={(e) => setFormData((prev) => ({ ...prev, uniqueValue: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inspiration">Inspiration & References</Label>
                  <Textarea
                    id="inspiration"
                    placeholder="What inspired this idea? Any similar projects or research?"
                    rows={3}
                    value={formData.inspiration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, inspiration: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="market">Market Potential</Label>
                  <Textarea
                    id="market"
                    placeholder="Who would benefit from this? What's the potential impact?"
                    rows={3}
                    value={formData.marketPotential}
                    onChange={(e) => setFormData((prev) => ({ ...prev, marketPotential: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional">Additional Notes</Label>
                  <Textarea
                    id="additional"
                    placeholder="Anything else you'd like to share about this idea?"
                    rows={3}
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                  />
                </div>

                {/* Review Section */}
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Review Your Idea</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Title:</span> {formData.title}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {formData.category}
                    </div>
                    {formData.estimatedBudget && (
                      <div>
                        <span className="font-medium">Estimated Budget:</span> {formData.estimatedBudget} STX
                      </div>
                    )}
                    {formData.targetAudience.length > 0 && (
                      <div>
                        <span className="font-medium">Target Audience:</span> {formData.targetAudience.join(", ")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">What happens next?</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your idea will be published and visible to the community</li>
                    <li>• Community members can vote and provide feedback</li>
                    <li>• Popular ideas may attract funding or development interest</li>
                    <li>• You can update your idea based on community input</li>
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
              <Button 
                type="button" 
                onClick={nextStep} 
                disabled={!isAuthenticated}
                className="bg-[#fc6431] hover:bg-[#e55a2b] text-white"
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="bg-[#fc6431] hover:bg-[#e55a2b] text-white"
                disabled={!isAuthenticated || creating}
              >
                {creating ? 'Submitting Idea...' : 'Submit Idea'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

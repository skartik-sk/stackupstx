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
import { ArrowLeft, Building, DollarSign, Calendar, Award, Wallet } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/contexts/WalletContext"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://stackup-backend-36eb8e6c-singupalli-kartiks-projects.vercel.app';

const grantTypeOptions = [
  { value: "research", label: "Research Grant", description: "For academic research and studies" },
  { value: "development", label: "Development Grant", description: "For building applications and tools" },
  { value: "education", label: "Education Grant", description: "For educational content and programs" },
  { value: "community", label: "Community Grant", description: "For community building initiatives" },
  { value: "infrastructure", label: "Infrastructure Grant", description: "For core infrastructure development" },
]

const focusAreaOptions = [
  "DeFi Protocols",
  "Smart Contracts",
  "Developer Tools",
  "Educational Content",
  "Community Building",
  "Security Research",
  "Scalability Solutions",
  "User Experience",
  "Documentation",
  "Testing & QA",
  "Integration Tools",
  "Analytics & Monitoring",
]

const eligibilityOptions = [
  "Individual Developers",
  "Development Teams",
  "Academic Institutions",
  "Non-profit Organizations",
  "Startups",
  "Established Companies",
  "Open Source Projects",
  "Research Groups",
]

export default function CreateGrantPage() {
  const { isAuthenticated, user, connectWallet } = useWallet()
  const router = useRouter()
  const [creating, setCreating] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    grantType: "",
    focusAreas: [] as string[],
    amount: "",
    currency: "STX",
    duration: "",
    applicationDeadline: "",
    startDate: "",
    eligibility: [] as string[],
    requirements: "",
    deliverables: "",
    milestones: "",
    evaluationCriteria: "",
    organizationName: "",
    organizationDescription: "",
    contactEmail: "",
    website: "",
    additionalInfo: "",
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const handleFocusAreaToggle = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter((a) => a !== area)
        : [...prev.focusAreas, area],
    }))
  }

  const handleEligibilityToggle = (eligibility: string) => {
    setFormData((prev) => ({
      ...prev,
      eligibility: prev.eligibility.includes(eligibility)
        ? prev.eligibility.filter((e) => e !== eligibility)
        : [...prev.eligibility, eligibility],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated || !user) {
      toast.error('Please connect your wallet first')
      return
    }

    try {
      setCreating(true)
      
      const grantData = {
        title: formData.title,
        description: formData.description,
        amount: Number(formData.amount),
        organization: formData.organizationName,
        deadline: formData.applicationDeadline,
        status: 'open' as const,
        category: formData.grantType,
        requirements: [formData.requirements, ...formData.eligibility],
        creatorAddress: user.stxAddress,
        focusAreas: formData.focusAreas,
        duration: formData.duration,
        startDate: formData.startDate,
        deliverables: formData.deliverables,
        milestones: formData.milestones,
        evaluationCriteria: formData.evaluationCriteria,
        organizationDescription: formData.organizationDescription,
        contactEmail: formData.contactEmail,
        website: formData.website,
        additionalInfo: formData.additionalInfo,
      }

      const response = await fetch(`${API_BASE_URL}/api/grants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(grantData),
      })

      if (!response.ok) {
        throw new Error('Failed to create grant')
      }

      const newGrant = await response.json()
      toast.success('Grant created successfully!')
      router.push(`/grants/${newGrant._id}`)
    } catch (error) {
      console.error('Error creating grant:', error)
      toast.error('Failed to create grant. Please try again.')
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
          <Link href="/grants">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Grants
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-balance">Create New Grant</h1>
            <p className="text-muted-foreground mt-1">Provide funding opportunities for the Stacks ecosystem</p>
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
            {currentStep === 1
              ? "Grant Details"
              : currentStep === 2
                ? "Funding & Timeline"
                : currentStep === 3
                  ? "Requirements & Eligibility"
                  : "Organization Info"}
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
                      You need to connect your Stacks wallet to create a grant. Your wallet address will be used for grant management.
                    </p>
                  </div>
                  <Button 
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
          {/* Step 1: Grant Details */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Grant Details</CardTitle>
                <CardDescription>Provide the basic information about your grant program</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Grant Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Stacks DeFi Innovation Grant 2024"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Grant Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the purpose of this grant, what you're looking to fund, and the impact you want to achieve..."
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Grant Type *</Label>
                  <Select
                    value={formData.grantType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, grantType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grant type" />
                    </SelectTrigger>
                    <SelectContent>
                      {grantTypeOptions.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Focus Areas *</Label>
                  <p className="text-sm text-muted-foreground">Select the areas this grant will focus on</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {focusAreaOptions.map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          checked={formData.focusAreas.includes(area)}
                          onCheckedChange={() => handleFocusAreaToggle(area)}
                        />
                        <Label htmlFor={area} className="text-sm font-normal">
                          {area}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.focusAreas.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.focusAreas.map((area) => (
                        <Badge key={area} variant="secondary">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Funding & Timeline */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Funding & Timeline</CardTitle>
                <CardDescription>Set the grant amount, currency, and important dates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Grant Amount *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="50000"
                        className="pl-10"
                        value={formData.amount}
                        onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Currency *</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STX">STX (Stacks)</SelectItem>
                        <SelectItem value="BTC">BTC (Bitcoin)</SelectItem>
                        <SelectItem value="USD">USD (US Dollar)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Grant Duration *</Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3months">3 months</SelectItem>
                        <SelectItem value="6months">6 months</SelectItem>
                        <SelectItem value="12months">12 months</SelectItem>
                        <SelectItem value="18months">18 months</SelectItem>
                        <SelectItem value="24months">24 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="applicationDeadline">Application Deadline *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="applicationDeadline"
                        type="date"
                        className="pl-10"
                        value={formData.applicationDeadline}
                        onChange={(e) => setFormData((prev) => ({ ...prev, applicationDeadline: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Expected Start Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="startDate"
                        type="date"
                        className="pl-10"
                        value={formData.startDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Milestone-Based Funding</h4>
                  <p className="text-sm text-muted-foreground">
                    Grant funds will be released based on milestone completion and approval. This ensures accountability
                    and progress tracking throughout the grant period.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Requirements & Eligibility */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements & Eligibility</CardTitle>
                <CardDescription>Define who can apply and what you expect from applicants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Eligible Applicants *</Label>
                  <p className="text-sm text-muted-foreground">Who can apply for this grant?</p>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                    {eligibilityOptions.map((eligibility) => (
                      <div key={eligibility} className="flex items-center space-x-2">
                        <Checkbox
                          id={eligibility}
                          checked={formData.eligibility.includes(eligibility)}
                          onCheckedChange={() => handleEligibilityToggle(eligibility)}
                        />
                        <Label htmlFor={eligibility} className="text-sm font-normal">
                          {eligibility}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Application Requirements *</Label>
                  <Textarea
                    id="requirements"
                    placeholder="List specific requirements for applicants (e.g., experience level, portfolio, team composition...)"
                    rows={4}
                    value={formData.requirements}
                    onChange={(e) => setFormData((prev) => ({ ...prev, requirements: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliverables">Expected Deliverables *</Label>
                  <Textarea
                    id="deliverables"
                    placeholder="What should be delivered at the end of the grant period?"
                    rows={4}
                    value={formData.deliverables}
                    onChange={(e) => setFormData((prev) => ({ ...prev, deliverables: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="milestones">Milestone Structure</Label>
                  <Textarea
                    id="milestones"
                    placeholder="Describe the milestone structure and payment schedule..."
                    rows={4}
                    value={formData.milestones}
                    onChange={(e) => setFormData((prev) => ({ ...prev, milestones: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evaluationCriteria">Evaluation Criteria *</Label>
                  <Textarea
                    id="evaluationCriteria"
                    placeholder="How will applications be evaluated? What criteria will be used?"
                    rows={4}
                    value={formData.evaluationCriteria}
                    onChange={(e) => setFormData((prev) => ({ ...prev, evaluationCriteria: e.target.value }))}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Organization Information */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>Tell us about your organization and provide contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name *</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="organizationName"
                      placeholder="e.g., Stacks Foundation"
                      className="pl-10"
                      value={formData.organizationName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, organizationName: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizationDescription">Organization Description *</Label>
                  <Textarea
                    id="organizationDescription"
                    placeholder="Describe your organization, its mission, and why you're offering this grant..."
                    rows={4}
                    value={formData.organizationDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, organizationDescription: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="grants@organization.com"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://organization.com"
                      value={formData.website}
                      onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Any additional information about the grant or application process..."
                    rows={3}
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData((prev) => ({ ...prev, additionalInfo: e.target.value }))}
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Grant Review Process</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    After submission, your grant will go through our review process:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Organization verification and due diligence</li>
                    <li>• Grant details review and approval</li>
                    <li>• Publication on the grants platform</li>
                    <li>• Application collection and management</li>
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
              <Button type="button" onClick={nextStep} disabled={!isAuthenticated}>
                Next
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
                disabled={!isAuthenticated || creating}
              >
                <Award className="h-4 w-4 mr-2" />
                {creating ? 'Creating Grant...' : 'Submit Grant for Review'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

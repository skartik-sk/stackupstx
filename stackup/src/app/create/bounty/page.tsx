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
import { ArrowLeft, DollarSign, Calendar, Users, Code, Shield, Zap, Wallet } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/contexts/WalletContext"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://stackup-backend-4a2z9lasp-singupalli-kartiks-projects.vercel.app';

const skillOptions = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Rust",
  "Solidity",
  "Clarity",
  "Smart Contracts",
  "Web3",
  "DeFi",
  "UI/UX Design",
  "DevOps",
  "Testing",
  "Security",
]

const categoryOptions = [
  { value: "development", label: "Development", icon: Code },
  { value: "security", label: "Security", icon: Shield },
  { value: "design", label: "Design", icon: Zap },
  { value: "research", label: "Research", icon: Users },
]

export default function CreateBountyPage() {
  const { isAuthenticated, user, connectWallet } = useWallet()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    amount: "",
    deadline: "",
    requirements: "",
    deliverables: "",
    skills: [] as string[],
    attachments: [] as File[],
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [creating, setCreating] = useState(false)
  const totalSteps = 4

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(e.target.files!)],
      }))
    }
  }

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated || !user) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!formData.title || !formData.description || !formData.amount || !formData.deadline) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setCreating(true)
      
      const bountyData = {
        title: formData.title,
        description: formData.description,
        amount: Number(formData.amount),
        creator: user.stxAddress,
        deadline: formData.deadline,
        status: 'open',
        category: formData.category,
        skills: formData.skills,
        requirements: formData.requirements,
        deliverables: formData.deliverables,
        difficulty: formData.difficulty,
      }

      const response = await fetch(`${API_BASE_URL}/api/bounties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bountyData),
      })

      if (!response.ok) {
        throw new Error('Failed to create bounty')
      }

      const newBounty = await response.json()
      toast.success('Bounty created successfully!')
      router.push(`/bounties/${newBounty.data._id}`)
    } catch (error) {
      console.error('Error creating bounty:', error)
      toast.error('Failed to create bounty. Please try again.')
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
          <Link href="/bounties">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bounties
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-balance">Create New Bounty</h1>
            <p className="text-muted-foreground mt-1">Post a bounty to get help from the Stacks community</p>
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
                      You need to connect your Stacks wallet to create a bounty. Your wallet address will be used as the bounty creator.
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

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Provide the essential details about your bounty</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Bounty Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Build a DeFi lending protocol on Stacks"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you need built, the problem it solves, and any specific requirements..."
                    rows={6}
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
                    <Label>Difficulty Level *</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Reward & Timeline */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Reward & Timeline</CardTitle>
                <CardDescription>Set the bounty reward and deadline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="reward">Reward Amount (STX) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reward"
                        type="number"
                        placeholder="1000"
                        className="pl-10"
                        value={formData.amount}
                        onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Funds will be held in escrow until completion</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="deadline"
                        type="date"
                        className="pl-10"
                        value={formData.deadline}
                        onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Escrow Protection</h4>
                  <p className="text-sm text-muted-foreground">
                    Your funds will be securely held in a smart contract escrow until the bounty is completed and
                    approved. This protects both you and the bounty hunter.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Requirements & Skills */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements & Skills</CardTitle>
                <CardDescription>Specify what you need and the required skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements *</Label>
                  <Textarea
                    id="requirements"
                    placeholder="List specific requirements, technical specifications, or constraints..."
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
                    placeholder="What should be delivered? (e.g., source code, documentation, deployed contract...)"
                    rows={4}
                    value={formData.deliverables}
                    onChange={(e) => setFormData((prev) => ({ ...prev, deliverables: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label>Required Skills</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {skillOptions.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                        />
                        <Label htmlFor={skill} className="text-sm font-normal">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Review & Submit</CardTitle>
                <CardDescription>Review your bounty details before publishing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Title</h4>
                    <p className="text-muted-foreground">{formData.title}</p>
                  </div>

                  <div>
                    <h4 className="font-medium">Description</h4>
                    <p className="text-muted-foreground">{formData.description}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <h4 className="font-medium">Category</h4>
                      <p className="text-muted-foreground capitalize">{formData.category}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Difficulty</h4>
                      <p className="text-muted-foreground capitalize">{formData.difficulty}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Reward</h4>
                      <p className="text-muted-foreground">{formData.amount} STX</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Deadline</h4>
                      <p className="text-muted-foreground">{formData.deadline}</p>
                    </div>
                  </div>

                  {formData.skills.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">What happens next?</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your bounty will be published and visible to the community</li>
                    <li>• Developers can apply and submit their proposals</li>
                    <li>• You can review applications and select the best candidate</li>
                    <li>• Funds are released from escrow upon completion</li>
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
                {creating ? 'Creating Bounty...' : 'Create Bounty'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

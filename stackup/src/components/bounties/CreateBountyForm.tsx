'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useStacks } from '@/providers/StacksProvider'
import { createBounty, stxToMicroStx, formatStx } from '@/lib/contracts'
import { toast } from 'react-hot-toast'
import { Coins, Target, Clock, Users } from 'lucide-react'

interface CreateBountyFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateBountyForm({ onSuccess, onCancel }: CreateBountyFormProps) {
  const { account, isConnected } = useStacks()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    amount: '',
    workerAddress: '',
    category: '',
    difficulty: '',
    timeline: '',
  })

  const categories = [
    'Frontend Development',
    'Backend Development',
    'Smart Contracts',
    'UI/UX Design',
    'Documentation',
    'Testing',
    'Marketing',
    'Community Management',
  ]

  const difficulties = [
    { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' },
  ]

  const timelines = [
    '1-3 days',
    '1 week',
    '2 weeks',
    '1 month',
    '2-3 months',
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a bounty title')
      return false
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a description')
      return false
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount')
      return false
    }
    if (!formData.workerAddress.trim()) {
      toast.error('Please enter a worker address')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected || !account) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const amountInMicroStx = stxToMicroStx(parseFloat(formData.amount))
      
      // Create the bounty on-chain
      await createBounty({
        workerAddress: formData.workerAddress,
        amount: amountInMicroStx,
        onFinish: async (data) => {
          console.log('Bounty creation transaction submitted:', data)
          toast.success('Bounty creation transaction submitted!')
          
          // Store additional bounty metadata in backend
          try {
            const response = await fetch('/api/bounties', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: formData.title,
                description: formData.description,
                requirements: formData.requirements,
                amount: parseFloat(formData.amount),
                creatorAddress: account.address,
                workerAddress: formData.workerAddress,
                category: formData.category,
                difficulty: formData.difficulty,
                timeline: formData.timeline,
                txId: data.txId,
                status: 'pending',
              }),
            })

            if (response.ok) {
              toast.success('Bounty metadata saved successfully!')
              if (onSuccess) onSuccess()
            } else {
              toast.error('Failed to save bounty metadata')
            }
          } catch (error) {
            console.error('Error saving bounty metadata:', error)
            toast.error('Failed to save bounty metadata')
          }
        },
        onCancel: () => {
          toast.error('Transaction cancelled')
          setIsSubmitting(false)
        }
      })
    } catch (error) {
      console.error('Error creating bounty:', error)
      toast.error('Failed to create bounty')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Please connect your wallet to create a bounty
            </p>
            <Button>Connect Wallet</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Create New Bounty
        </CardTitle>
        <CardDescription>
          Create a bounty to incentivize development work on the Stacks ecosystem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Bounty Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Build a token transfer component"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what you want built, the goals, and any specific requirements..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="min-h-[120px] w-full"
            />
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Technical Requirements</Label>
            <Textarea
              id="requirements"
              placeholder="List specific technical requirements, technologies to use, deliverables..."
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              className="min-h-[100px] w-full"
            />
          </div>

          {/* Amount and Worker Address Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Amount (STX) *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.000001"
                min="0.000001"
                placeholder="10.0"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
              />
              {formData.amount && (
                <p className="text-sm text-muted-foreground">
                  ≈ {formatStx(stxToMicroStx(parseFloat(formData.amount) || 0))}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workerAddress">Worker Address *</Label>
              <Input
                id="workerAddress"
                placeholder="ST1ABC..."
                value={formData.workerAddress}
                onChange={(e) => handleInputChange('workerAddress', e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          </div>

          {/* Category and Difficulty Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff.value} value={diff.value}>
                      <div className="flex items-center gap-2">
                        <Badge className={diff.color}>{diff.label}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Expected Timeline
            </Label>
            <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                {timelines.map((timeline) => (
                  <SelectItem key={timeline} value={timeline}>
                    {timeline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Balance Display */}
          {account && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Your Balance:</span>
                <span className="font-medium">{formatStx(account.balance)}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creating Bounty...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Create Bounty
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateBountyForm

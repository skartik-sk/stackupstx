import mongoose, { Schema, Document } from 'mongoose'

export interface IGrant extends Document {
  title: string
  description: string
  creatorAddress: string
  fundingGoal: number
  currentFunding: number
  status: 'open' | 'funded' | 'in_progress' | 'completed' | 'cancelled'
  deadline?: Date
  category: string
  skills: string[]
  milestones: {
    title: string
    description: string
    amount: number
    completed: boolean
    completedAt?: Date
  }[]
  supporters: {
    address: string
    amount: number
    supportedAt: Date
  }[]
  applications: {
    applicantAddress: string
    proposal: string
    appliedAt: Date
    status: 'pending' | 'accepted' | 'rejected'
  }[]
  metadata: {
    category: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    estimatedTime: string
    tags: string[]
    requirements: string[]
  }
  contractGrantId?: string
  createdAt: Date
  updatedAt: Date
}

const GrantSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  creatorAddress: { type: String, required: true, index: true },
  fundingGoal: { type: Number, required: true, min: 0 },
  currentFunding: { type: Number, default: 0, min: 0 },
  status: {
    type: String,
    enum: ['open', 'funded', 'in_progress', 'completed', 'cancelled'],
    default: 'open',
    index: true
  },
  deadline: { type: Date },
  category: { type: String, required: true, index: true },
  skills: [{ type: String, trim: true }],
  milestones: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date }
  }],
  supporters: [{
    address: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    supportedAt: { type: Date, default: Date.now }
  }],
  applications: [{
    applicantAddress: { type: String, required: true },
    proposal: { type: String, required: true },
    appliedAt: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  metadata: {
    category: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true
    },
    estimatedTime: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    requirements: [{ type: String, trim: true }]
  },
  contractGrantId: { type: String, sparse: true, unique: true }
}, {
  timestamps: true
})

// Indexes
GrantSchema.index({ createdAt: -1 })
GrantSchema.index({ fundingGoal: 1 })
GrantSchema.index({ 'metadata.difficulty': 1 })
GrantSchema.index({ 'metadata.category': 1 })
GrantSchema.index({ skills: 1 })

// Virtual for funding percentage
GrantSchema.virtual('fundingPercentage').get(function(this: IGrant) {
  if (this.fundingGoal === 0) return 0
  return Math.round((this.currentFunding / this.fundingGoal) * 100)
})

// Virtual for supporters count
GrantSchema.virtual('supportersCount').get(function(this: IGrant) {
  return this.supporters.length
})

export const Grant = mongoose.model<IGrant>('Grant', GrantSchema)

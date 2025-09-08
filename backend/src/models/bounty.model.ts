import mongoose, { Document, Schema } from 'mongoose'

export interface IBounty extends Document {
  title: string
  description: string
  creatorAddress: string
  workerAddress?: string
  amount: number // in microSTX
  skills: string[]
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  contractBountyId?: number
  deadline?: Date
  submissions: Array<{
    submitterAddress: string
    description: string
    githubRepo?: string
    demoUrl?: string
    submittedAt: Date
  }>
  applications: Array<{
    applicantAddress: string
    proposal: string
    appliedAt: Date
    status: 'pending' | 'accepted' | 'rejected'
  }>
  metadata: {
    category: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    estimatedHours?: number
  }
  createdAt: Date
  updatedAt: Date
}

const bountySchema = new Schema<IBounty>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  creatorAddress: {
    type: String,
    required: true,
    trim: true
  },
  workerAddress: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  skills: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },
  contractBountyId: {
    type: Number,
    unique: true,
    sparse: true
  },
  deadline: {
    type: Date
  },
  submissions: [{
    submitterAddress: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000
    },
    githubRepo: {
      type: String,
      trim: true
    },
    demoUrl: {
      type: String,
      trim: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  applications: [{
    applicantAddress: {
      type: String,
      required: true,
      trim: true
    },
    proposal: {
      type: String,
      required: true,
      maxlength: 1000
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  metadata: {
    category: {
      type: String,
      required: true,
      trim: true
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true
    },
    estimatedHours: {
      type: Number,
      min: 1
    }
  }
}, {
  timestamps: true
})

// Indexes for better query performance
bountySchema.index({ status: 1 })
bountySchema.index({ creatorAddress: 1 })
bountySchema.index({ workerAddress: 1 })
bountySchema.index({ 'skills': 1 })
bountySchema.index({ amount: -1 })
bountySchema.index({ createdAt: -1 })
bountySchema.index({ contractBountyId: 1 })

export const Bounty = mongoose.model<IBounty>('Bounty', bountySchema)

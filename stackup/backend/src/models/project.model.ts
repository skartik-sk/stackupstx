import mongoose, { Document, Schema } from 'mongoose'

export interface IProject extends Document {
  title: string
  description: string
  creatorAddress: string
  workerAddress?: string
  milestones: Array<{
    title: string
    description: string
    amount: number // in microSTX
    deadline?: Date
    status: 'pending' | 'in_progress' | 'completed'
    completedAt?: Date
  }>
  totalAmount: number // in microSTX
  skills: string[]
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  contractProjectId?: number
  applications: Array<{
    applicantAddress: string
    proposal: string
    appliedAt: Date
    status: 'pending' | 'accepted' | 'rejected'
  }>
  metadata: {
    category: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    estimatedDuration: string // e.g., "2 weeks", "1 month"
  }
  createdAt: Date
  updatedAt: Date
}

const projectSchema = new Schema<IProject>({
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
  milestones: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    deadline: {
      type: Date
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    completedAt: {
      type: Date
    }
  }],
  totalAmount: {
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
  contractProjectId: {
    type: Number,
    unique: true,
    sparse: true
  },
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
    estimatedDuration: {
      type: String,
      required: true,
      trim: true
    }
  }
}, {
  timestamps: true
})

// Indexes for better query performance
projectSchema.index({ status: 1 })
projectSchema.index({ creatorAddress: 1 })
projectSchema.index({ workerAddress: 1 })
projectSchema.index({ 'skills': 1 })
projectSchema.index({ totalAmount: -1 })
projectSchema.index({ createdAt: -1 })
projectSchema.index({ contractProjectId: 1 })

export const Project = mongoose.model<IProject>('Project', projectSchema)

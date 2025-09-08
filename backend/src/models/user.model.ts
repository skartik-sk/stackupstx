import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  address: string
  displayName?: string
  avatar?: string
  verified: {
    wallet: boolean
    github: boolean
    twitter: boolean
  }
  profile: {
    bio?: string
    website?: string
    github?: string
    twitter?: string
  }
  stats: {
    bountiesCompleted: number
    projectsFunded: number
    grantsReceived: number
    ideasSubmitted: number
  }
  applicationCount: number
  lastApplicationReset: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>({
  address: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  avatar: {
    type: String,
    trim: true
  },
  verified: {
    wallet: {
      type: Boolean,
      default: false
    },
    github: {
      type: Boolean,
      default: false
    },
    twitter: {
      type: Boolean,
      default: false
    }
  },
  profile: {
    bio: {
      type: String,
      maxlength: 500
    },
    website: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    }
  },
  stats: {
    bountiesCompleted: {
      type: Number,
      default: 0,
      min: 0
    },
    projectsFunded: {
      type: Number,
      default: 0,
      min: 0
    },
    grantsReceived: {
      type: Number,
      default: 0,
      min: 0
    },
    ideasSubmitted: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  applicationCount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastApplicationReset: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Indexes for better query performance
userSchema.index({ address: 1 })
userSchema.index({ 'stats.bountiesCompleted': -1 })
userSchema.index({ createdAt: -1 })

export const User = mongoose.model<IUser>('User', userSchema)

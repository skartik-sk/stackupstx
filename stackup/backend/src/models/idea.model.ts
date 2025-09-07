import mongoose, { Schema, Document } from 'mongoose'

export interface IIdea extends Document {
  title: string
  description: string
  creatorAddress: string
  status: 'draft' | 'published' | 'in_development' | 'completed' | 'archived'
  category: string
  tags: string[]
  upvotes: string[] // Array of user addresses who upvoted
  downvotes: string[] // Array of user addresses who downvoted
  comments: {
    authorAddress: string
    content: string
    createdAt: Date
    replies?: {
      authorAddress: string
      content: string
      createdAt: Date
    }[]
  }[]
  collaborators: {
    address: string
    role: string
    joinedAt: Date
  }[]
  resources: {
    title: string
    url: string
    type: 'link' | 'file' | 'image'
  }[]
  implementationProjects: string[] // References to projects that implement this idea
  metadata: {
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    estimatedTime: string
    requiredSkills: string[]
    marketPotential: 'low' | 'medium' | 'high'
    feasibility: 'low' | 'medium' | 'high'
  }
  viewCount: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const IdeaSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  creatorAddress: { type: String, required: true, index: true },
  status: {
    type: String,
    enum: ['draft', 'published', 'in_development', 'completed', 'archived'],
    default: 'published',
    index: true
  },
  category: { type: String, required: true, index: true },
  tags: [{ type: String, trim: true }],
  upvotes: [{ type: String }],
  downvotes: [{ type: String }],
  comments: [{
    authorAddress: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    replies: [{
      authorAddress: { type: String, required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }]
  }],
  collaborators: [{
    address: { type: String, required: true },
    role: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now }
  }],
  resources: [{
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['link', 'file', 'image'],
      required: true 
    }
  }],
  implementationProjects: [{ type: String }],
  metadata: {
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true
    },
    estimatedTime: { type: String, required: true },
    requiredSkills: [{ type: String, trim: true }],
    marketPotential: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    feasibility: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  viewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
})

// Indexes
IdeaSchema.index({ createdAt: -1 })
IdeaSchema.index({ category: 1 })
IdeaSchema.index({ tags: 1 })
IdeaSchema.index({ featured: 1 })
IdeaSchema.index({ 'metadata.difficulty': 1 })
IdeaSchema.index({ viewCount: -1 })

// Virtual for score (upvotes - downvotes)
IdeaSchema.virtual('score').get(function(this: any) {
  return (this.upvotes?.length || 0) - (this.downvotes?.length || 0)
})

// Virtual for total votes
IdeaSchema.virtual('totalVotes').get(function(this: any) {
  return (this.upvotes?.length || 0) + (this.downvotes?.length || 0)
})

// Virtual for comments count
IdeaSchema.virtual('commentsCount').get(function(this: any) {
  let total = this.comments?.length || 0
  if (this.comments) {
    this.comments.forEach((comment: any) => {
      if (comment.replies) {
        total += comment.replies.length
      }
    })
  }
  return total
})

export const Idea = mongoose.model<IIdea>('Idea', IdeaSchema)

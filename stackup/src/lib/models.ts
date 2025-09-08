import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  stxAddress: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  btcAddress: {
    type: String
  },
  publicKey: {
    type: String
  },
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  profileData: {
    name: String,
    bio: String,
    avatar: String,
    skills: [String],
    githubUrl: String,
    portfolioUrl: String,
    location: String,
    timezone: String
  },
  stackerScore: {
    type: Number,
    default: 0
  },
  totalEarned: {
    type: Number,
    default: 0
  },
  completedProjects: {
    type: Number,
    default: 0
  },
  reputation: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'creator', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
})

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['bounty', 'grant', 'project'],
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creatorAddress: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'STX'
  },
  status: {
    type: String,
    enum: ['draft', 'live', 'in_progress', 'completed', 'cancelled', 'paused'],
    default: 'draft'
  },
  skills: [String],
  requirements: [String],
  deliverables: [String],
  deadline: Date,
  milestones: [{
    title: String,
    description: String,
    amount: Number,
    deadline: Date,
    completed: { type: Boolean, default: false },
    completedAt: Date,
    completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  applications: [{
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    applicantAddress: String,
    proposal: String,
    budget: Number,
    timeline: String,
    portfolioLinks: [String],
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }],
  selectedWinner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  selectedWinnerAddress: String,
  contractAddress: String,
  transactionId: String,
  escrowReleased: {
    type: Boolean,
    default: false
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creatorAddress: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tags: [String],
  estimatedBudget: {
    min: Number,
    max: Number
  },
  timeframe: String,
  requiredSkills: [String],
  votes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userAddress: String,
    type: { type: String, enum: ['up', 'down'] },
    votedAt: { type: Date, default: Date.now }
  }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userAddress: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['open', 'in_development', 'completed', 'abandoned'],
    default: 'open'
  },
  convertedToProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }
}, {
  timestamps: true
})

// Create indexes for better performance
UserSchema.index({ stxAddress: 1 })
UserSchema.index({ stackerScore: -1 })
UserSchema.index({ totalEarned: -1 })

ProjectSchema.index({ type: 1, status: 1 })
ProjectSchema.index({ creator: 1 })
ProjectSchema.index({ createdAt: -1 })
ProjectSchema.index({ deadline: 1 })
ProjectSchema.index({ skills: 1 })

IdeaSchema.index({ creator: 1 })
IdeaSchema.index({ category: 1 })
IdeaSchema.index({ createdAt: -1 })
IdeaSchema.index({ tags: 1 })

export const User = mongoose.models.User || mongoose.model('User', UserSchema)
export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema)
export const Idea = mongoose.models.Idea || mongoose.model('Idea', IdeaSchema)

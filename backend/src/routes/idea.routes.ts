import express from 'express'
import { Request, Response } from 'express'
import { Idea } from '../models/idea.model'
import { User } from '../models/user.model'
import { memoryDb } from '../config/memoryDatabase'

const router = express.Router()

// Helper function to check if MongoDB is available
const isMongoAvailable = () => {
  try {
    return require('mongoose').connection.readyState === 1
  } catch {
    return false
  }
}

// GET /api/ideas - Get all ideas with filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      status,
      category,
      difficulty,
      featured,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    if (!isMongoAvailable()) {
      // Use in-memory database
      const filter: any = {}
      if (status) filter.status = status
      if (category) filter.category = category
      
      const ideas = await memoryDb.findIdeas(filter)
      
      return res.json({
        success: true,
        data: ideas,
        pagination: {
          current: Number(page),
          pages: 1,
          total: ideas.length,
          hasNext: false,
          hasPrev: false
        }
      })
    }

    // MongoDB logic
    const filter: any = {}
    
    if (status) filter.status = status
    if (category) filter.category = category
    if (difficulty) filter['metadata.difficulty'] = difficulty
    if (featured !== undefined) filter.featured = featured === 'true'

    const sort: any = {}
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const skip = (pageNum - 1) * limitNum

    const ideas = await Idea.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('creatorAddress', 'displayName avatar')
      .exec()

    const total = await Idea.countDocuments(filter)

    res.json({
      success: true,
      data: ideas,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1
      }
    })
  } catch (error) {
    console.error('Error fetching ideas:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch ideas' }
    })
  }
})

// GET /api/ideas/:id - Get specific idea
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!isMongoAvailable()) {
      const idea = await memoryDb.findIdeaById(req.params.id)
      if (!idea) {
        return res.status(404).json({
          success: false,
          error: { message: 'Idea not found' }
        })
      }
      return res.json({ success: true, data: idea })
    }

    const idea = await Idea.findById(req.params.id)
      .populate('creatorAddress', 'displayName avatar verified stats')
      .exec()

    if (!idea) {
      return res.status(404).json({
        success: false,
        error: { message: 'Idea not found' }
      })
    }

    // Increment view count
    idea.viewCount += 1
    await idea.save()

    res.json({
      success: true,
      data: idea
    })
  } catch (error) {
    console.error('Error fetching idea:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch idea' }
    })
  }
})

// POST /api/ideas - Create new idea
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      creatorAddress,
      category,
      tags,
      metadata,
      status = 'published'
    } = req.body

    // Validate required fields
    if (!title || !description || !creatorAddress || !category || !metadata) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields' }
      })
    }

    if (!isMongoAvailable()) {
      const idea = await memoryDb.createIdea({
        title,
        description,
        creatorAddress,
        category,
        tags: tags || [],
        status,
        upvotes: [],
        downvotes: [],
        comments: [],
        collaborators: [],
        metadata,
        viewCount: 0,
        featured: false
      })
      
      return res.status(201).json({ success: true, data: idea })
    }

    // MongoDB logic
    const idea = new Idea({
      title,
      description,
      creatorAddress,
      category,
      tags: tags || [],
      status,
      metadata
    })

    await idea.save()

    // Update user stats
    await User.findOneAndUpdate(
      { address: creatorAddress },
      { 
        $inc: { 'stats.ideasCreated': 1 },
        $setOnInsert: { address: creatorAddress }
      },
      { upsert: true }
    )

    res.status(201).json({
      success: true,
      data: idea
    })
  } catch (error) {
    console.error('Error creating idea:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create idea' }
    })
  }
})

// PUT /api/ideas/:id/vote - Vote on an idea
router.put('/:id/vote', async (req: Request, res: Response) => {
  try {
    const { voterAddress, voteType } = req.body

    if (!voterAddress || !voteType || !['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid voter address or vote type' }
      })
    }

    const idea = await Idea.findById(req.params.id)
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: { message: 'Idea not found' }
      })
    }

    // Remove existing votes from this user
    idea.upvotes = idea.upvotes.filter(addr => addr !== voterAddress)
    idea.downvotes = idea.downvotes.filter(addr => addr !== voterAddress)

    // Add new vote
    if (voteType === 'upvote') {
      idea.upvotes.push(voterAddress)
    } else {
      idea.downvotes.push(voterAddress)
    }

    await idea.save()

    res.json({
      success: true,
      data: idea
    })
  } catch (error) {
    console.error('Error voting on idea:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to vote on idea' }
    })
  }
})

// POST /api/ideas/:id/comments - Add comment to idea
router.post('/:id/comments', async (req: Request, res: Response) => {
  try {
    const { authorAddress, content } = req.body

    if (!authorAddress || !content) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing author address or content' }
      })
    }

    const idea = await Idea.findById(req.params.id)
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: { message: 'Idea not found' }
      })
    }

    idea.comments.push({
      authorAddress,
      content,
      createdAt: new Date()
    })

    await idea.save()

    res.json({
      success: true,
      data: idea
    })
  } catch (error) {
    console.error('Error adding comment:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to add comment' }
    })
  }
})

// PUT /api/ideas/:id/collaborate - Join as collaborator
router.put('/:id/collaborate', async (req: Request, res: Response) => {
  try {
    const { collaboratorAddress, role } = req.body

    if (!collaboratorAddress || !role) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing collaborator address or role' }
      })
    }

    const idea = await Idea.findById(req.params.id)
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: { message: 'Idea not found' }
      })
    }

    // Check if already collaborator
    const existingCollaborator = idea.collaborators.find(
      collab => collab.address === collaboratorAddress
    )

    if (existingCollaborator) {
      return res.status(400).json({
        success: false,
        error: { message: 'Already a collaborator on this idea' }
      })
    }

    idea.collaborators.push({
      address: collaboratorAddress,
      role,
      joinedAt: new Date()
    })

    await idea.save()

    res.json({
      success: true,
      data: idea
    })
  } catch (error) {
    console.error('Error adding collaborator:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to add collaborator' }
    })
  }
})

export default router

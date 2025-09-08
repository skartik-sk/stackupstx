import express from 'express'
import { Request, Response } from 'express'
import { Grant } from '../models/grant.model'
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

// GET /api/grants - Get all grants with filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      status,
      category,
      difficulty,
      minFunding,
      maxFunding,
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
      
      const grants = await memoryDb.findGrants(filter)
      
      return res.json({
        success: true,
        data: grants,
        pagination: {
          current: Number(page),
          pages: 1,
          total: grants.length,
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
    if (minFunding || maxFunding) {
      filter.fundingGoal = {}
      if (minFunding) filter.fundingGoal.$gte = Number(minFunding)
      if (maxFunding) filter.fundingGoal.$lte = Number(maxFunding)
    }

    const sort: any = {}
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const skip = (pageNum - 1) * limitNum

    const grants = await Grant.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('creatorAddress', 'displayName avatar')
      .exec()

    const total = await Grant.countDocuments(filter)

    res.json({
      success: true,
      data: grants,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1
      }
    })
  } catch (error) {
    console.error('Error fetching grants:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch grants' }
    })
  }
})

// GET /api/grants/:id - Get specific grant
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!isMongoAvailable()) {
      const grant = await memoryDb.findGrantById(req.params.id)
      if (!grant) {
        return res.status(404).json({
          success: false,
          error: { message: 'Grant not found' }
        })
      }
      return res.json({ success: true, data: grant })
    }

    const grant = await Grant.findById(req.params.id)
      .populate('creatorAddress', 'displayName avatar verified stats')
      .exec()

    if (!grant) {
      return res.status(404).json({
        success: false,
        error: { message: 'Grant not found' }
      })
    }

    res.json({
      success: true,
      data: grant
    })
  } catch (error) {
    console.error('Error fetching grant:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch grant' }
    })
  }
})

// POST /api/grants - Create new grant
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      creatorAddress,
      fundingGoal,
      category,
      skills,
      milestones,
      deadline,
      metadata
    } = req.body

    // Validate required fields
    if (!title || !description || !creatorAddress || !fundingGoal || !category || !metadata) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields' }
      })
    }

    if (!isMongoAvailable()) {
      const grant = await memoryDb.createGrant({
        title,
        description,
        creatorAddress,
        fundingGoal,
        currentFunding: 0,
        category,
        skills: skills || [],
        milestones: milestones || [],
        status: 'open',
        deadline: deadline ? new Date(deadline) : undefined,
        supporters: [],
        applications: [],
        metadata
      })
      
      return res.status(201).json({ success: true, data: grant })
    }

    // MongoDB logic
    const grant = new Grant({
      title,
      description,
      creatorAddress,
      fundingGoal,
      category,
      skills: skills || [],
      milestones: milestones || [],
      deadline: deadline ? new Date(deadline) : undefined,
      metadata
    })

    await grant.save()

    // Update user stats
    await User.findOneAndUpdate(
      { address: creatorAddress },
      { 
        $inc: { 'stats.grantsCreated': 1 },
        $setOnInsert: { address: creatorAddress }
      },
      { upsert: true }
    )

    res.status(201).json({
      success: true,
      data: grant
    })
  } catch (error) {
    console.error('Error creating grant:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create grant' }
    })
  }
})

// PUT /api/grants/:id/support - Support a grant
router.put('/:id/support', async (req: Request, res: Response) => {
  try {
    const { supporterAddress, amount } = req.body

    if (!supporterAddress || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid supporter address or amount' }
      })
    }

    const grant = await Grant.findById(req.params.id)
    if (!grant) {
      return res.status(404).json({
        success: false,
        error: { message: 'Grant not found' }
      })
    }

    if (grant.status !== 'open') {
      return res.status(400).json({
        success: false,
        error: { message: 'Grant is not open for support' }
      })
    }

    // Add support
    grant.supporters.push({
      address: supporterAddress,
      amount: Number(amount),
      supportedAt: new Date()
    })

    grant.currentFunding += Number(amount)

    // Check if funding goal is reached
    if (grant.currentFunding >= grant.fundingGoal) {
      grant.status = 'funded'
    }

    await grant.save()

    res.json({
      success: true,
      data: grant
    })
  } catch (error) {
    console.error('Error supporting grant:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to support grant' }
    })
  }
})

// PUT /api/grants/:id/apply - Apply to work on grant
router.put('/:id/apply', async (req: Request, res: Response) => {
  try {
    const { applicantAddress, proposal } = req.body

    if (!applicantAddress || !proposal) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing applicant address or proposal' }
      })
    }

    const grant = await Grant.findById(req.params.id)
    if (!grant) {
      return res.status(404).json({
        success: false,
        error: { message: 'Grant not found' }
      })
    }

    if (grant.status !== 'funded') {
      return res.status(400).json({
        success: false,
        error: { message: 'Grant must be funded before applications' }
      })
    }

    // Check if user already applied
    const existingApplication = grant.applications.find(
      app => app.applicantAddress === applicantAddress
    )

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        error: { message: 'You have already applied to this grant' }
      })
    }

    // Add application
    grant.applications.push({
      applicantAddress,
      proposal,
      appliedAt: new Date(),
      status: 'pending'
    })

    await grant.save()

    res.json({
      success: true,
      data: grant
    })
  } catch (error) {
    console.error('Error applying to grant:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to apply to grant' }
    })
  }
})

export default router

import express from 'express'
import { Request, Response } from 'express'
import { Bounty } from '../models/bounty.model'
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

// GET /api/bounties - Get all bounties with filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      status,
      skills,
      category,
      difficulty,
      minAmount,
      maxAmount,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    if (!isMongoAvailable()) {
      // Use in-memory database
      const filter: any = {}
      if (status) filter.status = status
      if (skills) filter.skills = Array.isArray(skills) ? skills : [skills]
      
      const bounties = await memoryDb.findBounties(filter)
      
      return res.json({
        success: true,
        data: bounties,
        pagination: {
          current: Number(page),
          pages: 1,
          total: bounties.length,
          hasNext: false,
          hasPrev: false
        }
      })
    }

    // MongoDB logic (existing code)
    const filter: any = {}
    
    if (status) filter.status = status
    if (category) filter['metadata.category'] = category
    if (difficulty) filter['metadata.difficulty'] = difficulty
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills]
      filter.skills = { $in: skillsArray }
    }
    if (minAmount || maxAmount) {
      filter.amount = {}
      if (minAmount) filter.amount.$gte = Number(minAmount)
      if (maxAmount) filter.amount.$lte = Number(maxAmount)
    }

    const sort: any = {}
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const skip = (pageNum - 1) * limitNum

    const bounties = await Bounty.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('creatorAddress', 'displayName avatar')
      .exec()

    const total = await Bounty.countDocuments(filter)

    res.json({
      success: true,
      data: bounties,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1
      }
    })
  } catch (error) {
    console.error('Error fetching bounties:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch bounties' }
    })
  }
})

// GET /api/bounties/:id - Get specific bounty
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!isMongoAvailable()) {
      const bounty = await memoryDb.findBountyById(req.params.id)
      if (!bounty) {
        return res.status(404).json({
          success: false,
          error: { message: 'Bounty not found' }
        })
      }
      return res.json({ success: true, data: bounty })
    }

    const bounty = await Bounty.findById(req.params.id)
      .populate('creatorAddress', 'displayName avatar verified stats')
      .exec()

    if (!bounty) {
      return res.status(404).json({
        success: false,
        error: { message: 'Bounty not found' }
      })
    }

    res.json({
      success: true,
      data: bounty
    })
  } catch (error) {
    console.error('Error fetching bounty:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch bounty' }
    })
  }
})

// POST /api/bounties - Create new bounty
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      creatorAddress,
      amount,
      skills,
      deadline,
      metadata
    } = req.body

    // Validate required fields
    if (!title || !description || !creatorAddress || !amount || !metadata) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields' }
      })
    }

    if (!isMongoAvailable()) {
      const bounty = await memoryDb.createBounty({
        title,
        description,
        creatorAddress,
        amount,
        skills: skills || [],
        status: 'open',
        deadline: deadline ? new Date(deadline) : undefined,
        applications: [],
        metadata
      })
      
      return res.status(201).json({ success: true, data: bounty })
    }

    // MongoDB logic
    const bounty = new Bounty({
      title,
      description,
      creatorAddress,
      amount,
      skills: skills || [],
      deadline: deadline ? new Date(deadline) : undefined,
      metadata
    })

    await bounty.save()

    // Update user stats
    await User.findOneAndUpdate(
      { address: creatorAddress },
      { 
        $inc: { 'stats.projectsFunded': 1 },
        $setOnInsert: { address: creatorAddress }
      },
      { upsert: true }
    )

    res.status(201).json({
      success: true,
      data: bounty
    })
  } catch (error) {
    console.error('Error creating bounty:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create bounty' }
    })
  }
})

// PUT /api/bounties/:id/apply - Apply to bounty
router.put('/:id/apply', async (req: Request, res: Response) => {
  try {
    const { applicantAddress, proposal } = req.body

    if (!applicantAddress || !proposal) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing applicant address or proposal' }
      })
    }

    const bounty = await Bounty.findById(req.params.id)
    if (!bounty) {
      return res.status(404).json({
        success: false,
        error: { message: 'Bounty not found' }
      })
    }

    if (bounty.status !== 'open') {
      return res.status(400).json({
        success: false,
        error: { message: 'Bounty is not open for applications' }
      })
    }

    // Check if user already applied
    const existingApplication = bounty.applications.find(
      app => app.applicantAddress === applicantAddress
    )

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        error: { message: 'You have already applied to this bounty' }
      })
    }

    // Add application
    bounty.applications.push({
      applicantAddress,
      proposal,
      appliedAt: new Date(),
      status: 'pending'
    })

    await bounty.save()

    res.json({
      success: true,
      data: bounty
    })
  } catch (error) {
    console.error('Error applying to bounty:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to apply to bounty' }
    })
  }
})

// PUT /api/bounties/:id/select-winner - Select winner for bounty
router.put('/:id/select-winner', async (req: Request, res: Response) => {
  try {
    const { creatorAddress, winnerAddress } = req.body

    if (!creatorAddress || !winnerAddress) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing creator or winner address' }
      })
    }

    const bounty = await Bounty.findById(req.params.id)
    if (!bounty) {
      return res.status(404).json({
        success: false,
        error: { message: 'Bounty not found' }
      })
    }

    if (bounty.creatorAddress !== creatorAddress) {
      return res.status(403).json({
        success: false,
        error: { message: 'Only the creator can select a winner' }
      })
    }

    if (bounty.status !== 'open') {
      return res.status(400).json({
        success: false,
        error: { message: 'Bounty is not open' }
      })
    }

    // Update bounty status and worker
    bounty.status = 'in_progress'
    bounty.workerAddress = winnerAddress

    // Update application status
    bounty.applications.forEach(app => {
      if (app.applicantAddress === winnerAddress) {
        app.status = 'accepted'
      } else {
        app.status = 'rejected'
      }
    })

    await bounty.save()

    res.json({
      success: true,
      data: bounty
    })
  } catch (error) {
    console.error('Error selecting winner:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to select winner' }
    })
  }
})

// PUT /api/bounties/:id/complete - Mark bounty as completed
router.put('/:id/complete', async (req: Request, res: Response) => {
  try {
    const { creatorAddress, contractBountyId } = req.body

    const bounty = await Bounty.findById(req.params.id)
    if (!bounty) {
      return res.status(404).json({
        success: false,
        error: { message: 'Bounty not found' }
      })
    }

    if (bounty.creatorAddress !== creatorAddress) {
      return res.status(403).json({
        success: false,
        error: { message: 'Only the creator can complete the bounty' }
      })
    }

    bounty.status = 'completed'
    if (contractBountyId) {
      bounty.contractBountyId = contractBountyId
    }

    await bounty.save()

    // Update worker stats
    if (bounty.workerAddress) {
      await User.findOneAndUpdate(
        { address: bounty.workerAddress },
        { 
          $inc: { 'stats.bountiesCompleted': 1 },
          $setOnInsert: { address: bounty.workerAddress }
        },
        { upsert: true }
      )
    }

    res.json({
      success: true,
      data: bounty
    })
  } catch (error) {
    console.error('Error completing bounty:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to complete bounty' }
    })
  }
})

export default router

import express from 'express'
import { Request, Response } from 'express'
import { User } from '../models/user.model'

const router = express.Router()

// GET /api/users/:address - Get user profile
router.get('/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params

    let user = await User.findOne({ address })
    
    // Create user if doesn't exist
    if (!user) {
      user = new User({
        address,
        verified: {
          wallet: false,
          github: false,
          twitter: false
        },
        profile: {},
        stats: {
          bountiesCompleted: 0,
          projectsFunded: 0,
          grantsReceived: 0,
          ideasSubmitted: 0
        },
        applicationCount: 0,
        lastApplicationReset: new Date()
      })
      await user.save()
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user' }
    })
  }
})

// PUT /api/users/:address - Update user profile
router.put('/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params
    const updates = req.body

    // Remove sensitive fields that shouldn't be updated directly
    delete updates.address
    delete updates.stats
    delete updates.applicationCount
    delete updates.lastApplicationReset
    delete updates.createdAt
    delete updates.updatedAt

    const user = await User.findOneAndUpdate(
      { address },
      { $set: updates },
      { new: true, upsert: true }
    )

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update user' }
    })
  }
})

// POST /api/users/:address/application - Track application submission
router.post('/:address/application', async (req: Request, res: Response) => {
  try {
    const { address } = req.params
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    let user = await User.findOne({ address })
    
    if (!user) {
      user = new User({
        address,
        applicationCount: 1,
        lastApplicationReset: now
      })
    } else {
      const lastReset = new Date(user.lastApplicationReset)
      const lastMonth = lastReset.getMonth()
      const lastYear = lastReset.getFullYear()

      // Reset count if it's a new month
      if (currentMonth !== lastMonth || currentYear !== lastYear) {
        user.applicationCount = 1
        user.lastApplicationReset = now
      } else {
        user.applicationCount += 1
      }
    }

    await user.save()

    res.json({
      success: true,
      data: {
        applicationCount: user.applicationCount,
        canApply: user.applicationCount <= 5 // Assuming 5 applications per month limit
      }
    })
  } catch (error) {
    console.error('Error tracking application:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to track application' }
    })
  }
})

// GET /api/users/:address/applications - Get user's application count
router.get('/:address/applications', async (req: Request, res: Response) => {
  try {
    const { address } = req.params
    const user = await User.findOne({ address })

    if (!user) {
      return res.json({
        success: true,
        data: {
          applicationCount: 0,
          canApply: true
        }
      })
    }

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const lastReset = new Date(user.lastApplicationReset)
    const lastMonth = lastReset.getMonth()
    const lastYear = lastReset.getFullYear()

    // Reset count if it's a new month
    let applicationCount = user.applicationCount
    if (currentMonth !== lastMonth || currentYear !== lastYear) {
      applicationCount = 0
    }

    res.json({
      success: true,
      data: {
        applicationCount,
        canApply: applicationCount < 5 // 5 applications per month limit
      }
    })
  } catch (error) {
    console.error('Error fetching application count:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch application count' }
    })
  }
})

// GET /api/users - Get users leaderboard
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      sortBy = 'stats.bountiesCompleted',
      limit = 10,
      page = 1
    } = req.query

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const skip = (pageNum - 1) * limitNum

    const sort: any = {}
    sort[sortBy as string] = -1

    const users = await User.find({})
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .select('-__v')
      .exec()

    const total = await User.countDocuments({})

    res.json({
      success: true,
      data: users,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch users' }
    })
  }
})

export default router

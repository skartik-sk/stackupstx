import express from 'express'
import { Request, Response } from 'express'
import { Project } from '../models/project.model'
import { User } from '../models/user.model'

const router = express.Router()

// GET /api/projects - Get all projects with filtering
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

    // Build filter object
    const filter: any = {}
    
    if (status) filter.status = status
    if (category) filter['metadata.category'] = category
    if (difficulty) filter['metadata.difficulty'] = difficulty
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills]
      filter.skills = { $in: skillsArray }
    }
    if (minAmount || maxAmount) {
      filter.totalAmount = {}
      if (minAmount) filter.totalAmount.$gte = Number(minAmount)
      if (maxAmount) filter.totalAmount.$lte = Number(maxAmount)
    }

    // Build sort object
    const sort: any = {}
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1

    // Calculate pagination
    const pageNum = Number(page)
    const limitNum = Number(limit)
    const skip = (pageNum - 1) * limitNum

    // Execute query
    const projects = await Project.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('creatorAddress', 'displayName avatar')
      .exec()

    const total = await Project.countDocuments(filter)

    res.json({
      success: true,
      data: projects,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1
      }
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch projects' }
    })
  }
})

// GET /api/projects/:id - Get specific project
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('creatorAddress', 'displayName avatar verified stats')
      .exec()

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found' }
      })
    }

    res.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch project' }
    })
  }
})

// POST /api/projects - Create new project
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      creatorAddress,
      milestones,
      totalAmount,
      skills,
      metadata
    } = req.body

    // Validate required fields
    if (!title || !description || !creatorAddress || !milestones || !totalAmount || !metadata) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields' }
      })
    }

    // Validate milestones
    if (!Array.isArray(milestones) || milestones.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'At least one milestone is required' }
      })
    }

    // Calculate total from milestones
    const calculatedTotal = milestones.reduce((sum, milestone) => sum + milestone.amount, 0)
    if (calculatedTotal !== totalAmount) {
      return res.status(400).json({
        success: false,
        error: { message: 'Total amount must equal sum of milestone amounts' }
      })
    }

    // Create new project
    const project = new Project({
      title,
      description,
      creatorAddress,
      milestones,
      totalAmount,
      skills: skills || [],
      metadata
    })

    await project.save()

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
      data: project
    })
  } catch (error) {
    console.error('Error creating project:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create project' }
    })
  }
})

// PUT /api/projects/:id/apply - Apply to project
router.put('/:id/apply', async (req: Request, res: Response) => {
  try {
    const { applicantAddress, proposal } = req.body

    if (!applicantAddress || !proposal) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing applicant address or proposal' }
      })
    }

    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found' }
      })
    }

    if (project.status !== 'open') {
      return res.status(400).json({
        success: false,
        error: { message: 'Project is not open for applications' }
      })
    }

    // Check if user already applied
    const existingApplication = project.applications.find(
      app => app.applicantAddress === applicantAddress
    )

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        error: { message: 'You have already applied to this project' }
      })
    }

    // Add application
    project.applications.push({
      applicantAddress,
      proposal,
      appliedAt: new Date(),
      status: 'pending'
    })

    await project.save()

    res.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('Error applying to project:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to apply to project' }
    })
  }
})

// PUT /api/projects/:id/select-winner - Select winner for project
router.put('/:id/select-winner', async (req: Request, res: Response) => {
  try {
    const { creatorAddress, winnerAddress } = req.body

    if (!creatorAddress || !winnerAddress) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing creator or winner address' }
      })
    }

    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found' }
      })
    }

    if (project.creatorAddress !== creatorAddress) {
      return res.status(403).json({
        success: false,
        error: { message: 'Only the creator can select a winner' }
      })
    }

    if (project.status !== 'open') {
      return res.status(400).json({
        success: false,
        error: { message: 'Project is not open' }
      })
    }

    // Update project status and worker
    project.status = 'in_progress'
    project.workerAddress = winnerAddress

    // Update application status
    project.applications.forEach(app => {
      if (app.applicantAddress === winnerAddress) {
        app.status = 'accepted'
      } else {
        app.status = 'rejected'
      }
    })

    // Set first milestone to in_progress
    if (project.milestones.length > 0) {
      project.milestones[0].status = 'in_progress'
    }

    await project.save()

    res.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('Error selecting winner:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to select winner' }
    })
  }
})

// PUT /api/projects/:id/complete-milestone - Complete a milestone
router.put('/:id/complete-milestone', async (req: Request, res: Response) => {
  try {
    const { creatorAddress, milestoneIndex } = req.body

    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found' }
      })
    }

    if (project.creatorAddress !== creatorAddress) {
      return res.status(403).json({
        success: false,
        error: { message: 'Only the creator can complete milestones' }
      })
    }

    if (milestoneIndex < 0 || milestoneIndex >= project.milestones.length) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid milestone index' }
      })
    }

    const milestone = project.milestones[milestoneIndex]
    if (milestone.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: { message: 'Milestone already completed' }
      })
    }

    // Complete the milestone
    milestone.status = 'completed'
    milestone.completedAt = new Date()

    // Start next milestone if exists
    if (milestoneIndex + 1 < project.milestones.length) {
      project.milestones[milestoneIndex + 1].status = 'in_progress'
    } else {
      // All milestones completed, mark project as completed
      project.status = 'completed'
      
      // Update worker stats
      if (project.workerAddress) {
        await User.findOneAndUpdate(
          { address: project.workerAddress },
          { 
            $inc: { 'stats.bountiesCompleted': 1 },
            $setOnInsert: { address: project.workerAddress }
          },
          { upsert: true }
        )
      }
    }

    await project.save()

    res.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('Error completing milestone:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to complete milestone' }
    })
  }
})

export default router

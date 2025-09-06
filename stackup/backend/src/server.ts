import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { connectDatabase } from './config/database'
import { memoryDb } from './config/memoryDatabase'
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'

// Import routes
import bountyRoutes from './routes/bounty.routes'
import projectRoutes from './routes/project.routes'
import userRoutes from './routes/user.routes'
import grantRoutes from './routes/grant.routes'
import ideaRoutes from './routes/idea.routes'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API routes
app.use('/api/bounties', bountyRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/users', userRoutes)
app.use('/api/grants', grantRoutes)
app.use('/api/ideas', ideaRoutes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Database connection and server startup
const startServer = async () => {
  try {
    // Try to connect to database, but don't fail if it's not available
    try {
      await connectDatabase()
      console.log('✅ Database connected successfully')
    } catch (dbError) {
      console.warn('⚠️  Database connection failed - using in-memory storage')
      console.warn('Database error:', (dbError as Error).message)
      // Initialize in-memory database with sample data
      await memoryDb.initialize()
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`)
      console.log(`💡 Access at: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error)
  process.exit(1)
})

startServer()

export default app

import mongoose from 'mongoose'

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/stackup-dev'
    
    console.log('🔌 Attempting to connect to MongoDB...')
    console.log('📍 URI:', mongoUri.replace(/\/\/.*@/, '//***:***@')) // Hide credentials in logs
    
    // Determine if we're connecting to local MongoDB or remote
    const isLocalMongo = mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1')
    
        // MongoDB connection options with proper SSL handling
    const options = {
      dbName: 'stackup',
      retryWrites: true,
      connectTimeoutMS: 30000, // Increased from 10000 to 30000 (30 seconds)
      socketTimeoutMS: 60000,  // Increased from 45000 to 60000 (60 seconds)
      serverSelectionTimeoutMS: 10000, // Increased from 5000 to 10000 (10 seconds)
      maxPoolSize: 10,
      bufferCommands: false,
    }
    
    await mongoose.connect(mongoUri, options)
    
    console.log(`📦 MongoDB connected: ${mongoose.connection.host}`)
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}

// Handle connection events
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error)
})

mongoose.connection.on('disconnected', () => {
  console.log('📦 MongoDB disconnected')
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('📦 MongoDB connection closed due to app termination')
  process.exit(0)
})

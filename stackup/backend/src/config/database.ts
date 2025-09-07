import mongoose from 'mongoose'

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/stackup-dev'
    
    // MongoDB connection options with proper SSL handling
    const options = {
      dbName: 'stackup',
      ssl: true,
      retryWrites: true,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
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

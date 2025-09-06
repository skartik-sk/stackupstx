import mongoose from 'mongoose'

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/stackup-dev'
    
    await mongoose.connect(mongoUri, {
      dbName: 'stackup'
    })
    
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

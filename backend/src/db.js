import { MongoClient } from 'mongodb'

console.log('DEBUG - process.env.MONGODB_URI:', process.env.MONGODB_URI)
console.log('DEBUG - All env vars:', Object.keys(process.env).filter(k => k.includes('MONGO') || k.includes('DB')))

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const DB_NAME = process.env.DB_NAME || 'geocities'

let client = null
let db = null

export async function connectDB() {
  if (db) {
    return db
  }

  try {
    console.log('🔄 Connecting to MongoDB...')
    console.log('URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'))
    
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    })
    
    await client.connect()
    db = client.db(DB_NAME)
    
    // Test the connection
    await db.command({ ping: 1 })
    
    console.log('✅ Connected to MongoDB Atlas')
    return db
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    console.error('💡 Troubleshooting tips:')
    console.error('   1. Check your internet connection')
    console.error('   2. Verify MongoDB Atlas cluster is running')
    console.error('   3. Check if your IP is whitelisted in MongoDB Atlas')
    console.error('   4. Verify username and password are correct')
    throw error
  }
}

export function getDB() {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.')
  }
  return db
}

export async function closeDB() {
  if (client) {
    await client.close()
    client = null
    db = null
    console.log('🔌 Disconnected from MongoDB')
  }
}

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDB } from './db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'geocities-secret-key-change-in-production'

export async function registerUser(username, email, password) {
  const db = getDB()
  const usersCollection = db.collection('users')
  
  // Check if user already exists
  const existingUser = await usersCollection.findOne({
    $or: [{ username }, { email }]
  })
  
  if (existingUser) {
    if (existingUser.username === username) {
      throw new Error('Username already exists')
    }
    if (existingUser.email === email) {
      throw new Error('Email already exists')
    }
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const newUser = {
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
    sites: []
  }
  
  const result = await usersCollection.insertOne(newUser)
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser
  return { ...userWithoutPassword, id: result.insertedId.toString() }
}

export async function loginUser(username, password) {
  const db = getDB()
  const usersCollection = db.collection('users')
  
  const user = await usersCollection.findOne({
    $or: [{ username }, { email: username }]
  })
  
  if (!user) {
    throw new Error('Invalid credentials')
  }
  
  const isValidPassword = await bcrypt.compare(password, user.password)
  
  if (!isValidPassword) {
    throw new Error('Invalid credentials')
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id.toString(), username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
  
  const { password: _, ...userWithoutPassword } = user
  return { 
    user: { ...userWithoutPassword, id: user._id.toString() }, 
    token 
  }
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export async function getUserById(userId) {
  const db = getDB()
  const usersCollection = db.collection('users')
  
  const { ObjectId } = await import('mongodb')
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) })
  
  if (!user) {
    return null
  }
  
  const { password: _, ...userWithoutPassword } = user
  return { ...userWithoutPassword, id: user._id.toString() }
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }
  
  const token = authHeader.substring(7)
  
  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

import { randomBytes } from 'crypto'
import { getDB } from './db.js'

function generateSiteId() {
  return randomBytes(8).toString('hex')
}

export async function publishSite(html, theme, userId = null, title = 'Untitled Site') {
  const db = getDB()
  const siteId = generateSiteId()
  const siteData = {
    id: siteId,
    html,
    theme,
    title,
    userId,
    createdAt: new Date(),
    views: 0
  }

  await db.collection('sites').insertOne(siteData)
  
  // If user is logged in, add site to their profile
  if (userId) {
    const { ObjectId } = await import('mongodb')
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $push: { 
          sites: {
            id: siteId,
            title,
            theme,
            createdAt: new Date()
          }
        } 
      }
    )
  }
  
  return siteId
}

export async function getUserSites(userId) {
  const db = getDB()
  const sites = await db.collection('sites')
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray()
  return sites
}

export async function deleteSite(siteId, userId) {
  const db = getDB()
  const { ObjectId } = await import('mongodb')
  
  // Delete from sites collection
  await db.collection('sites').deleteOne({ id: siteId, userId })
  
  // Remove from user's sites array
  await db.collection('users').updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { sites: { id: siteId } } }
  )
}

export async function getSite(siteId) {
  try {
    const db = getDB()
    const site = await db.collection('sites').findOne({ id: siteId })
    return site
  } catch (error) {
    console.error('getSite error:', error)
    throw error
  }
}

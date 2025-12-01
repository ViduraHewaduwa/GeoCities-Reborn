import { randomBytes } from 'crypto'
import { getDB } from './db.js'

function generateSiteId() {
  return randomBytes(8).toString('hex')
}

export async function publishSite(html, theme, userId = null, title = 'Untitled Site', city = 'Area51') {
  const db = getDB()
  const siteId = generateSiteId()
  const siteData = {
    id: siteId,
    html,
    theme,
    title,
    city,
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
            city,
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

export async function updateSite(siteId, userId, html) {
  const db = getDB()
  const { ObjectId } = await import('mongodb')
  
  // Update site in sites collection
  const result = await db.collection('sites').updateOne(
    { id: siteId, userId },
    { 
      $set: { 
        html,
        updatedAt: new Date()
      } 
    }
  )
  
  return result.modifiedCount > 0
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

export async function getPublicSites(city = null, limit = 50) {
  const db = getDB()
  const query = city ? { city } : {}
  const sites = await db.collection('sites')
    .find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .project({ html: 0 }) // Don't return full HTML in gallery
    .toArray()
  return sites
}

export async function getSitesByCity() {
  const db = getDB()
  const sites = await db.collection('sites')
    .aggregate([
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' }
        }
      },
      {
        $project: {
          city: '$_id',
          count: 1,
          totalViews: 1,
          _id: 0
        }
      }
    ])
    .toArray()
  return sites
}

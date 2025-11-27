import { randomBytes } from 'crypto'
import { getDB } from './db.js'

function generateSiteId() {
  return randomBytes(8).toString('hex')
}

export async function publishSite(html, theme) {
  const db = getDB()
  const siteId = generateSiteId()
  const siteData = {
    id: siteId,
    html,
    theme,
    createdAt: new Date()
  }

  await db.collection('sites').insertOne(siteData)
  return siteId
}

export async function getSite(siteId) {
  const db = getDB()
  const site = await db.collection('sites').findOne({ id: siteId })
  return site
}

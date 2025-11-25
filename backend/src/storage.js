import { randomBytes } from 'crypto'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const STORAGE_DIR = join(__dirname, '../data/sites')

// Ensure storage directory exists
if (!existsSync(STORAGE_DIR)) {
  mkdirSync(STORAGE_DIR, { recursive: true })
}

function generateSiteId() {
  return randomBytes(8).toString('hex')
}

export function publishSite(html, theme) {
  const siteId = generateSiteId()
  const siteData = {
    id: siteId,
    html,
    theme,
    createdAt: new Date().toISOString()
  }

  const filePath = join(STORAGE_DIR, `${siteId}.json`)
  writeFileSync(filePath, JSON.stringify(siteData, null, 2))

  return siteId
}

export function getSite(siteId) {
  const filePath = join(STORAGE_DIR, `${siteId}.json`)
  
  if (!existsSync(filePath)) {
    return null
  }

  const data = readFileSync(filePath, 'utf-8')
  return JSON.parse(data)
}

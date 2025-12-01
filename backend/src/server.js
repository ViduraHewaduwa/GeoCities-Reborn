import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { generatePage } from './generator.js'
import { publishSite, getSite, getUserSites, updateSite, deleteSite, getPublicSites, getSitesByCity } from './storage.js'
import { registerUser, loginUser, getUserById, authMiddleware } from './auth.js'
import { connectDB, getDB } from './db.js'
import { generateCodeWithAI, improveCode, explainCode, fixCodeErrors, generateRetroWebsite } from './gemini.js'
import jwt from 'jsonwebtoken'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Connect to MongoDB
await connectDB()

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const user = await registerUser(username, email, password)
    res.status(201).json({ user })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(400).json({ error: error.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }

    const { user, token } = await loginUser(username, password)
    res.json({ user, token })
  } catch (error) {
    console.error('Login error:', error)
    res.status(401).json({ error: error.message })
  }
})

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.user.userId)
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
})

// Generate page endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { description, theme, remix } = req.body

    if (!description || description.length < 10) {
      return res.status(400).json({ 
        error: 'Description must be at least 10 characters' 
      })
    }

    if (description.length > 500) {
      return res.status(400).json({ 
        error: 'Description must be less than 500 characters' 
      })
    }

    const html = generatePage(description, theme, remix)
    
    res.json({ html })
  } catch (error) {
    console.error('Generation error:', error)
    res.status(500).json({ error: 'Failed to generate page' })
  }
})

// Publish site endpoint (with optional auth)
app.post('/api/publish', async (req, res) => {
  try {
    const { html, theme, title, city } = req.body

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' })
    }

    // Check if user is authenticated (optional)
    let userId = null
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'geocities-secret-key-change-in-production')
        userId = decoded.userId
      } catch (err) {
        // Token invalid, publish anonymously
      }
    }

    const siteId = await publishSite(html, theme || 'random', userId, title || 'My GeoCities Site', city || 'Area51')
    
    res.json({ siteId })
  } catch (error) {
    console.error('Publish error:', error)
    res.status(500).json({ error: 'Failed to publish site' })
  }
})

// View published site endpoint
app.get('/site/:siteId', async (req, res) => {
  try {
    const { siteId } = req.params
    console.log('Fetching site:', siteId)
    
    const site = await getSite(siteId)
    console.log('Site found:', site ? 'yes' : 'no')

    if (!site) {
      return res.status(404).send('<h1>404 - Site Not Found</h1><p>Site ID: ' + siteId + '</p>')
    }

    if (!site.html) {
      console.error('Site has no HTML content:', siteId)
      return res.status(500).send('<h1>500 - Site has no content</h1>')
    }

    // Increment view count (non-blocking, don't wait for it)
    try {
      const db = getDB()
      db.collection('sites').updateOne(
        { id: siteId },
        { $inc: { views: 1 } }
      ).catch(err => console.error('View count update error:', err))
    } catch (viewError) {
      console.error('View count error:', viewError)
    }

    res.send(site.html)
  } catch (error) {
    console.error('Retrieval error:', error)
    console.error('Error details:', error.message, error.stack)
    res.status(500).send('<h1>500 - Server Error</h1><p>' + error.message + '</p>')
  }
})

// AI Code Generation Endpoints
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, codeContext, language, theme } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const code = await generateCodeWithAI(prompt, codeContext, language, theme)
    res.json({ code })
  } catch (error) {
    console.error('AI generation error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/ai/improve', async (req, res) => {
  try {
    const { code, instruction, language } = req.body

    if (!code || !instruction) {
      return res.status(400).json({ error: 'Code and instruction are required' })
    }

    const improvedCode = await improveCode(code, instruction, language)
    res.json({ code: improvedCode })
  } catch (error) {
    console.error('AI improve error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/ai/explain', async (req, res) => {
  try {
    const { code, language } = req.body

    if (!code) {
      return res.status(400).json({ error: 'Code is required' })
    }

    const explanation = await explainCode(code, language)
    res.json({ explanation })
  } catch (error) {
    console.error('AI explain error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/ai/fix', async (req, res) => {
  try {
    const { code, language } = req.body

    if (!code) {
      return res.status(400).json({ error: 'Code is required' })
    }

    const fixedCode = await fixCodeErrors(code, language)
    res.json({ code: fixedCode })
  } catch (error) {
    console.error('AI fix error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/ai/generate-website', async (req, res) => {
  try {
    const { description, theme } = req.body

    if (!description) {
      return res.status(400).json({ error: 'Description is required' })
    }

    const html = await generateRetroWebsite(description, theme)
    res.json({ html })
  } catch (error) {
    console.error('AI website generation error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get user's published sites
app.get('/api/user/sites', authMiddleware, async (req, res) => {
  try {
    const sites = await getUserSites(req.user.userId)
    res.json({ sites })
  } catch (error) {
    console.error('Get sites error:', error)
    res.status(500).json({ error: 'Failed to get sites' })
  }
})

// Get a single site for editing
app.get('/api/sites/:siteId', authMiddleware, async (req, res) => {
  try {
    const { siteId } = req.params
    const site = await getSite(siteId)
    
    if (!site) {
      return res.status(404).json({ error: 'Site not found' })
    }

    // Only allow owner to get full HTML
    if (site.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    res.json({ html: site.html, title: site.title, city: site.city })
  } catch (error) {
    console.error('Get site error:', error)
    res.status(500).json({ error: 'Failed to get site' })
  }
})

// Update a site
app.put('/api/sites/:siteId', authMiddleware, async (req, res) => {
  try {
    const { siteId } = req.params
    const { html } = req.body

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' })
    }

    const updated = await updateSite(siteId, req.user.userId, html)
    
    if (!updated) {
      return res.status(404).json({ error: 'Site not found or unauthorized' })
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Update site error:', error)
    res.status(500).json({ error: 'Failed to update site' })
  }
})

// Delete a site
app.delete('/api/sites/:siteId', authMiddleware, async (req, res) => {
  try {
    const { siteId } = req.params
    await deleteSite(siteId, req.user.userId)
    res.json({ success: true })
  } catch (error) {
    console.error('Delete site error:', error)
    res.status(500).json({ error: 'Failed to delete site' })
  }
})

// Get public gallery sites
app.get('/api/gallery', async (req, res) => {
  try {
    const { city, limit } = req.query
    const sites = await getPublicSites(city, parseInt(limit) || 50)
    res.json({ sites })
  } catch (error) {
    console.error('Gallery error:', error)
    res.status(500).json({ error: 'Failed to get gallery' })
  }
})

// Get sites grouped by city
app.get('/api/cities', async (req, res) => {
  try {
    const cities = await getSitesByCity()
    res.json({ cities })
  } catch (error) {
    console.error('Cities error:', error)
    res.status(500).json({ error: 'Failed to get cities' })
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'GeoCities Reborn API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/*',
      sites: '/api/sites/*',
      publish: '/api/publish',
      view: '/site/:siteId'
    }
  })
})

app.listen(PORT, () => {
  console.log(`🌐 GeoCities Generator API running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})

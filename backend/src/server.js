import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { generatePage } from './generator.js'
import { publishSite, getSite } from './storage.js'
import { registerUser, loginUser, getUserById, authMiddleware } from './auth.js'
import { connectDB } from './db.js'
import { generateCodeWithAI, improveCode, explainCode, fixCodeErrors, generateRetroWebsite } from './gemini.js'
import uploadRouter from './routes/upload.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Connect to MongoDB
await connectDB()

// Upload endpoint
app.use('/api/upload', uploadRouter)

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

// Publish site endpoint
app.post('/api/publish', async (req, res) => {
  try {
    const { html, theme } = req.body

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' })
    }

    const siteId = publishSite(html, theme || 'random')
    
    res.json({ siteId })
  } catch (error) {
    console.error('Publish error:', error)
    res.status(500).json({ error: 'Failed to publish site' })
  }
})

// View published site endpoint
app.get('/site/:siteId', (req, res) => {
  try {
    const { siteId } = req.params
    const site = getSite(siteId)

    if (!site) {
      return res.status(404).send('<h1>404 - Site Not Found</h1>')
    }

    res.send(site.html)
  } catch (error) {
    console.error('Retrieval error:', error)
    res.status(500).send('<h1>500 - Server Error</h1>')
  }
})

// AI Code Generation Endpoints
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, codeContext, language } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const code = await generateCodeWithAI(prompt, codeContext, language)
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

app.listen(PORT, () => {
  console.log(`🌐 GeoCities Generator API running on http://localhost:${PORT}`)
})

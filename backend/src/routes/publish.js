import express from 'express'
import { generatePage } from '../generator.js'
import { publishSite, getSite } from '../storage.js'

const router = express.Router()

router.post('/generate', async (req, res) => {
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

router.post('/publish', async (req, res) => {
  try {
    const { html, theme } = req.body

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' })
    }

    const siteId = await publishSite(html, theme || 'random')
    
    res.json({ siteId })
  } catch (error) {
    console.error('Publish error:', error)
    res.status(500).json({ error: 'Failed to publish site' })
  }
})

router.get('/site/:siteId', async (req, res) => {
  try {
    const { siteId } = req.params
    const site = await getSite(siteId)

    if (!site) {
      return res.status(404).send('<h1>404 - Site Not Found</h1>')
    }

    res.send(site.html)
  } catch (error) {
    console.error('Retrieval error:', error)
    res.status(500).send('<h1>500 - Server Error</h1>')
  }
})

export default router

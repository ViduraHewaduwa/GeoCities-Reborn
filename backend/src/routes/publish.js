import express from 'express'
import { generatePage } from '../generator.js'
import { publishSite, getSite, updateSite } from '../storage.js'

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

router.put('/sites/:siteId', async (req, res) => {
  try {
    const { siteId } = req.params
    const { html, title, theme } = req.body

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' })
    }

    // Update site in storage
    const updated = await updateSite(siteId, { html, title, theme })
    
    if (!updated) {
      return res.status(404).json({ error: 'Site not found' })
    }

    res.json({ success: true, siteId })
  } catch (error) {
    console.error('Update error:', error)
    res.status(500).json({ error: 'Failed to update site' })
  }
})

export default router

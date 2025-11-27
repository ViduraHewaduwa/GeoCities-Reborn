import express from 'express'
import { generateCodeWithAI, improveCode, explainCode, fixCodeErrors, generateRetroWebsite } from '../gemini.js'

const router = express.Router()

router.post('/generate', async (req, res) => {
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

router.post('/improve', async (req, res) => {
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

router.post('/explain', async (req, res) => {
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

router.post('/fix', async (req, res) => {
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

router.post('/generate-website', async (req, res) => {
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

export default router

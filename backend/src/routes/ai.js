import express from 'express'
import { generateCodeWithAI, improveCode, explainCode, fixCodeErrors, generateRetroWebsite } from '../gemini.js'

const router = express.Router()

router.post('/generate', async (req, res) => {
  try {
    const { prompt, codeContext, language, theme } = req.body

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ 
        error: 'VALIDATION_ERROR: Prompt is required and cannot be empty' 
      })
    }

    if (prompt.length > 5000) {
      return res.status(400).json({ 
        error: 'VALIDATION_ERROR: Prompt is too long (max 5000 characters)' 
      })
    }

    const code = await generateCodeWithAI(prompt, codeContext, language, theme)
    
    if (!code || code.trim().length === 0) {
      return res.status(500).json({ 
        error: 'EMPTY_RESPONSE: AI returned empty code. Try rephrasing your request.' 
      })
    }

    res.json({ code, success: true })
  } catch (error) {
    console.error('AI generation error:', {
      message: error.message,
      timestamp: new Date().toISOString(),
      prompt: req.body.prompt?.substring(0, 100)
    })
    
    const statusCode = error.message?.includes('API_KEY_MISSING') ? 503 : 500
    res.status(statusCode).json({ error: error.message || 'Failed to generate code' })
  }
})

router.post('/improve', async (req, res) => {
  try {
    const { code, instruction, language } = req.body

    if (!code || code.trim().length === 0) {
      return res.status(400).json({ 
        error: 'VALIDATION_ERROR: Code is required and cannot be empty' 
      })
    }

    if (!instruction || instruction.trim().length === 0) {
      return res.status(400).json({ 
        error: 'VALIDATION_ERROR: Instruction is required and cannot be empty' 
      })
    }

    const improvedCode = await improveCode(code, instruction, language)
    res.json({ code: improvedCode, success: true })
  } catch (error) {
    console.error('AI improve error:', error.message)
    const statusCode = error.message?.includes('API_KEY_MISSING') ? 503 : 500
    res.status(statusCode).json({ error: error.message || 'Failed to improve code' })
  }
})

router.post('/explain', async (req, res) => {
  try {
    const { code, language } = req.body

    if (!code || code.trim().length === 0) {
      return res.status(400).json({ 
        error: 'VALIDATION_ERROR: Code is required and cannot be empty' 
      })
    }

    if (code.length > 10000) {
      return res.status(400).json({ 
        error: 'VALIDATION_ERROR: Code is too long (max 10000 characters)' 
      })
    }

    const explanation = await explainCode(code, language)
    res.json({ explanation, success: true })
  } catch (error) {
    console.error('AI explain error:', error.message)
    const statusCode = error.message?.includes('API_KEY_MISSING') ? 503 : 500
    res.status(statusCode).json({ error: error.message || 'Failed to explain code' })
  }
})

router.post('/fix', async (req, res) => {
  try {
    const { code, language } = req.body

    if (!code || code.trim().length === 0) {
      return res.status(400).json({ 
        error: 'VALIDATION_ERROR: Code is required and cannot be empty' 
      })
    }

    const fixedCode = await fixCodeErrors(code, language)
    res.json({ code: fixedCode, success: true })
  } catch (error) {
    console.error('AI fix error:', error.message)
    const statusCode = error.message?.includes('API_KEY_MISSING') ? 503 : 500
    res.status(statusCode).json({ error: error.message || 'Failed to fix code' })
  }
})

router.post('/generate-website', async (req, res) => {
  try {
    const { description, theme } = req.body

    if (!description || description.trim().length === 0) {
      return res.status(400).json({ 
        error: 'VALIDATION_ERROR: Description is required and cannot be empty' 
      })
    }

    if (description.length > 2000) {
      return res.status(400).json({ 
        error: 'VALIDATION_ERROR: Description is too long (max 2000 characters)' 
      })
    }

    const html = await generateRetroWebsite(description, theme)
    res.json({ html, success: true })
  } catch (error) {
    console.error('AI website generation error:', error.message)
    const statusCode = error.message?.includes('API_KEY_MISSING') ? 503 : 500
    res.status(statusCode).json({ error: error.message || 'Failed to generate website' })
  }
})

export default router

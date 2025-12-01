import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function generateCodeWithAI(prompt, codeContext = '', language = 'html', theme = 'default') {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in .env file')
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const themeStyles = {
      cyber: 'Use neon green and cyan colors, matrix-style effects, tech aesthetic with monospace fonts, dark backgrounds, and glowing text effects.',
      gamer: 'Use bright red, yellow, blue colors, gaming aesthetic with pixel art vibes, bold fonts, and energetic animations.',
      glitter: 'Use pink, gold, sparkly colors, feminine and glamorous style with gradients, shadows, and decorative elements.',
      space: 'Use dark blue, stars, cosmic theme with planets and rockets, space-themed colors and celestial elements.',
      default: 'Use bright neon colors (magenta, cyan, yellow), classic 90s GeoCities style with Comic Sans MS font and retro elements.'
    }

    const themeInstruction = themeStyles[theme] || themeStyles.default

    const systemPrompt = `You are an expert web developer specializing in creating retro 90s GeoCities-style websites. 
Generate clean, working code with vibrant colors, fun animations, and nostalgic 90s web aesthetics.
Use inline styles, marquees, and retro elements.
DO NOT include image tags, GIF references, or external images unless the user specifically requests them.
Use CSS animations, emojis, and text effects instead.
Always return ONLY the code without explanations or markdown formatting.

THEME STYLE: ${themeInstruction}`

    const fullPrompt = codeContext 
      ? `${systemPrompt}\n\nExisting code:\n${codeContext}\n\nUser request: ${prompt}\n\nGenerate the updated ${language} code:`
      : `${systemPrompt}\n\nUser request: ${prompt}\n\nGenerate ${language} code:`

    const result = await model.generateContent(fullPrompt)
    const response = result.response
    let code = response.text()

    // Clean up markdown code blocks if present
    code = code.replace(/```html\n?/g, '').replace(/```css\n?/g, '').replace(/```javascript\n?/g, '').replace(/```\n?/g, '')
    
    return code.trim()
  } catch (error) {
    console.error('Gemini API Error Details:', error.message, error.status)
    throw new Error(error.message || 'Failed to generate code with AI')
  }
}

export async function improveCode(code, instruction, language = 'html') {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      throw new Error('Gemini API key not configured')
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `You are a code improvement assistant. 
Improve the following ${language} code based on this instruction: "${instruction}"

Current code:
${code}

Return ONLY the improved code without explanations or markdown formatting.`

    const result = await model.generateContent(prompt)
    const response = result.response
    let improvedCode = response.text()

    // Clean up markdown code blocks
    improvedCode = improvedCode.replace(/```html\n?/g, '').replace(/```css\n?/g, '').replace(/```javascript\n?/g, '').replace(/```\n?/g, '')
    
    return improvedCode.trim()
  } catch (error) {
    console.error('Gemini API Error:', error.message)
    throw new Error(error.message || 'Failed to improve code with AI')
  }
}

export async function explainCode(code, language = 'html') {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      throw new Error('Gemini API key not configured')
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `Explain what this ${language} code does in simple terms:

${code}

Provide a brief, friendly explanation.`

    const result = await model.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API Error:', error.message)
    throw new Error(error.message || 'Failed to explain code')
  }
}

export async function fixCodeErrors(code, language = 'html') {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      throw new Error('Gemini API key not configured')
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `Fix any errors or issues in this ${language} code and return the corrected version:

${code}

Return ONLY the fixed code without explanations or markdown formatting.`

    const result = await model.generateContent(prompt)
    const response = result.response
    let fixedCode = response.text()

    // Clean up markdown code blocks
    fixedCode = fixedCode.replace(/```html\n?/g, '').replace(/```css\n?/g, '').replace(/```javascript\n?/g, '').replace(/```\n?/g, '')
    
    return fixedCode.trim()
  } catch (error) {
    console.error('Gemini API Error:', error.message)
    throw new Error(error.message || 'Failed to fix code')
  }
}

export async function generateRetroWebsite(description, theme = 'default') {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      throw new Error('Gemini API key not configured')
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const themeStyles = {
      cyber: 'neon green and cyan colors, matrix-style, tech aesthetic',
      gamer: 'bright red, yellow, blue colors, gaming aesthetic with pixel art vibes',
      glitter: 'pink, gold, sparkly colors, feminine and glamorous',
      space: 'dark blue, stars, cosmic theme with planets and rockets',
      default: 'bright neon colors (magenta, cyan, yellow), classic 90s GeoCities style'
    }

    const themeDesc = themeStyles[theme] || themeStyles.default

    const prompt = `Create a complete retro 90s GeoCities-style website about: "${description}"

Theme: ${themeDesc}

Requirements:
- Use inline CSS styles
- Include Comic Sans MS or Impact fonts
- Add marquee tags for scrolling text
- Use bright neon colors and gradients
- Add blinking text animations
- Include fun emojis and symbols
- Add a visitor counter
- Include "under construction" elements
- Make it nostalgic and fun
- Use tables for layout (90s style)
- Add rainbow text effects
- Use CSS animations instead of GIFs
- DO NOT include image tags or GIF references unless specifically requested

Return ONLY the complete HTML code without explanations.`

    const result = await model.generateContent(prompt)
    const response = result.response
    let html = response.text()

    // Clean up markdown code blocks
    html = html.replace(/```html\n?/g, '').replace(/```\n?/g, '')
    
    return html.trim()
  } catch (error) {
    console.error('Gemini API Error:', error.message)
    throw new Error(error.message || 'Failed to generate website')
  }
}

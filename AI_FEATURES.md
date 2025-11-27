# 🤖 AI Features - Powered by Google Gemini

## Overview
GeoCities Reborn now includes powerful AI features powered by Google Gemini to help you create and edit retro websites with ease!

## Features

### 1. 🎨 AI Website Generator
Generate complete retro websites from a simple description!

**How to use:**
1. Click the "AI GENERATOR" card on the homepage
2. Describe what kind of website you want
3. Choose a theme (Classic 90s, Cyber, Gamer, Glitter, or Space)
4. Click "Generate Website"
5. Your AI-generated website opens in the editor!

**Example prompts:**
- "A fan page about my favorite 90s band"
- "A personal blog about cats with lots of sparkles"
- "A tribute to retro video games"

### 2. 🤖 AI Code Assistant
Get AI help while editing your code in the Build Page!

**Features:**
- **✨ Generate**: Create new code from descriptions
- **🔧 Improve**: Enhance existing code with AI suggestions
- **💡 Explain**: Get explanations of what your code does
- **🩹 Fix**: Automatically fix errors in your code

**How to use:**
1. Open the Build Page
2. Click the "🤖 AI Assistant" button (bottom right)
3. Choose a tab (Generate, Improve, Explain, or Fix)
4. Enter your request or click the action button
5. AI updates your code instantly!

**Example requests:**
- Generate: "Add a rainbow gradient background with stars"
- Improve: "Make the text more colorful and add animations"
- Explain: Click to understand what your code does
- Fix: Click to automatically fix any errors

## Setup

### Get Your Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Configure the Backend
1. Open `backend/.env`
2. Replace `your_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Save the file
4. Restart the backend server

## API Endpoints

### Generate Code
```
POST /api/ai/generate
Body: { prompt, codeContext?, language? }
```

### Improve Code
```
POST /api/ai/improve
Body: { code, instruction, language? }
```

### Explain Code
```
POST /api/ai/explain
Body: { code, language? }
```

### Fix Code
```
POST /api/ai/fix
Body: { code, language? }
```

### Generate Website
```
POST /api/ai/generate-website
Body: { description, theme? }
```

## Tips for Best Results

1. **Be Specific**: The more detailed your description, the better the results
2. **Use Themes**: Choose appropriate themes for your desired aesthetic
3. **Iterate**: Use the Improve feature to refine AI-generated code
4. **Experiment**: Try different prompts to see what works best

## Troubleshooting

### "Failed to generate code"
- Check that your Gemini API key is correctly set in `.env`
- Ensure the backend server is running
- Verify your API key is valid and has quota remaining

### AI responses are slow
- Gemini API may take a few seconds to respond
- This is normal for complex requests
- Be patient and wait for the response

### Generated code has issues
- Use the "Fix" feature to automatically correct errors
- Try being more specific in your prompts
- Manually edit the code as needed

## Examples

### Example 1: Generate a Header
**Prompt**: "Create a header with rainbow text that says 'Welcome to My Page' with a blinking cursor"

### Example 2: Improve Styling
**Instruction**: "Add more 90s style with neon colors and a marquee"

### Example 3: Generate Complete Website
**Description**: "A personal homepage about my pet hamster with photos, fun facts, and a guestbook"
**Theme**: Glitter

## Notes

- AI features require an active internet connection
- Gemini API has usage limits (check Google AI Studio for details)
- Generated code follows retro 90s GeoCities aesthetics
- All AI features work with HTML, CSS, and JavaScript

## Support

For issues or questions:
- Check the Gemini API documentation
- Verify your API key is valid
- Ensure backend server is running on port 3001
- Check browser console for error messages

---

**Powered by Google Gemini AI** 🤖✨

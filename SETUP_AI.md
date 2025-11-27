# 🚀 Quick Setup Guide for AI Features

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy the generated API key

## Step 2: Configure Backend

1. Open the file `backend/.env`
2. Find the line: `GEMINI_API_KEY=your_api_key_here`
3. Replace `your_api_key_here` with your actual API key
4. Save the file

Example:
```env
GEMINI_API_KEY=AIzaSyABC123def456GHI789jkl012MNO345pqr
```

## Step 3: Install Dependencies

The Google Gemini package is already installed! But if you need to reinstall:

```bash
cd backend
npm install
```

## Step 4: Start the Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
🌐 GeoCities Generator API running on http://localhost:3001
```

## Step 5: Start the Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

## Step 6: Test AI Features

1. Open your browser to the frontend URL (usually `http://localhost:5173`)
2. Click the **"AI GENERATOR"** card on the homepage
3. Enter a description like: "A fan page about 90s cartoons"
4. Choose a theme
5. Click **"Generate Website"**
6. Watch the magic happen! ✨

## Verify It's Working

### Test 1: AI Website Generator
- Homepage → Click "AI GENERATOR" card
- Enter any description
- Should generate a complete website

### Test 2: AI Code Assistant
- Go to Build Page
- Click "🤖 AI Assistant" button (bottom right)
- Try the "Explain" feature on any code
- Should show an explanation

## Troubleshooting

### Error: "Failed to generate code"
**Solution**: Check your API key in `backend/.env`

### Error: "Cannot connect to server"
**Solution**: Make sure backend is running on port 3001

### API Key Not Working
**Solution**: 
1. Verify the key is correct (no extra spaces)
2. Check if the key has quota remaining
3. Try generating a new key

### Backend Won't Start
**Solution**:
```bash
cd backend
npm install
npm run dev
```

## API Key Limits

- Free tier: 60 requests per minute
- If you hit limits, wait a minute and try again
- For production, consider upgrading your API plan

## Security Note

⚠️ **Never commit your `.env` file to Git!**

The `.env` file is already in `.gitignore`, but double-check:
```bash
git status
```

If you see `.env` listed, remove it:
```bash
git rm --cached backend/.env
```

## Next Steps

Once everything is working:

1. Try different AI prompts
2. Experiment with themes
3. Use the AI Assistant while coding
4. Have fun creating retro websites! 🎨

---

Need help? Check `AI_FEATURES.md` for detailed documentation!

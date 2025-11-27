# Vercel Deployment Guide

## Fixed Issues

✅ Created missing route files:
- `backend/src/routes/auth.js`
- `backend/src/routes/ai.js`
- `backend/src/routes/publish.js`

✅ Updated storage to use MongoDB instead of filesystem
✅ Added database connection initialization in serverless function

## Required Environment Variables

Set these in your Vercel project settings:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key
DB_NAME=geocities
```

## Known Limitations

⚠️ **File Uploads**: The `/api/upload` endpoint currently saves files to the filesystem, which won't persist on Vercel serverless. 

**Solutions:**
1. Use Vercel Blob Storage
2. Use AWS S3
3. Use Cloudinary

## Deploy Steps

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Testing Locally

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Vercel Build Settings

- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/dist`
- Install Command: `npm install`

The serverless function at `api/index.js` will automatically handle backend routes.

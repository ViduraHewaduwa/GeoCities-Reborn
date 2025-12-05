---
inclusion: always
---

# Tech Stack

## Frontend

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Routing**: React Router DOM 7
- **Code Editor**: Monaco Editor (@monaco-editor/react)
- **Rich Text**: TipTap (WYSIWYG editor)
- **Styling**: CSS modules with retro aesthetic

## Backend

- **Runtime**: Node.js with ES modules (`"type": "module"`)
- **Framework**: Express 4
- **Database**: MongoDB 7
- **Authentication**: JWT + bcryptjs
- **AI**: Google Gemini API (@google/generative-ai)
- **File Upload**: Multer 2

## Common Commands

### Frontend (from `frontend/` directory)
```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript compile + Vite build
npm run lint         # ESLint check
npm run preview      # Preview production build
```

### Backend (from `backend/` directory)
```bash
npm run dev          # Start with --watch (auto-reload)
npm start            # Production start
```

## Environment Variables

### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `GEMINI_API_KEY` - Google Gemini API key
- `PORT` - Server port (default: 3001)

### Frontend (.env.production)
- `VITE_API_URL` - Backend API URL

## Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with React hooks and TypeScript rules
- **Formatting**: Format on type and paste enabled in Monaco
- **Imports**: ES modules throughout (no CommonJS)

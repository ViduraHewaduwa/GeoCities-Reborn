---
inclusion: always
---

# Project Structure

## Root Layout

```
/
├── frontend/          # React + TypeScript frontend
├── backend/           # Node.js + Express backend
├── api/               # Vercel serverless function
└── .kiro/             # Kiro AI configuration
```

## Frontend Structure (`frontend/src/`)

```
src/
├── components/        # Reusable React components
│   ├── AIAssistant.tsx           # Gemini AI chat interface
│   ├── AIWebsiteGenerator.tsx    # AI-powered site generation
│   ├── CodeEditor.tsx            # Monaco editor wrapper
│   ├── PageBuilder.tsx           # Multi-file code editor
│   ├── WYSIWYGEditor.tsx         # TipTap rich text editor
│   ├── Modal.tsx                 # Reusable modal component
│   ├── ProfileMenu.tsx           # User profile dropdown
│   └── ProtectedRoute.tsx        # Auth route guard
├── pages/             # Route pages
│   ├── HomePage.tsx              # Retro landing page
│   ├── BuildPage.tsx             # Template selection
│   ├── GalleryPage.tsx           # Browse neighborhoods
│   ├── NeighborhoodPage.tsx      # Filtered site view
│   ├── ProfilePage.tsx           # User dashboard
│   ├── LoginPage.tsx             # Authentication
│   └── RegisterPage.tsx          # User registration
├── context/           # React context providers
│   └── AuthContext.tsx           # Auth state management
├── hooks/             # Custom React hooks (empty)
└── assets/            # Static assets
```

## Backend Structure (`backend/src/`)

```
src/
├── routes/            # Express route handlers
├── server.js          # Express app entry point
├── db.js              # MongoDB connection
├── auth.js            # JWT authentication middleware
├── gemini.js          # Google Gemini AI integration
├── generator.js       # Site generation logic
└── storage.js         # File storage utilities
```

## Component Patterns

### Pages
- Full-page route components
- Handle navigation and layout
- Co-located CSS files (e.g., `HomePage.css`)

### Components
- Reusable UI elements
- Self-contained with own styles
- Props-based configuration

### Context
- Global state management (auth, user data)
- Avoid prop drilling

## File Naming

- **Components**: PascalCase (e.g., `AIAssistant.tsx`)
- **Pages**: PascalCase with "Page" suffix (e.g., `HomePage.tsx`)
- **Styles**: Match component name (e.g., `HomePage.css`)
- **Backend**: camelCase (e.g., `gemini.js`)

## Key Conventions

- Each component has co-located CSS file
- TypeScript for all frontend code
- ES modules throughout (`.js` files use `import/export`)
- API routes prefixed with `/api/`
- Protected routes use `ProtectedRoute` wrapper

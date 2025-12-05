---
name: "Generate New Page Template"
description: "Create a new page component with boilerplate code matching project structure"
trigger: "manual"
enabled: true
---

# Generate New Page Template

When creating a new page component, generate:

1. **TypeScript React component** in `frontend/src/pages/`
2. **Corresponding CSS file** with retro GeoCities styling
3. **Route entry** suggestion for App.tsx
4. **Navigation link** suggestion for HomePage.tsx or ProfileMenu

## Template Structure

```tsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProfileMenu from '../components/ProfileMenu'
import './[PageName].css'

export default function [PageName]() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <div className="[page-name]-page">
      <div className="[page-name]-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <h1>🎨 [PAGE TITLE]</h1>
        </div>
        {isAuthenticated && <ProfileMenu />}
      </div>

      <div className="[page-name]-content">
        {/* Content here */}
      </div>
    </div>
  )
}
```

## CSS Template

Use the retro GeoCities aesthetic with:
- Dark gradient backgrounds
- Bright neon colors (#ff00ff, #00ffff, #ffff00)
- Box shadows and borders
- Retro fonts (Comic Sans MS, Impact)
- Hover animations

## Instructions

Ask for the page name, then generate both files with proper naming conventions and suggest where to add the route.

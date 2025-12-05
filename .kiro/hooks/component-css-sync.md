---
name: "Component CSS Sync"
description: "Ensure component and CSS file stay in sync"
trigger: "onFileSave"
filePattern: "frontend/src/**/*.tsx"
enabled: true
---

# Component CSS Sync

Keep React components and their CSS files synchronized.

## Checks to Perform

### When Component is Saved

1. **CSS Import Check**
   - Verify component imports its CSS file
   - Format: `import './ComponentName.css'`

2. **CSS File Exists**
   - Check if corresponding CSS file exists
   - If not, offer to create it with retro styling

3. **Class Names Match**
   - Extract all className attributes from component
   - Check if those classes exist in CSS file
   - Report any missing classes

4. **Unused Classes**
   - Find CSS classes not used in component
   - Suggest removing or ask if they're intentional

## Auto-Create CSS Template

If CSS file doesn't exist, create with:

```css
/* Styles for [ComponentName] */

.[component-name]-page {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  min-height: 100vh;
  color: white;
}

.[component-name]-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #ff00ff;
}

/* Add more retro styles as needed */
```

## Instructions

When a .tsx file is saved:
1. Check for CSS import
2. Verify CSS file exists
3. Compare classNames with CSS classes
4. Report any mismatches
5. Offer to create missing CSS file or classes

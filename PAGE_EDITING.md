# Page Editing Feature

## Overview
Users can now edit their published pages using the **exact same multi-file editor interface** from BuildPage, providing a professional VS Code-like editing experience with file explorer and multi-file support.

## Features

### 1. Edit Button on Profile Page
- Each published site card now has an **✏️ Edit** button
- Clicking it opens the full BuildPage-style editor
- Only the site owner can edit their pages

### 2. Multi-File Editor (Identical to BuildPage)
- **File Explorer**: Left sidebar showing all files (HTML, CSS, JS)
- **Monaco Code Editor**: Professional code editor with syntax highlighting
- **Live Preview Panel**: Real-time preview (toggleable)
- **File Search**: Search through files in the explorer
- **Syntax Highlighting**: HTML, CSS, JavaScript support
- **Auto-completion and IntelliSense**
- **Line numbers and code folding**

### 3. File Management
- **Automatic File Parsing**: HTML is split into separate files:
  - `index.html` - Main HTML structure
  - `style.css` - Extracted from `<style>` tags
  - `script.js` - Extracted from `<script>` tags
- **File Switching**: Click files in explorer to edit
- **File Icons**: Visual indicators for file types (📄 HTML, 🎨 CSS, ⚡ JS)
- **Active File Highlighting**: Current file highlighted in explorer

### 4. Layout (Exact BuildPage Match)
- **Left**: File explorer with search
- **Center**: Code editor panel
- **Right**: Live preview panel (toggleable)
- **Top**: Toolbar with actions

### 4. Save & Cancel
- **💾 Save Changes**: Updates the published site
- **✕ Cancel**: Closes editor without saving
- Changes are saved to the database and reflected immediately

## User Workflow

1. Go to **My Profile** page
2. Find the site you want to edit
3. Click **✏️ Edit** button
4. Site opens in BuildPage-style editor with files parsed:
   - HTML content in `index.html`
   - CSS extracted to `style.css`
   - JavaScript extracted to `script.js`
5. Click files in explorer to switch between them
6. Edit code in Monaco editor
7. Toggle **👁️ Show/Hide Preview** to see live changes
8. Click **💾 Save Changes** to publish updates
9. Or click **✕ Cancel** to discard changes

## Technical Implementation

### Frontend
- **ProfilePage.tsx**: 
  - Added multi-file editor interface (exact copy of BuildPage)
  - HTML parsing logic to split into separate files
  - File explorer, search, and file switching
  - Preview HTML generation from multiple files
- **CodeEditor.tsx**: Reused existing Monaco editor component
- **ProfilePage.css**: Added BuildPage-style editor CSS (file explorer, panels, toolbar)

### Backend
- **storage.js**: Added `updateSite()` function
- **server.js**: Added two new endpoints:
  - `GET /api/sites/:siteId` - Fetch site HTML for editing (authenticated)
  - `PUT /api/sites/:siteId` - Update site HTML (authenticated)

### API Endpoints

#### Get Site for Editing
```
GET /api/sites/:siteId
Authorization: Bearer <token>

Response:
{
  "html": "<html>...</html>",
  "title": "My Site",
  "city": "Area51"
}
```

#### Update Site
```
PUT /api/sites/:siteId
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "html": "<html>...</html>"
}

Response:
{
  "success": true
}
```

## Security
- Only authenticated users can edit sites
- Users can only edit their own sites
- Authorization checked on both GET and PUT endpoints
- Site ownership verified via `userId` field

## UI/UX
- Full-screen overlay for distraction-free editing
- VS Code dark theme matching BuildPage
- Split-panel layout with code and preview
- Responsive design for mobile and desktop
- Toggle preview panel on/off
- Disabled save button while saving
- Professional code editing experience

## Future Enhancements
- [ ] Auto-save drafts
- [ ] Edit history/versioning
- [ ] Undo/redo functionality
- [ ] Code view mode (HTML/CSS/JS)
- [ ] Image upload support
- [ ] Collaborative editing
- [ ] Preview on different screen sizes

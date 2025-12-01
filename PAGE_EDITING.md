# Page Editing Feature

## Overview
Users can now edit their published pages using a WYSIWYG (What You See Is What You Get) editor, similar to the existing editor used in the PageBuilder component.

## Features

### 1. Edit Button on Profile Page
- Each published site card now has an **✏️ Edit** button
- Clicking it opens a full-screen editor overlay
- Only the site owner can edit their pages

### 2. WYSIWYG Editor
- Rich text editing with formatting toolbar
- **Bold**, *Italic*, <u>Underline</u> text
- Headings (H1, H2) and paragraphs
- Bullet and numbered lists
- Text color picker
- Same editor used in PageBuilder for consistency

### 3. Edit Modes
- **✏️ Edit Mode**: WYSIWYG editor for visual editing
- **👁️ Preview Mode**: See how the page will look live
- Toggle between modes with buttons

### 4. Save & Cancel
- **💾 Save Changes**: Updates the published site
- **✕ Cancel**: Closes editor without saving
- Changes are saved to the database and reflected immediately

## User Workflow

1. Go to **My Profile** page
2. Find the site you want to edit
3. Click **✏️ Edit** button
4. Make changes in the WYSIWYG editor
5. Switch to **Preview** to see results
6. Click **💾 Save Changes** to publish updates
7. Or click **✕ Cancel** to discard changes

## Technical Implementation

### Frontend
- **ProfilePage.tsx**: Added editor overlay and state management
- **WYSIWYGEditor.tsx**: Reused existing TipTap editor component
- **ProfilePage.css**: Added editor overlay styles

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
- Gradient header matching site theme
- Responsive design for mobile and desktop
- Clear visual feedback for active mode
- Disabled save button while saving

## Future Enhancements
- [ ] Auto-save drafts
- [ ] Edit history/versioning
- [ ] Undo/redo functionality
- [ ] Code view mode (HTML/CSS/JS)
- [ ] Image upload support
- [ ] Collaborative editing
- [ ] Preview on different screen sizes

# Project Naming Feature

## Overview
Users can now name their projects/sites, making it easier to organize and identify their work.

## Features

### 1. Initial Project Naming
When selecting a template, users are prompted to name their project:
- Default name: "My GeoCities Site"
- Can be customized immediately
- Stored in localStorage

### 2. Project Name Display

#### Toolbar
- Shows project name with folder icon: 📁 Project Name
- Click to edit inline
- Hover effect for better UX

#### File Explorer
- Shows project name at top: 📂 PROJECT NAME
- Uppercase display for emphasis
- Double-click to rename

### 3. Rename Project

#### Method 1: Click in Toolbar
1. Click on project name in toolbar
2. Inline input appears
3. Type new name
4. Press Enter or click away to save
5. Press Escape to cancel

#### Method 2: Double-Click in Explorer
1. Double-click project name in file explorer
2. Prompt dialog appears
3. Enter new name
4. Click OK to save

### 4. Project Name Usage

#### Downloads
- Filename uses project name
- Sanitized for file system compatibility
- Format: `project-name-timestamp.html`
- Example: `my-awesome-site-1234567890.html`

#### Clear Project
- Confirmation shows project name
- Message: "Clear 'Project Name' and start fresh?"
- Helps prevent accidental deletion

#### Auto-Save
- Project name saved to localStorage
- Persists across browser sessions
- Restored on page reload

## User Interface

### Toolbar Display
```
┌─────────────────────────────────────────┐
│ 📁 My GeoCities Site  |  5 files       │
│ [+File] [Download] [Publish] [Clear]   │
└─────────────────────────────────────────┘
```

### File Explorer Display
```
┌──────────────────┐
│ 📁 EXPLORER   ➕ │
├──────────────────┤
│ 📂 MY GEOCITIES  │
│    SITE          │
├──────────────────┤
│ 📄 index.html    │
│ 🎨 style.css     │
│ ⚡ script.js     │
└──────────────────┘
```

## Technical Implementation

### State Management
```typescript
const [projectName, setProjectName] = useState('My GeoCities Site')
const [isEditingName, setIsEditingName] = useState(false)
```

### LocalStorage
```typescript
// Save
localStorage.setItem('editor-project-name', projectName)

// Load
const savedProjectName = localStorage.getItem('editor-project-name')
if (savedProjectName) {
  setProjectName(savedProjectName)
}
```

### Filename Sanitization
```typescript
const sanitizedName = projectName
  .replace(/[^a-z0-9]/gi, '-')
  .toLowerCase()
```

## User Experience

### Initial Setup
1. User selects template
2. Prompt: "Enter your project name:"
3. Default: "My GeoCities Site"
4. User can accept or customize

### During Editing
1. Project name visible in toolbar
2. Project name visible in explorer
3. Click to edit anytime
4. Changes save automatically

### On Download
1. Click Download button
2. File downloads with project name
3. Format: `project-name-timestamp.html`
4. Easy to identify later

## Benefits

### Organization
- Easy to identify projects
- Meaningful filenames
- Better file management
- Clear project identity

### User Experience
- Personalization
- Professional feel
- Easy renaming
- Persistent naming

### File Management
- Descriptive downloads
- No generic filenames
- Easy to find files
- Better organization

## Examples

### Project Names
- "My Portfolio Site"
- "Cat Fan Page"
- "90s Nostalgia Hub"
- "Retro Gaming Blog"
- "Personal Homepage"

### Download Filenames
- `my-portfolio-site-1234567890.html`
- `cat-fan-page-1234567890.html`
- `90s-nostalgia-hub-1234567890.html`
- `retro-gaming-blog-1234567890.html`
- `personal-homepage-1234567890.html`

## Keyboard Shortcuts

### Inline Editing
- `Enter` - Save changes
- `Escape` - Cancel editing
- `Click away` - Save changes

## Validation

### Project Name Rules
- Can contain letters, numbers, spaces
- Special characters allowed
- Sanitized for filenames
- No length limit (reasonable)

### Sanitization
- Spaces → hyphens
- Special chars → hyphens
- Uppercase → lowercase
- Multiple hyphens → single hyphen

## Edge Cases

### Empty Name
- Not allowed
- Keeps previous name
- Shows validation message

### Very Long Names
- Displayed with ellipsis
- Full name in tooltip
- Truncated in UI
- Full name in downloads

### Special Characters
- Allowed in display
- Sanitized for downloads
- Preserved in localStorage
- No data loss

## Future Enhancements

- [ ] Project description
- [ ] Project tags
- [ ] Project categories
- [ ] Project templates
- [ ] Project sharing
- [ ] Project history
- [ ] Project search
- [ ] Project favorites

## Tips

1. **Choose descriptive names** - Makes finding projects easier
2. **Use consistent naming** - Helps with organization
3. **Rename anytime** - No restrictions on changes
4. **Check downloads** - Verify filename before saving
5. **Use clear names** - Avoid generic names like "test"

## Summary

The project naming feature provides:
- ✅ Initial naming on template selection
- ✅ Display in toolbar and explorer
- ✅ Easy renaming (click or double-click)
- ✅ Sanitized filenames for downloads
- ✅ LocalStorage persistence
- ✅ Professional user experience

Makes project management easier and more organized!

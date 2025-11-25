# Multi-File Editor with VS Code-like Interface

## Overview
A professional code editor with file explorer, supporting multiple HTML, CSS, and JavaScript files in a single project.

## Features

### 1. File Explorer (Left Sidebar)
- **VS Code-style sidebar** with file list
- **File icons** based on type:
  - 📄 HTML files (.html)
  - 🎨 CSS files (.css)
  - ⚡ JavaScript files (.js)
  - 📝 Other files
- **Active file highlighting**
- **Click to switch** between files

### 2. Multi-File Support
- **HTML files** - Structure and content
- **CSS files** - Styling and animations
- **JavaScript files** - Interactivity and effects
- **Unlimited files** - Add as many as needed

### 3. File Operations

#### Create New File
- Click "➕ New File" button
- Enter filename (e.g., about.html, theme.css, app.js)
- File appears in explorer
- Automatically selected for editing

#### Rename File
- Right-click on file in explorer
- Choose "1. Rename"
- Enter new filename
- Updates throughout project

#### Delete File
- Right-click on file in explorer
- Choose "2. Delete"
- Confirms before deletion
- Cannot delete last file

### 4. Live Preview Integration
- **Automatic injection** of CSS and JS
- **Real-time updates** as you type
- **Linked files** work seamlessly
- **No manual linking** required

## Layout

```
┌────────────────────────────────────────────────────┐
│  💻 Code Editor  [+New] [Download] [Publish]       │
├──────┬──────────────────────┬──────────────────────┤
│ 📁   │  Code Editor         │  Live Preview        │
│FILES │                      │                      │
│      │  <html>              │  [Rendered Output]   │
│📄 in │  <head>              │                      │
│🎨 st │  ...                 │                      │
│⚡ sc │                      │                      │
└──────┴──────────────────────┴──────────────────────┘
```

## Starter Templates

Each template now includes multiple files:

### Blank Page
- `index.html` - Basic HTML structure
- `style.css` - Simple styling
- `script.js` - JavaScript placeholder

### Cyber Theme
- `index.html` - Cyber-themed content
- `style.css` - Matrix green styling with animations
- `script.js` - Glitch effects

### Glitter Theme
- `index.html` - Sparkly content
- `style.css` - Pink gradients and rainbow animations
- `script.js` - Floating sparkle effects

## How It Works

### File Linking
When you create files like:
```html
<!-- index.html -->
<link rel="stylesheet" href="style.css">
<script src="script.js"></script>
```

The preview automatically:
1. Finds `style.css` in your files
2. Injects its content as `<style>` tag
3. Finds `script.js` in your files
4. Injects its content as `<script>` tag

### Preview Generation
```javascript
// Pseudo-code
function getPreviewHTML() {
  let html = indexFile.content
  
  // Replace CSS links with inline styles
  cssFiles.forEach(css => {
    html = html.replace(
      `<link rel="stylesheet" href="${css.name}">`,
      `<style>${css.content}</style>`
    )
  })
  
  // Replace JS links with inline scripts
  jsFiles.forEach(js => {
    html = html.replace(
      `<script src="${js.name}"></script>`,
      `<script>${js.content}</script>`
    )
  })
  
  return html
}
```

## User Workflow

### 1. Choose Template
Select a starter template with pre-configured files

### 2. Edit Files
- Click file in explorer to open
- Edit in code panel
- See changes in preview

### 3. Add More Files
- Click "➕ New File"
- Name it (e.g., `about.html`, `animations.css`)
- Start coding

### 4. Manage Files
- Right-click to rename or delete
- Switch between files easily
- All files saved in project

### 5. Download/Publish
- Download creates single HTML file with embedded CSS/JS
- Publish uploads combined file to server

## Technical Details

### State Management
```typescript
interface FileNode {
  id: string          // Unique identifier
  name: string        // Display name
  type: 'file'        // File type
  content?: string    // File content
}

const [files, setFiles] = useState<FileNode[]>([])
const [selectedFile, setSelectedFile] = useState<string>('index.html')
```

### File Operations
- **Add**: Append to files array
- **Update**: Map and replace content
- **Delete**: Filter out file
- **Rename**: Map and update id/name

### Preview Updates
- Preview regenerates on any file change
- Uses `key` prop to force iframe reload
- Combines all files into single HTML

## Keyboard Shortcuts (Future)
- `Ctrl+N` - New file
- `Ctrl+S` - Save/Download
- `Ctrl+W` - Close file
- `Ctrl+Tab` - Switch files

## Benefits

1. **Professional Workflow** - Like VS Code
2. **Organized Code** - Separate HTML, CSS, JS
3. **Easy Navigation** - File explorer sidebar
4. **Live Preview** - See all changes instantly
5. **Multiple Files** - No limits on file count
6. **File Management** - Create, rename, delete
7. **Clean Structure** - Proper separation of concerns

## Responsive Design

### Desktop (>1200px)
- File explorer: 200px wide
- Code editor: Flexible
- Preview: Flexible
- Side-by-side layout

### Tablet (1024px - 1200px)
- File explorer: 180px wide
- Stacked code and preview

### Mobile (<1024px)
- File explorer: Horizontal tabs at top
- Code editor: Full width
- Preview: Below editor

## Future Enhancements

- [ ] Folder support
- [ ] Drag-and-drop files
- [ ] File search
- [ ] Syntax highlighting
- [ ] Auto-complete
- [ ] Multiple tabs
- [ ] Split view
- [ ] Git integration
- [ ] File upload
- [ ] Export as ZIP

## Example Project Structure

```
My Project/
├── index.html      (Main page)
├── about.html      (About page)
├── style.css       (Main styles)
├── theme.css       (Theme styles)
├── script.js       (Main JavaScript)
└── animations.js   (Animation effects)
```

## Summary

The multi-file editor provides a professional development environment with:
- VS Code-like file explorer
- Support for HTML, CSS, and JavaScript
- File management (create, rename, delete)
- Live preview with automatic file injection
- Clean, organized project structure

Perfect for building complex retro websites with proper code organization!

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CodeEditor from '../components/CodeEditor'
import ProfileMenu from '../components/ProfileMenu'
import AIAssistant from '../components/AIAssistant'
import { InputModal, ConfirmModal, AlertModal, FileActionsModal } from '../components/Modal'
import './BuildPage.css'

const CITIES = [
  { id: 'Area51', name: 'Area 51', icon: '👽', theme: 'Science fiction and conspiracy theories' },
  { id: 'Hollywood', name: 'Hollywood', icon: '🎬', theme: 'Film, TV, and entertainment' },
  { id: 'SiliconValley', name: 'Silicon Valley', icon: '💻', theme: 'Computing and technology' },
  { id: 'Tokyo', name: 'Tokyo', icon: '🗾', theme: 'Anime and Asian culture' },
  { id: 'Coliseum', name: 'Coliseum', icon: '⚽', theme: 'Sports' },
  { id: 'TimeSquare', name: 'Time Square', icon: '🎮', theme: 'Gaming' },
  { id: 'RodeoDrive', name: 'Rodeo Drive', icon: '🛍️', theme: 'Shopping' },
  { id: 'WallStreet', name: 'Wall Street', icon: '💰', theme: 'Business' },
  { id: 'SunsetStrip', name: 'Sunset Strip', icon: '🎸', theme: 'Music and nightlife' },
  { id: 'WestHollywood', name: 'West Hollywood', icon: '🏳️‍🌈', theme: 'LGBTQ+ community' },
  { id: 'Paris', name: 'Paris', icon: '🎨', theme: 'Arts' },
  { id: 'CapitolHill', name: 'Capitol Hill', icon: '🏛️', theme: 'Politics' }
]

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileNode[]
  isOpen?: boolean
}

interface Folder {
  id: string
  name: string
  files: FileNode[]
  isOpen: boolean
}

const STARTER_TEMPLATES = [
  {
    id: 'blank',
    name: 'Blank Page',
    emoji: '📄',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My Awesome Page</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Welcome to My Page!</h1>
  <p>Start editing to create your retro masterpiece!</p>
  <script src="script.js"></script>
</body>
</html>`,
    files: [
      {
        id: 'index.html',
        name: 'index.html',
        type: 'file' as const,
        content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My Awesome Page</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Welcome to My Page!</h1>
  <p>Start editing to create your retro masterpiece!</p>
  <script src="script.js"></script>
</body>
</html>`
      },
      {
        id: 'style.css',
        name: 'style.css',
        type: 'file' as const,
        content: `body {
  font-family: "Comic Sans MS", cursive;
  background: #000;
  color: #fff;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #00ff00;
  text-shadow: 2px 2px #ff00ff;
}`
      },
      {
        id: 'script.js',
        name: 'script.js',
        type: 'file' as const,
        content: `// Add your JavaScript here
console.log('Welcome to my page!');`
      }
    ]
  },
  {
    id: 'cyber',
    name: 'Cyber Theme',
    emoji: '🤖',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Cyber Page</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>🤖 CYBER ZONE 🤖</h1>
  <p class="blink">⚡ UNDER CONSTRUCTION ⚡</p>
  <p>Welcome to the matrix...</p>
  <script src="script.js"></script>
</body>
</html>`,
    files: [
      {
        id: 'index.html',
        name: 'index.html',
        type: 'file' as const,
        content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Cyber Page</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>🤖 CYBER ZONE 🤖</h1>
  <p class="blink">⚡ UNDER CONSTRUCTION ⚡</p>
  <p>Welcome to the matrix...</p>
  <script src="script.js"></script>
</body>
</html>`
      },
      {
        id: 'style.css',
        name: 'style.css',
        type: 'file' as const,
        content: `@keyframes blink { 
  0%, 50%, 100% { opacity: 1; } 
  25%, 75% { opacity: 0; } 
}

body {
  background: linear-gradient(45deg, #000 25%, #001a00 25%, #001a00 50%, #000 50%, #000 75%, #001a00 75%);
  background-size: 20px 20px;
  font-family: "Courier New", monospace;
  color: #00ff00;
  padding: 20px;
  text-align: center;
}

h1 { 
  color: #00ffff; 
  text-shadow: 0 0 10px #00ffff; 
  font-size: 48px; 
}

.blink { 
  animation: blink 1s infinite; 
}`
      },
      {
        id: 'script.js',
        name: 'script.js',
        type: 'file' as const,
        content: `// Cyber zone effects
console.log('Entering the matrix...');

// Add glitch effect
setInterval(() => {
  document.body.style.transform = 'translate(' + (Math.random() * 2 - 1) + 'px, ' + (Math.random() * 2 - 1) + 'px)';
  setTimeout(() => {
    document.body.style.transform = '';
  }, 50);
}, 3000);`
      }
    ]
  },
  {
    id: 'glitter',
    name: 'Glitter Theme',
    emoji: '✨',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Glitter Page</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>✨ Sparkle Palace ✨</h1>
  <marquee>💎 Welcome to my glittery world! 💎</marquee>
  <p>Everything is better with sparkles!</p>
  <script src="script.js"></script>
</body>
</html>`,
    files: [
      {
        id: 'index.html',
        name: 'index.html',
        type: 'file' as const,
        content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Glitter Page</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>✨ Sparkle Palace ✨</h1>
  <marquee>💎 Welcome to my glittery world! 💎</marquee>
  <p>Everything is better with sparkles!</p>
  <script src="script.js"></script>
</body>
</html>`
      },
      {
        id: 'style.css',
        name: 'style.css',
        type: 'file' as const,
        content: `@keyframes rainbow { 
  0% { color: #ff0000; } 
  50% { color: #ff00ff; } 
  100% { color: #ff0000; } 
}

body {
  background: radial-gradient(circle, #ffe6f0 0%, #ffb6d9 50%, #ff69b4 100%);
  font-family: "Comic Sans MS", cursive;
  color: #ff1493;
  padding: 20px;
  text-align: center;
}

h1 { 
  animation: rainbow 3s infinite; 
  font-size: 48px; 
  text-shadow: 2px 2px #ffd700; 
}

marquee {
  font-size: 24px;
  font-weight: bold;
}`
      },
      {
        id: 'script.js',
        name: 'script.js',
        type: 'file' as const,
        content: `// Sparkle effects
console.log('✨ Sparkles activated! ✨');

// Create floating sparkles
function createSparkle() {
  const sparkle = document.createElement('div');
  sparkle.textContent = '✨';
  sparkle.style.position = 'fixed';
  sparkle.style.left = Math.random() * window.innerWidth + 'px';
  sparkle.style.top = '-50px';
  sparkle.style.fontSize = '24px';
  sparkle.style.pointerEvents = 'none';
  document.body.appendChild(sparkle);
  
  let pos = -50;
  const interval = setInterval(() => {
    pos += 2;
    sparkle.style.top = pos + 'px';
    if (pos > window.innerHeight) {
      clearInterval(interval);
      sparkle.remove();
    }
  }, 20);
}

setInterval(createSparkle, 500);`
      }
    ]
  }
]

export default function BuildPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [files, setFiles] = useState<FileNode[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedFile, setSelectedFile] = useState<string>('index.html')
  const [showTemplates, setShowTemplates] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const [projectName, setProjectName] = useState('My GeoCities Site')
  const [isEditingName, setIsEditingName] = useState(false)

  // Modal states
  const [showProjectNameModal, setShowProjectNameModal] = useState(false)
  const [showNewFileModal, setShowNewFileModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [showCitySelectModal, setShowCitySelectModal] = useState(false)
  const [showFileActionsModal, setShowFileActionsModal] = useState(false)
  const [selectedFileForAction, setSelectedFileForAction] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState('Area51')
  const [publishedUrl, setPublishedUrl] = useState('')

  // Auto-save to localStorage
  useEffect(() => {
    if (files.length > 0) {
      localStorage.setItem('editor-files', JSON.stringify(files))
      localStorage.setItem('editor-folders', JSON.stringify(folders))
      localStorage.setItem('editor-project-name', projectName)
    }
  }, [files, folders, projectName])

  // Load from localStorage on mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('editor-files')
    const savedFolders = localStorage.getItem('editor-folders')
    const savedProjectName = localStorage.getItem('editor-project-name')
    
    if (savedFiles && !showTemplates) {
      setFiles(JSON.parse(savedFiles))
    }
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders))
    }
    if (savedProjectName) {
      setProjectName(savedProjectName)
    }
  }, [])

  const handleSelectTemplate = (template: typeof STARTER_TEMPLATES[0]) => {
    setFiles(template.files)
    setSelectedFile('index.html')
    setShowTemplates(false)
    setShowProjectNameModal(true)
  }

  const handleSetProjectName = (name: string) => {
    setProjectName(name)
  }

  const handleRenameProject = () => {
    setShowProjectNameModal(true)
    setIsEditingName(false)
  }

  const getCurrentFile = () => {
    return files.find(f => f.id === selectedFile)
  }

  const updateFileContent = (content: string) => {
    setFiles(files.map(f => 
      f.id === selectedFile ? { ...f, content } : f
    ))
  }

  const addNewFile = () => {
    setShowNewFileModal(true)
  }

  const handleCreateFile = (fileName: string) => {
    if (files.find(f => f.id === fileName)) {
      // Show error - file exists
      return
    }
    
    const newFile: FileNode = {
      id: fileName,
      name: fileName,
      type: 'file',
      content: getDefaultContent(fileName)
    }
    setFiles([...files, newFile])
    setSelectedFile(fileName)
  }

  const addNewFolder = () => {
    // Future implementation
  }

  const handleDeleteFile = () => {
    if (files.length === 1) {
      return
    }
    
    setFiles(files.filter(f => f.id !== selectedFileForAction))
    if (selectedFile === selectedFileForAction) {
      setSelectedFile(files[0].id)
    }
  }

  const handleRenameFile = (newName: string) => {
    if (files.find(f => f.id === newName)) {
      return
    }
    
    setFiles(files.map(f => 
      f.id === selectedFileForAction ? { ...f, id: newName, name: newName } : f
    ))
    if (selectedFile === selectedFileForAction) {
      setSelectedFile(newName)
    }
  }

  const handleDuplicateFile = () => {
    const file = files.find(f => f.id === selectedFileForAction)
    if (!file) return
    
    const baseName = file.name.replace(/\.[^/.]+$/, '')
    const extension = file.name.match(/\.[^/.]+$/)?.[0] || ''
    let copyNumber = 1
    let newName = `${baseName}-copy${extension}`
    
    while (files.find(f => f.id === newName)) {
      copyNumber++
      newName = `${baseName}-copy${copyNumber}${extension}`
    }
    
    const newFile: FileNode = {
      id: newName,
      name: newName,
      type: 'file',
      content: file.content
    }
    setFiles([...files, newFile])
    setSelectedFile(newName)
  }

  const openFileActions = (fileId: string) => {
    setSelectedFileForAction(fileId)
    setShowFileActionsModal(true)
  }

  const getDefaultContent = (fileName: string): string => {
    if (fileName.endsWith('.html')) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Hello World!</h1>
  <script src="script.js"></script>
</body>
</html>`
    }
    if (fileName.endsWith('.css')) {
      return `/* Styles for ${fileName} */

body {
  margin: 0;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
}`
    }
    if (fileName.endsWith('.js')) {
      return `// JavaScript for ${fileName}

console.log('Script loaded!');

// Your code here`
    }
    return ''
  }

  const getLanguage = (fileName: string): string => {
    if (fileName.endsWith('.html')) return 'html'
    if (fileName.endsWith('.css')) return 'css'
    if (fileName.endsWith('.js')) return 'javascript'
    if (fileName.endsWith('.json')) return 'json'
    return 'plaintext'
  }

  const getPreviewHTML = () => {
    const indexFile = files.find(f => f.name === 'index.html')
    if (!indexFile) return '<h1>No index.html found</h1>'
    
    let html = indexFile.content || ''
    
    // Inject CSS
    const cssFiles = files.filter(f => f.name.endsWith('.css'))
    cssFiles.forEach(cssFile => {
      const cssLink = `<link rel="stylesheet" href="${cssFile.name}">`
      const styleTag = `<style>${cssFile.content}</style>`
      html = html.replace(cssLink, styleTag)
    })
    
    // Inject JS
    const jsFiles = files.filter(f => f.name.endsWith('.js'))
    jsFiles.forEach(jsFile => {
      const jsLink = `<script src="${jsFile.name}"></script>`
      const scriptTag = `<script>${jsFile.content}</script>`
      html = html.replace(jsLink, scriptTag)
    })
    
    return html
  }



  const handlePublishClick = () => {
    setShowCitySelectModal(true)
  }

  const handlePublish = async (city: string) => {
    try {
      const html = getPreviewHTML()
      const token = localStorage.getItem('token')
      
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch('https://geocities-reborn-production.up.railway.app/api/publish', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          html, 
          theme: 'custom',
          title: projectName,
          city 
        }),
      })

      const data = await response.json()
      setPublishedUrl(`https://geocities-reborn-production.up.railway.app/site/${data.siteId}`)
      setShowPublishModal(true)
    } catch (err) {
      alert('Failed to publish site. Please try again.')
    }
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.html')) return '📄'
    if (fileName.endsWith('.css')) return '🎨'
    if (fileName.endsWith('.js')) return '⚡'
    if (fileName.endsWith('.json')) return '📋'
    return '📝'
  }

  const downloadAllFiles = () => {
    const html = getPreviewHTML()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    // Use project name for filename, sanitize it
    const sanitizedName = projectName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    a.download = `${sanitizedName}-${Date.now()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClearProject = () => {
    localStorage.removeItem('editor-files')
    localStorage.removeItem('editor-folders')
    localStorage.removeItem('editor-project-name')
    setShowTemplates(true)
    setFiles([])
    setFolders([])
    setProjectName('My GeoCities Site')
  }

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="build-page">
      <div className="build-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <h1>🖊️ BUILD YOUR PAGE</h1>
        </div>
        {isAuthenticated && <ProfileMenu />}
      </div>

      <div className="build-content">
        {showTemplates ? (
          <div className="template-selector">
            <h2>Choose a starting point:</h2>
            <div className="template-grid">
              {STARTER_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className="template-card"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="template-emoji">{template.emoji}</div>
                  <h3>{template.name}</h3>
                  <p>Click to start editing</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="editor-section">
            <div className="editor-toolbar">
              <div className="toolbar-left">
                <div className="project-name-container">
                  {isEditingName ? (
                    <input
                      type="text"
                      className="project-name-input"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      onBlur={() => setIsEditingName(false)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setIsEditingName(false)
                        if (e.key === 'Escape') {
                          setIsEditingName(false)
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <h3 
                      className="project-name" 
                      onClick={() => setIsEditingName(true)}
                      onDoubleClick={handleRenameProject}
                      title="Click to edit project name"
                    >
                      📁 {projectName}
                    </h3>
                  )}
                </div>
                <span className="file-count">{files.length} files</span>
              </div>
              <div className="toolbar-right">
                <button className="tool-btn" onClick={addNewFile} title="New File">
                  ➕ File
                </button>
                <button className="tool-btn" onClick={addNewFolder} title="New Folder">
                  📁 Folder
                </button>
                <button className="tool-btn" onClick={() => setShowPreview(!showPreview)} title="Toggle Preview">
                  {showPreview ? '👁️ Hide' : '👁️ Show'} Preview
                </button>
                <button className="tool-btn" onClick={downloadAllFiles} title="Download">
                  💾 Download
                </button>
                <button className="tool-btn" onClick={handlePublishClick} title="Publish">
                  🌐 Publish
                </button>
                <button className="tool-btn danger" onClick={() => setShowClearModal(true)} title="Clear Project">
                  🗑️ Clear
                </button>
              </div>
            </div>

            <div className="editor-container">
              <div className="file-explorer">
                <div className="explorer-header">
                  <span>📁 EXPLORER</span>
                  <button className="icon-btn" onClick={addNewFile} title="New File">➕</button>
                </div>
                <div className="project-title" title="Double-click to rename" onDoubleClick={handleRenameProject}>
                  <span className="project-icon">📂</span>
                  <span className="project-text">{projectName.toUpperCase()}</span>
                </div>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="file-list">
                  {filteredFiles.length === 0 && searchQuery && (
                    <div className="no-results">No files found</div>
                  )}
                  {filteredFiles.map(file => (
                    <div
                      key={file.id}
                      className={`file-item ${selectedFile === file.id ? 'active' : ''}`}
                      onClick={() => setSelectedFile(file.id)}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        openFileActions(file.id)
                      }}
                      title={`Right-click for options\n${file.name}`}
                    >
                      <span className="file-icon">{getFileIcon(file.name)}</span>
                      <span className="file-name">{file.name}</span>
                      {selectedFile === file.id && <span className="active-indicator">●</span>}
                    </div>
                  ))}
                </div>
                <div className="explorer-footer">
                  <small>{files.length} files total</small>
                </div>
              </div>

              <div className="code-panel">
                <div className="panel-header">
                  <span className="file-icon">{getFileIcon(getCurrentFile()?.name || '')}</span>
                  <span>{getCurrentFile()?.name || 'No file selected'}</span>
                  <span className="language-badge">{getLanguage(getCurrentFile()?.name || '')}</span>
                </div>
                <div className="editor-wrapper">
                  {getCurrentFile() ? (
                    <CodeEditor
                      value={getCurrentFile()?.content || ''}
                      onChange={updateFileContent}
                      language={getLanguage(getCurrentFile()?.name || '')}
                    />
                  ) : (
                    <div className="no-file-selected">
                      <h3>No file selected</h3>
                      <p>Select a file from the explorer or create a new one</p>
                    </div>
                  )}
                </div>
              </div>

              {showPreview && (
                <div className="preview-panel">
                  <div className="panel-header">
                    <span>🌐 Live Preview</span>
                    <button className="icon-btn" onClick={() => setShowPreview(false)}>✕</button>
                  </div>
                  <iframe
                    key={files.map(f => f.content).join('')}
                    srcDoc={getPreviewHTML()}
                    title="Live Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <InputModal
        isOpen={showProjectNameModal}
        onClose={() => setShowProjectNameModal(false)}
        onSubmit={handleSetProjectName}
        title="Project Name"
        label="Enter your project name:"
        defaultValue={projectName}
        placeholder="My GeoCities Site"
      />

      <InputModal
        isOpen={showNewFileModal}
        onClose={() => setShowNewFileModal(false)}
        onSubmit={handleCreateFile}
        title="New File"
        label="Enter file name:"
        placeholder="e.g., about.html, styles.css, app.js"
      />

      <InputModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        onSubmit={handleRenameFile}
        title="Rename File"
        label="Enter new file name:"
        defaultValue={selectedFileForAction}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteFile}
        title="Delete File"
        message={`Are you sure you want to delete "${selectedFileForAction}"? This action cannot be undone.`}
        confirmText="Delete"
        danger={true}
      />

      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearProject}
        title="Clear Project"
        message={`Are you sure you want to clear "${projectName}" and start fresh? All files will be deleted.`}
        confirmText="Clear All"
        danger={true}
      />

      <AlertModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title="Published Successfully!"
        message={`Your page is now live at: ${publishedUrl}`}
        type="success"
      />

      {/* City Selection Modal */}
      {showCitySelectModal && (
        <div className="modal-overlay" onClick={() => setShowCitySelectModal(false)}>
          <div className="modal-content city-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🏙️ Choose Your Neighborhood</h2>
              <button className="close-btn" onClick={() => setShowCitySelectModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="city-description">Select which GeoCities neighborhood your site belongs to:</p>
              <div className="cities-grid-modal">
                {CITIES.map((city) => (
                  <button
                    key={city.id}
                    className={`city-card-modal ${selectedCity === city.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCity(city.id)}
                  >
                    <div className="city-icon-modal">{city.icon}</div>
                    <div className="city-name-modal">{city.name}</div>
                    <div className="city-theme-modal">{city.theme}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={() => setShowCitySelectModal(false)}>
                Cancel
              </button>
              <button 
                className="modal-btn confirm" 
                onClick={() => {
                  setShowCitySelectModal(false)
                  handlePublish(selectedCity)
                }}
              >
                🌐 Publish to {CITIES.find(c => c.id === selectedCity)?.name}
              </button>
            </div>
          </div>
        </div>
      )}

      <FileActionsModal
        isOpen={showFileActionsModal}
        onClose={() => setShowFileActionsModal(false)}
        fileName={selectedFileForAction}
        onRename={() => {
          setShowFileActionsModal(false)
          setShowRenameModal(true)
        }}
        onDelete={() => {
          setShowFileActionsModal(false)
          if (files.length > 1) {
            setShowDeleteModal(true)
          }
        }}
        onDuplicate={() => {
          handleDuplicateFile()
        }}
      />

      {/* AI Assistant */}
      {!showTemplates && getCurrentFile() && (
        <AIAssistant
          currentCode={getCurrentFile()?.content || ''}
          currentLanguage={getLanguage(getCurrentFile()?.name || '')}
          onCodeUpdate={updateFileContent}
        />
      )}
    </div>
  )
}

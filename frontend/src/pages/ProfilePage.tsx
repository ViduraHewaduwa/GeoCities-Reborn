import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProfileMenu from '../components/ProfileMenu'
import CodeEditor from '../components/CodeEditor'
import './ProfilePage.css'

const CITIES = [
  { id: 'Area51', name: 'Area 51', icon: '👽' },
  { id: 'Hollywood', name: 'Hollywood', icon: '🎬' },
  { id: 'SiliconValley', name: 'Silicon Valley', icon: '💻' },
  { id: 'Tokyo', name: 'Tokyo', icon: '🗾' },
  { id: 'Coliseum', name: 'Coliseum', icon: '⚽' },
  { id: 'TimeSquare', name: 'Time Square', icon: '🎮' },
  { id: 'RodeoDrive', name: 'Rodeo Drive', icon: '🛍️' },
  { id: 'WallStreet', name: 'Wall Street', icon: '💰' },
  { id: 'SunsetStrip', name: 'Sunset Strip', icon: '🎸' },
  { id: 'WestHollywood', name: 'West Hollywood', icon: '🏳️‍🌈' },
  { id: 'Paris', name: 'Paris', icon: '🎨' },
  { id: 'CapitolHill', name: 'Capitol Hill', icon: '🏛️' }
]

interface Site {
  id: string
  title: string
  theme: string
  city: string
  createdAt: string
  views: number
}

interface FileNode {
  id: string
  name: string
  type: 'file'
  content?: string
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [files, setFiles] = useState<FileNode[]>([])
  const [selectedFile, setSelectedFile] = useState<string>('index.html')
  const [showPreview, setShowPreview] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchSites()
  }, [isAuthenticated, navigate])

  const fetchSites = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://geocities-reborn-production.up.railway.app/api/user/sites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      setSites(data.sites || [])
    } catch (error) {
      console.error('Failed to fetch sites:', error)
    } finally {
      setLoading(false)
    }
  }

  const parseHTMLToFiles = (html: string): FileNode[] => {
    const files: FileNode[] = []
    
    // Extract CSS
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
    let styleMatch
    let styleIndex = 1
    while ((styleMatch = styleRegex.exec(html)) !== null) {
      files.push({
        id: `style${styleIndex > 1 ? styleIndex : ''}.css`,
        name: `style${styleIndex > 1 ? styleIndex : ''}.css`,
        type: 'file',
        content: styleMatch[1].trim()
      })
      styleIndex++
    }
    
    // Extract JS
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi
    let scriptMatch
    let scriptIndex = 1
    while ((scriptMatch = scriptRegex.exec(html)) !== null) {
      if (scriptMatch[1].trim()) {
        files.push({
          id: `script${scriptIndex > 1 ? scriptIndex : ''}.js`,
          name: `script${scriptIndex > 1 ? scriptIndex : ''}.js`,
          type: 'file',
          content: scriptMatch[1].trim()
        })
        scriptIndex++
      }
    }
    
    // Create HTML file with links
    let cleanHTML = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '<link rel="stylesheet" href="style.css">')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '<script src="script.js"></script>')
    
    files.unshift({
      id: 'index.html',
      name: 'index.html',
      type: 'file',
      content: cleanHTML
    })
    
    return files
  }

  const handleEditSite = async (site: Site) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://geocities-reborn-production.up.railway.app/api/sites/${site.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      const parsedFiles = parseHTMLToFiles(data.html || '')
      setFiles(parsedFiles)
      setSelectedFile('index.html')
      setEditingSite(site)
      setShowPreview(true)
    } catch (error) {
      alert('Failed to load site for editing')
    }
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

  const handleSaveEdit = async () => {
    if (!editingSite) return

    setIsSaving(true)
    try {
      const html = getPreviewHTML()
      const token = localStorage.getItem('token')
      await fetch(`https://geocities-reborn-production.up.railway.app/api/sites/${editingSite.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ html })
      })

      alert('Site updated successfully!')
      setEditingSite(null)
      setFiles([])
      fetchSites()
    } catch (error) {
      alert('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const getCurrentFile = () => {
    return files.find(f => f.id === selectedFile)
  }

  const updateFileContent = (content: string) => {
    setFiles(files.map(f => 
      f.id === selectedFile ? { ...f, content } : f
    ))
  }

  const getLanguage = (fileName: string): string => {
    if (fileName.endsWith('.html')) return 'html'
    if (fileName.endsWith('.css')) return 'css'
    if (fileName.endsWith('.js')) return 'javascript'
    return 'plaintext'
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.html')) return '📄'
    if (fileName.endsWith('.css')) return '🎨'
    if (fileName.endsWith('.js')) return '⚡'
    return '📝'
  }

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteSite = async (siteId: string) => {
    if (!confirm('Are you sure you want to delete this site?')) return

    try {
      const token = localStorage.getItem('token')
      await fetch(`https://geocities-reborn-production.up.railway.app/api/sites/${siteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      setSites(sites.filter(s => s.id !== siteId))
    } catch (error) {
      alert('Failed to delete site')
    }
  }

  const copyToClipboard = (siteId: string) => {
    const url = `https://geocities-reborn-production.up.railway.app/site/${siteId}`
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  }

  const getCityInfo = (cityId: string) => {
    return CITIES.find(c => c.id === cityId) || { id: 'Area51', name: 'Area 51', icon: '👽' }
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <h1>👤 MY PROFILE</h1>
        </div>
        <ProfileMenu />
      </div>

      {editingSite ? (
        <div className="editor-section">
          <div className="editor-toolbar">
            <div className="toolbar-left">
              <h3 className="project-name">✏️ Editing: {editingSite.title}</h3>
              <span className="file-count">{files.length} files</span>
            </div>
            <div className="toolbar-right">
              <button className="tool-btn" onClick={() => setShowPreview(!showPreview)} title="Toggle Preview">
                {showPreview ? '👁️ Hide' : '👁️ Show'} Preview
              </button>
              <button className="tool-btn" onClick={handleSaveEdit} disabled={isSaving} title="Save">
                {isSaving ? '💾 Saving...' : '💾 Save Changes'}
              </button>
              <button className="tool-btn danger" onClick={() => setEditingSite(null)} title="Cancel">
                ✕ Cancel
              </button>
            </div>
          </div>

          <div className="editor-container">
            <div className="file-explorer">
              <div className="explorer-header">
                <span>📁 FILES</span>
              </div>
              <div className="project-title">
                <span className="project-icon">📂</span>
                <span className="project-text">{editingSite.title.toUpperCase()}</span>
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
                    title={file.name}
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
                    <p>Select a file from the explorer</p>
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
      ) : (
        <div className="profile-content">
        <div className="profile-info">
          <div className="user-card">
            <div className="user-avatar">👤</div>
            <h2>{user?.username}</h2>
            <p className="user-email">{user?.email}</p>
            <div className="user-stats">
              <div className="stat">
                <span className="stat-value">{sites.length}</span>
                <span className="stat-label">Sites Published</span>
              </div>
              <div className="stat">
                <span className="stat-value">{sites.reduce((acc, s) => acc + s.views, 0)}</span>
                <span className="stat-label">Total Views</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sites-section">
          <div className="section-header">
            <h2>🌐 My Published Sites</h2>
            <button className="create-btn" onClick={() => navigate('/build')}>
              ➕ Create New Site
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading your sites...</div>
          ) : sites.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No sites yet!</h3>
              <p>Start building your first retro website</p>
              <button className="create-btn" onClick={() => navigate('/build')}>
                🚀 Create Your First Site
              </button>
            </div>
          ) : (
            <div className="sites-grid">
              {sites.map((site) => {
                const cityInfo = getCityInfo(site.city)
                return (
                  <div key={site.id} className="site-card">
                    <div className="site-city-badge">
                      {cityInfo.icon} {cityInfo.name}
                    </div>
                    <div className="site-header">
                      <h3>{site.title}</h3>
                    </div>
                    <div className="site-info">
                      <span className="site-date">
                        📅 {new Date(site.createdAt).toLocaleDateString()}
                      </span>
                      <span className="site-views">
                        👁️ {site.views} views
                      </span>
                    </div>
                    <div className="site-actions">
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEditSite(site)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="action-btn view"
                        onClick={() => window.open(`https://geocities-reborn-production.up.railway.app/site/${site.id}`, '_blank')}
                      >
                        👁️ View
                      </button>
                      <button 
                        className="action-btn copy"
                        onClick={() => copyToClipboard(site.id)}
                      >
                        📋 Copy Link
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteSite(site.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  )
}

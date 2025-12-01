import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CodeEditor from '../components/CodeEditor'
import WYSIWYGEditor from '../components/WYSIWYGEditor'
import './EditPage.css'

const THEMES = [
  'random', 'neon', 'pastel', 'dark', 'retro', 'minimal',
  'cyberpunk', 'vaporwave', 'grunge', 'y2k'
]

export default function EditPage() {
  const navigate = useNavigate()
  const { siteId } = useParams()
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [html, setHtml] = useState('')
  const [title, setTitle] = useState('')
  const [theme, setTheme] = useState('random')
  const [editorMode, setEditorMode] = useState<'wysiwyg' | 'code'>('wysiwyg')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchSite()
  }, [isAuthenticated, navigate, siteId])

  const fetchSite = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://geocities-reborn-production.up.railway.app/api/sites/${siteId}/edit`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch site')
      }

      const data = await response.json()
      setHtml(data.html)
      setTitle(data.title)
      setTheme(data.theme)
    } catch (error) {
      console.error('Failed to fetch site:', error)
      alert('Failed to load site for editing')
      navigate('/profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!html.trim()) {
      alert('HTML content cannot be empty')
      return
    }

    if (!title.trim()) {
      alert('Please enter a title')
      return
    }

    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://geocities-reborn-production.up.railway.app/api/sites/${siteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ html, title, theme })
      })

      if (!response.ok) {
        throw new Error('Failed to save changes')
      }

      alert('Site updated successfully!')
      navigate('/profile')
    } catch (error) {
      console.error('Failed to save site:', error)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="edit-page">
        <div className="loading">Loading site...</div>
      </div>
    )
  }

  return (
    <div className="edit-page">
      <div className="edit-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/profile')}>
            ← Back to Profile
          </button>
          <h1>✏️ EDIT SITE</h1>
        </div>
        <div className="header-actions">
          <button 
            className="preview-btn"
            onClick={() => window.open(`https://geocities-reborn-production.up.railway.app/site/${siteId}`, '_blank')}
          >
            👁️ Preview
          </button>
          <button 
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? '💾 Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      <div className="edit-content">
        <div className="edit-sidebar">
          <div className="form-group">
            <label>Site Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Site"
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label>Theme</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              {THEMES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Editor Mode</label>
            <div className="mode-toggle">
              <button
                className={editorMode === 'wysiwyg' ? 'active' : ''}
                onClick={() => setEditorMode('wysiwyg')}
              >
                📝 Visual
              </button>
              <button
                className={editorMode === 'code' ? 'active' : ''}
                onClick={() => setEditorMode('code')}
              >
                💻 Code
              </button>
            </div>
          </div>
        </div>

        <div className="edit-main">
          {editorMode === 'wysiwyg' ? (
            <WYSIWYGEditor
              content={html}
              onChange={setHtml}
            />
          ) : (
            <CodeEditor
              value={html}
              onChange={setHtml}
              language="html"
            />
          )}
        </div>
      </div>
    </div>
  )
}

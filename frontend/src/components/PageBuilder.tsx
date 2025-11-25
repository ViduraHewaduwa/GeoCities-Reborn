import { useState } from 'react'
import './PageBuilder.css'
import WYSIWYGEditor from './WYSIWYGEditor'

interface PageBuilderProps {
  onClose: () => void
}

const THEMES = [
  { id: 'cyber', name: 'Cyber', emoji: '🤖' },
  { id: 'gamer', name: 'Gamer', emoji: '🎮' },
  { id: 'glitter', name: 'Glitter', emoji: '✨' },
  { id: 'space', name: 'Space', emoji: '🚀' },
]

export default function PageBuilder({ onClose }: PageBuilderProps) {
  const [description, setDescription] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('')
  const [generatedHTML, setGeneratedHTML] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [editMode, setEditMode] = useState<'preview' | 'edit'>('preview')

  const handleGenerate = async () => {
    if (description.length < 10) {
      setError('Please enter at least 10 characters. Example: "My awesome cat fan page with rainbow colors"')
      return
    }

    if (description.length > 500) {
      setError('Description is too long. Please keep it under 500 characters.')
      return
    }

    setError('')
    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, theme: selectedTheme }),
      })

      const data = await response.json()
      setGeneratedHTML(data.html)
    } catch (err) {
      setError('Failed to generate page. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRemix = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, theme: selectedTheme, remix: true }),
      })

      const data = await response.json()
      setGeneratedHTML(data.html)
    } catch (err) {
      setError('Failed to remix page. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([generatedHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `my-geocities-page-${Date.now()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePublish = async () => {
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: generatedHTML, theme: selectedTheme || 'random' }),
      })

      const data = await response.json()
      alert(`Published! Your page is live at: ${window.location.origin}/site/${data.siteId}`)
    } catch (err) {
      setError('Failed to publish page. Please try again.')
    }
  }

  return (
    <div className="page-builder-overlay">
      <div className="page-builder-container">
        <div className="builder-header">
          <h1>🖊️ BUILD A PAGE</h1>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="builder-content">
          {!generatedHTML ? (
            <div className="input-section">
              <h2>Describe your dream webpage!</h2>
              <p className="hint">Tell us what you want - we'll make it retro! (10-500 characters)</p>
              
              <textarea
                className="description-input"
                placeholder="Example: A fan page about my pet hamster with lots of sparkles and rainbow colors..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              />
              
              <div className="char-count">{description.length}/500</div>

              <div className="theme-selector">
                <h3>Pick a vibe (optional):</h3>
                <div className="theme-buttons">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      className={`theme-btn ${selectedTheme === theme.id ? 'selected' : ''}`}
                      onClick={() => setSelectedTheme(selectedTheme === theme.id ? '' : theme.id)}
                    >
                      <span className="theme-emoji">{theme.emoji}</span>
                      <span>{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? '✨ Generating...' : '✨ Generate My Page!'}
              </button>
            </div>
          ) : (
            <div className="preview-section">
              <div className="preview-header">
                <h2>Your Retro Masterpiece!</h2>
                <div className="action-buttons">
                  <button 
                    className={`action-btn ${editMode === 'preview' ? 'active' : ''}`}
                    onClick={() => setEditMode('preview')}
                  >
                    👁️ Preview
                  </button>
                  <button 
                    className={`action-btn ${editMode === 'edit' ? 'active' : ''}`}
                    onClick={() => setEditMode('edit')}
                  >
                    ✏️ Edit
                  </button>
                  <button className="action-btn remix" onClick={handleRemix} disabled={isGenerating}>
                    🔄 Remix
                  </button>
                  <button className="action-btn download" onClick={handleDownload}>
                    💾 Download
                  </button>
                  <button className="action-btn publish" onClick={handlePublish}>
                    🌐 Publish
                  </button>
                  <button className="action-btn new" onClick={() => setGeneratedHTML('')}>
                    ➕ New Page
                  </button>
                </div>
              </div>

              {editMode === 'preview' ? (
                <div className="preview-frame">
                  <iframe
                    srcDoc={generatedHTML}
                    title="Generated Page Preview"
                    sandbox="allow-scripts"
                  />
                </div>
              ) : (
                <div className="edit-frame">
                  <WYSIWYGEditor 
                    content={generatedHTML}
                    onChange={setGeneratedHTML}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

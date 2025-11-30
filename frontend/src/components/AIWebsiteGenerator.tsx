import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AIWebsiteGenerator.css'

interface AIWebsiteGeneratorProps {
  isOpen: boolean
  onClose: () => void
}

export default function AIWebsiteGenerator({ isOpen, onClose }: AIWebsiteGeneratorProps) {
  const navigate = useNavigate()
  const [description, setDescription] = useState('')
  const [theme, setTheme] = useState('default')
  const [loading, setLoading] = useState(false)

  const themes = [
    { id: 'default', name: 'Classic 90s', emoji: '🌈', color: '#ff00ff' },
    { id: 'cyber', name: 'Cyber', emoji: '🤖', color: '#00ff00' },
    { id: 'gamer', name: 'Gamer', emoji: '🎮', color: '#ff0000' },
    { id: 'glitter', name: 'Glitter', emoji: '✨', color: '#ff69b4' },
    { id: 'space', name: 'Space', emoji: '🚀', color: '#4169e1' }
  ]

  const handleGenerate = async () => {
    if (!description.trim()) return

    setLoading(true)
    try {
      const response = await fetch('https://geocities-reborn-production.up.railway.app/api/ai/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, theme })
      })

      const data = await response.json()
      if (data.html) {
        // Store the generated HTML and navigate to build page
        const files = [
          {
            id: 'index.html',
            name: 'index.html',
            type: 'file',
            content: data.html
          }
        ]
        localStorage.setItem('editor-files', JSON.stringify(files))
        localStorage.setItem('editor-project-name', description.substring(0, 50))
        navigate('/build')
      } else if (data.error) {
        alert(`AI Error: ${data.error}`)
      }
    } catch (error) {
      console.error('AI generation error:', error)
      alert('Failed to generate website. Make sure:\n1. Backend server is running\n2. Gemini API key is set in backend/.env\n3. You have internet connection')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="ai-modal-overlay" onClick={onClose}>
      <div className="ai-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ai-modal-header">
          <h2>🤖 AI Website Generator</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="ai-modal-content">
          <div className="ai-section">
            <label className="ai-label">What kind of website do you want?</label>
            <textarea
              className="ai-textarea"
              placeholder="E.g., A fan page about my favorite band, a personal blog about cats, a tribute to 90s cartoons..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="ai-section">
            <label className="ai-label">Choose a theme:</label>
            <div className="theme-grid">
              {themes.map((t) => (
                <button
                  key={t.id}
                  className={`theme-card ${theme === t.id ? 'selected' : ''}`}
                  onClick={() => setTheme(t.id)}
                  style={{ borderColor: theme === t.id ? t.color : '#ccc' }}
                >
                  <div className="theme-emoji">{t.emoji}</div>
                  <div className="theme-name">{t.name}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            className="ai-generate-btn"
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
          >
            {loading ? '⏳ Generating...' : '✨ Generate Website'}
          </button>

          <div className="ai-note">
            💡 Powered by Google Gemini AI - Be creative with your description!
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProfileMenu from '../components/ProfileMenu'
import { useAuth } from '../context/AuthContext'
import './GalleryPage.css'

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

interface Site {
  id: string
  title: string
  theme: string
  city: string
  createdAt: string
  views: number
}

export default function NeighborhoodPage() {
  const navigate = useNavigate()
  const { cityId } = useParams<{ cityId: string }>()
  const { isAuthenticated } = useAuth()
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)

  const cityInfo = CITIES.find(c => c.id === cityId)

  useEffect(() => {
    if (!cityInfo) {
      navigate('/gallery')
      return
    }
    fetchSites()
  }, [cityId])

  const fetchSites = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://geocities-reborn-production.up.railway.app/api/gallery?city=${cityId}`
      )
      const data = await response.json()
      setSites(data.sites || [])
    } catch (error) {
      console.error('Failed to fetch sites:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!cityInfo) {
    return null
  }

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/gallery')}>
            ← Back to Gallery
          </button>
          <h1>{cityInfo.icon} {cityInfo.name}</h1>
        </div>
        {isAuthenticated && <ProfileMenu />}
      </div>

      <div className="neighborhood-info">
        <div className="neighborhood-banner">
          <div className="neighborhood-icon">{cityInfo.icon}</div>
          <div className="neighborhood-details">
            <h2>{cityInfo.name}</h2>
            <p>{cityInfo.theme}</p>
            <div className="neighborhood-stats">
              <span>📊 {sites.length} sites</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sites-section">
        <h2>🌟 Sites in this Neighborhood</h2>
        
        {loading ? (
          <div className="loading">Loading sites...</div>
        ) : sites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No sites yet in this neighborhood!</h3>
            <p>Be the first to publish here</p>
            <button className="create-btn" onClick={() => navigate('/build')}>
              🚀 Create Site
            </button>
          </div>
        ) : (
          <div className="sites-grid">
            {sites.map((site) => (
              <div 
                key={site.id} 
                className="site-card"
                onClick={() => window.open(`https://geocities-reborn-production.up.railway.app/site/${site.id}`, '_blank')}
                style={{ cursor: 'pointer' }}
              >
                <div className="site-city-badge">
                  {cityInfo.icon} {cityInfo.name}
                </div>
                <h3>{site.title}</h3>
                <div className="site-meta">
                  <span className="site-views">👁️ {site.views}</span>
                </div>
                <div className="site-date">
                  📅 {new Date(site.createdAt).toLocaleDateString()}
                </div>
                <button
                  className="visit-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(`https://geocities-reborn-production.up.railway.app/site/${site.id}`, '_blank')
                  }}
                >
                  🌐 Visit Site
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

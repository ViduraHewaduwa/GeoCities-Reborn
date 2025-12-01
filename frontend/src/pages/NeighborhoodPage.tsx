import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProfileMenu from '../components/ProfileMenu'
import { useAuth } from '../context/AuthContext'
import './NeighborhoodPage.css'

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

  const cityInfo = CITIES.find(c => c.id === cityId) || CITIES[0]

  useEffect(() => {
    if (cityId) {
      fetchSites()
    }
  }, [cityId])

  const fetchSites = async () => {
    setLoading(true)
    try {
      const response = await fetch(`https://geocities-reborn-production.up.railway.app/api/gallery?city=${cityId}`)
      const data = await response.json()
      setSites(data.sites || [])
    } catch (error) {
      console.error('Failed to fetch sites:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="neighborhood-page">
      <div className="neighborhood-page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/gallery')}>
            ← Back to Gallery
          </button>
          <div className="city-title">
            <span className="city-icon-large">{cityInfo.icon}</span>
            <div>
              <h1>{cityInfo.name}</h1>
              <p className="city-subtitle">{cityInfo.theme}</p>
            </div>
          </div>
        </div>
        {isAuthenticated && <ProfileMenu />}
      </div>

      <div className="neighborhood-content">
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-icon">🌐</span>
            <span className="stat-value">{sites.length}</span>
            <span className="stat-label">{sites.length === 1 ? 'Site' : 'Sites'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">👁️</span>
            <span className="stat-value">{sites.reduce((acc, s) => acc + s.views, 0)}</span>
            <span className="stat-label">Total Views</span>
          </div>
          <button className="publish-here-btn" onClick={() => navigate('/build')}>
            ➕ Publish Here
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading sites...</div>
        ) : sites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No sites in {cityInfo.name} yet!</h3>
            <p>Be the first to publish in this neighborhood</p>
            <button className="create-btn" onClick={() => navigate('/build')}>
              🚀 Create Your Site
            </button>
          </div>
        ) : (
          <div className="sites-grid">
            {sites.map((site) => (
              <div key={site.id} className="site-card">
                <h3>{site.title}</h3>
                <div className="site-meta">
                  <span className="site-theme">{site.theme}</span>
                  <span className="site-views">👁️ {site.views}</span>
                </div>
                <div className="site-date">
                  📅 {new Date(site.createdAt).toLocaleDateString()}
                </div>
                <button
                  className="visit-btn"
                  onClick={() => window.open(`https://geocities-reborn-production.up.railway.app/site/${site.id}`, '_blank')}
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

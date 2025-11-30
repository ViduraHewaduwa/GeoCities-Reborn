import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

export default function GalleryPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSites()
  }, [selectedCity])

  const fetchSites = async () => {
    setLoading(true)
    try {
      const url = selectedCity 
        ? `https://geocities-reborn-production.up.railway.app/api/gallery?city=${selectedCity}`
        : 'https://geocities-reborn-production.up.railway.app/api/gallery'
      
      const response = await fetch(url)
      const data = await response.json()
      setSites(data.sites || [])
    } catch (error) {
      console.error('Failed to fetch sites:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCityInfo = (cityId: string) => {
    return CITIES.find(c => c.id === cityId) || CITIES[0]
  }

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <h1>🌐 GEOCITIES GALLERY</h1>
        </div>
        {isAuthenticated && <ProfileMenu />}
      </div>

      <div className="cities-section">
        <h2>🏙️ Browse by Neighborhood</h2>
        <div className="cities-grid">
          <button
            className={`city-card ${!selectedCity ? 'active' : ''}`}
            onClick={() => setSelectedCity(null)}
          >
            <div className="city-icon">🌍</div>
            <div className="city-name">All Cities</div>
            <div className="city-theme">View everything</div>
          </button>
          {CITIES.map((city) => (
            <button
              key={city.id}
              className={`city-card ${selectedCity === city.id ? 'active' : ''}`}
              onClick={() => setSelectedCity(city.id)}
            >
              <div className="city-icon">{city.icon}</div>
              <div className="city-name">{city.name}</div>
              <div className="city-theme">{city.theme}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="sites-section">
        <h2>
          {selectedCity 
            ? `📍 Sites in ${getCityInfo(selectedCity).name}` 
            : '🌟 All Sites'}
        </h2>
        
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
            {sites.map((site) => {
              const cityInfo = getCityInfo(site.city)
              return (
                <div key={site.id} className="site-card">
                  <div className="site-city-badge">
                    {cityInfo.icon} {cityInfo.name}
                  </div>
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
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

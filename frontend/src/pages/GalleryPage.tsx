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
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSites()
  }, [])

  const fetchSites = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://geocities-reborn-production.up.railway.app/api/gallery?limit=200')
      const data = await response.json()
      setSites(data.sites || [])
    } catch (error) {
      console.error('Failed to fetch sites:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSitesByCity = (cityId: string) => {
    return sites.filter(site => site.city === cityId)
  }

  const handleCityClick = (cityId: string) => {
    navigate(`/neighborhood/${cityId}`)
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
        <p className="cities-description">Click on a neighborhood to explore sites</p>
        <div className="cities-grid">
          {CITIES.map((city) => {
            const siteCount = getSitesByCity(city.id).length
            return (
              <button
                key={city.id}
                className="city-card"
                onClick={() => handleCityClick(city.id)}
              >
                <div className="city-icon">{city.icon}</div>
                <div className="city-name">{city.name}</div>
                <div className="city-theme">{city.theme}</div>
                {siteCount > 0 && (
                  <div className="city-badge">{siteCount}</div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="neighborhoods-section">
        <h2>🌟 Recent Sites</h2>
        
        {loading ? (
          <div className="loading">Loading sites...</div>
        ) : sites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No sites published yet!</h3>
            <p>Be the first to publish a site</p>
            <button className="create-btn" onClick={() => navigate('/build')}>
              🚀 Create Site
            </button>
          </div>
        ) : (
          <>
            {CITIES.map((city) => {
              const citySites = getSitesByCity(city.id).slice(0, 4)
              
              if (citySites.length === 0) return null
              
              return (
                <div key={city.id} className="neighborhood-block">
                  <div className="neighborhood-header">
                    <div className="neighborhood-title">
                      <span className="neighborhood-icon">{city.icon}</span>
                      <h2>{city.name}</h2>
                      <span className="site-count">{getSitesByCity(city.id).length} {getSitesByCity(city.id).length === 1 ? 'site' : 'sites'}</span>
                    </div>
                    <button 
                      className="view-all-btn"
                      onClick={() => handleCityClick(city.id)}
                    >
                      View All →
                    </button>
                  </div>
                  
                  <div className="sites-grid">
                    {citySites.map((site) => (
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
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}

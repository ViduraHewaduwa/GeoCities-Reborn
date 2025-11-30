import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProfileMenu from '../components/ProfileMenu'
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

export default function ProfilePage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)

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
                      <span className="site-theme">{site.theme}</span>
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
    </div>
  )
}

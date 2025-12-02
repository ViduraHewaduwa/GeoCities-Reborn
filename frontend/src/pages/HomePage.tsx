import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import ProfileMenu from '../components/ProfileMenu'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number }>>([])

  useEffect(() => {
    const starArray = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
    }))
    setStars(starArray)
  }, [])

  return (
    <div className="retro-container">
      {/* Starry Background */}
      <div className="stars-background">
        {stars.map((star, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="floating-icon satellite">🛰️</div>
        <div className="floating-icon thumbs-up">👍</div>
        <div className="floating-icon globe">🌐</div>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          {isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="auth-btn login-btn">Login</button>
              <button onClick={() => navigate('/register')} className="auth-btn register-btn">Register</button>
            </>
          )}
        </div>

        <h1 className="retro-title">
          <span className="title-geo">GeoCities</span>
          <span className="title-reborn">Reborn</span>
        </h1>
        <div className="tagline">✨ The classic GeoCities experience, rebuilt for today ✨</div>

        <div className="subtitle-box">
          <div className="marquee-text">
            ✨ Welcome to the GeoCities Generator! ✨ Build Your Dream Retro Website! ✨
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Build a Page Card */}
        <div className="retro-card build-card" onClick={() => navigate('/build')}>
          <div className="card-header">
            <span className="blink">● NEW ●</span>
          </div>
          <div className="card-icon">🖊️</div>
          <h2>BUILD A PAGE</h2>
          <p>Create your own retro masterpiece with AI!</p>
          <div className="card-footer">
            <span className="click-here">Click Here! →</span>
          </div>
        </div>

        {/* Edit Pages Card */}
        <div className="retro-card edit-card" onClick={() => isAuthenticated ? navigate('/profile') : navigate('/login')}>
          <div className="card-header">
            <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt="" className="under-construction" />
          </div>
          <div className="card-icon">✏️</div>
          <h2>EDIT PAGES</h2>
          <p>Manage your retro creations</p>
          <div className="card-footer">
            <span className="click-here">Click Here! →</span>
          </div>
        </div>

        {/* Gallery Card */}
        <div className="retro-card gallery-card" onClick={() => navigate('/gallery')}>
          <div className="card-header">
            <span className="hot-badge">🔥 HOT!</span>
          </div>
          <div className="card-icon">🎨</div>
          <h2>GALLERY</h2>
          <p>Browse amazing retro websites</p>
          <div className="card-footer">
            <span className="explore">Explore →</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="feature-window">
          <div className="window-title-bar">
            <span>● ● ●</span>
            <span>Features.exe</span>
            <span>✕</span>
          </div>
          <div className="window-content">
            <ul className="feature-list">
              <li>🤖 AI-Powered Generation</li>
              <li>✨ Multiple Retro Themes</li>
              <li>💾 Download as HTML</li>
              <li>🌐 Publish & Share</li>
              <li>✏️ WYSIWYG Editor</li>
              <li>🔄 Remix Variations</li>
            </ul>
          </div>
        </div>

        <div className="visitor-counter">
          <div className="counter-label">Visitor Counter:</div>
          <div className="counter-digits">
            <span className="digit">0</span>
            <span className="digit">0</span>
            <span className="digit">4</span>
            <span className="digit">2</span>
            <span className="digit">0</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="retro-footer">
        <div className="footer-content">
          <div className="footer-badges">
            <div className="badge">Best Viewed in Netscape Navigator</div>
            <div className="badge">800x600 Resolution</div>
            <div className="badge">Made with ❤️ in 1999</div>
          </div>
          <div className="footer-links">
            <a href="#">Home</a> | <a href="#">About</a> | <a href="#">Contact</a> | <a href="#">Guestbook</a>
          </div>
          <div className="copyright">
            © 2025 GeoCities Generator - Bringing back the 90s web! 🌈
          </div>
        </div>
      </footer>

    </div>
  )
}

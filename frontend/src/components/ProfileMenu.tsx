import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './ProfileMenu.css'

export default function ProfileMenu() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="profile-menu" ref={menuRef}>
      <button 
        className="profile-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        <span className="profile-avatar">👤</span>
        <span className="profile-username">{user.username}</span>
        <span className="profile-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="dropdown-header">
            <div className="dropdown-avatar">👤</div>
            <div className="dropdown-info">
              <div className="dropdown-username">{user.username}</div>
              <div className="dropdown-email">{user.email}</div>
            </div>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={() => { setIsOpen(false); navigate('/') }}>
              <span className="item-icon">🏠</span>
              <span>Home</span>
            </button>
            <button className="dropdown-item" onClick={() => { setIsOpen(false); navigate('/build') }}>
              <span className="item-icon">🖊️</span>
              <span>Build Page</span>
            </button>
            <button className="dropdown-item" onClick={() => { setIsOpen(false); navigate('/profile') }}>
              <span className="item-icon">📄</span>
              <span>My Pages</span>
            </button>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <button className="dropdown-item logout-item" onClick={handleLogout}>
            <span className="item-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}

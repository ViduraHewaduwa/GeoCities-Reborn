import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import BuildPage from './pages/BuildPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import GalleryPage from './pages/GalleryPage'
import NeighborhoodPage from './pages/NeighborhoodPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/build" element={
            <ProtectedRoute>
              <BuildPage />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/neighborhood/:cityId" element={<NeighborhoodPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

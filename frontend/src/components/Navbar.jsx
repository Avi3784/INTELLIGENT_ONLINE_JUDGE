import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Scale } from 'lucide-react'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="navbar-brand">
          <span className="navbar-icon"><Scale size={24} /></span>
          <span className="navbar-title">Visual Judge</span>
        </Link>
        <div className="navbar-links">
          <Link to="/dashboard" className="navbar-link">
            Dashboard
          </Link>
          <Link to="/visualizer" className="navbar-link">
            Visualizer
          </Link>
          <Link to="/leaderboard" className="navbar-link">
            Leaderboard
          </Link>
        </div>
        {user && (
          <Link to="/profile" className="navbar-link">
            Profile
          </Link>
        )}
      </div>

      <div className="navbar-right">
        {user ? (
          <div className="navbar-user">
            <div className="navbar-avatar">
              {(user.username || user.email || 'U')[0].toUpperCase()}
            </div>
            <span className="navbar-username">
              {user.username || user.email}
            </span>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-auth">
            <Link to="/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

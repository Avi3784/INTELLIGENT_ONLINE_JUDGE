import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
          <span className="navbar-icon">⚖️</span>
          <span className="navbar-title">Visual Judge</span>
        </Link>

        <Link to="/dashboard" className="navbar-link">
          Dashboard
        </Link>
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

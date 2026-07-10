import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserProfile } from '../services/api'

function Profile() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await getUserProfile()
        const data = response.data.data || response.data.user || response.data
        setProfile(data)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
        setError('Failed to load profile. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const timeAgo = (dateStr) => {
    if (!dateStr) return ''
    const now = new Date()
    const date = new Date(dateStr)
    const seconds = Math.floor((now - date) / 1000)

    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months}mo ago`
    const years = Math.floor(months / 12)
    return `${years}y ago`
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getVerdictClass = (v) => {
    if (!v) return 'verdict-pending'
    const upper = v.toUpperCase()
    if (upper === 'AC' || upper === 'ACCEPTED') return 'verdict-ac'
    if (upper === 'WA' || upper === 'WRONG ANSWER' || upper === 'WRONG_ANSWER') return 'verdict-wa'
    if (upper === 'TLE' || upper === 'TIME LIMIT EXCEEDED' || upper === 'TIME_LIMIT_EXCEEDED') return 'verdict-tle'
    if (upper === 'RTE' || upper === 'RUNTIME ERROR' || upper === 'RUNTIME_ERROR' || upper === 'RE') return 'verdict-rte'
    return 'verdict-wa'
  }

  const getVerdictLabel = (v) => {
    if (!v) return 'Pending'
    const upper = v.toUpperCase()
    if (upper === 'AC' || upper === 'ACCEPTED') return 'AC'
    if (upper === 'WA' || upper === 'WRONG ANSWER' || upper === 'WRONG_ANSWER') return 'WA'
    if (upper === 'TLE' || upper === 'TIME LIMIT EXCEEDED' || upper === 'TIME_LIMIT_EXCEEDED') return 'TLE'
    if (upper === 'RTE' || upper === 'RUNTIME ERROR' || upper === 'RUNTIME_ERROR' || upper === 'RE') return 'RTE'
    return v
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-page fadeIn">
        <div className="empty-state">
          <div className="empty-icon">😕</div>
          <h2 className="empty-title">Something went wrong</h2>
          <p className="empty-text">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const solvedCount = profile.solvedCount || profile.totalSolved || 0
  const totalSubmissions = profile.totalSubmissions || profile.submissionCount || 0
  const easySolved = profile.easySolved || profile.easy || 0
  const mediumSolved = profile.mediumSolved || profile.medium || 0
  const hardSolved = profile.hardSolved || profile.hard || 0
  const acceptanceRate = totalSubmissions > 0
    ? ((solvedCount / totalSubmissions) * 100).toFixed(1)
    : 'N/A'
  const recentSubmissions = profile.recentSubmissions || profile.submissions || []

  return (
    <div className="profile-page fadeIn">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-lg">
          {(profile.username || profile.email || 'U')[0].toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{profile.username || 'User'}</h1>
          <p className="profile-email">{profile.email || ''}</p>
          <p className="profile-joined">
            📅 Member since {formatDate(profile.createdAt || profile.joinedAt)}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{solvedCount}</div>
          <div className="stat-label">Problems Solved</div>
          <div className="stat-breakdown">
            <span className="dot-easy">● {easySolved} Easy</span>
            <span className="dot-medium">● {mediumSolved} Med</span>
            <span className="dot-hard">● {hardSolved} Hard</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{totalSubmissions}</div>
          <div className="stat-label">Total Submissions</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">
            {acceptanceRate !== 'N/A' ? `${acceptanceRate}%` : acceptanceRate}
          </div>
          <div className="stat-label">Acceptance Rate</div>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="submissions-section">
        <h2>Recent Submissions</h2>

        {recentSubmissions.length === 0 ? (
          <div className="empty-state" style={{ minHeight: '150px' }}>
            <div className="empty-icon">📝</div>
            <p className="empty-text">No submissions yet. Start solving problems!</p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              Browse Challenges
            </button>
          </div>
        ) : (
          recentSubmissions.slice(0, 10).map((sub, index) => (
            <div key={sub._id || index} className="submission-item slideUp" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="submission-info">
                <span
                  className="submission-problem"
                  onClick={() => navigate(`/problems/${sub.problemId || sub.problem?._id || sub.problem}`)}
                >
                  {sub.problemTitle || sub.problem?.title || 'Problem'}
                </span>
                <span className="lang-badge">{sub.language || 'python'}</span>
              </div>
              <div className="submission-meta">
                <span className={`verdict-badge ${getVerdictClass(sub.verdict || sub.status)}`}>
                  {getVerdictLabel(sub.verdict || sub.status)}
                </span>
                <span>{timeAgo(sub.createdAt || sub.submittedAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Profile

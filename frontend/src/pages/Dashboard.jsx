import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProblems } from '../services/api'
import { Lightbulb, AlertTriangle, Inbox, Circle } from 'lucide-react'

function Dashboard() {
  const navigate = useNavigate()
  const [problems, setProblems] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProblems()
  }, [])

  const fetchProblems = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getProblems()
      // Handle different response shapes from the API
      const data = response.data.data || response.data.problems || response.data
      setProblems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch problems:', err)
      setError('Failed to load problems. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const filteredProblems = filter === 'ALL'
    ? problems
    : problems.filter((p) => p.difficulty?.toUpperCase() === filter)

  const filterButtons = [
    { label: 'All', value: 'ALL', className: 'filter-all' },
    { label: 'Easy', value: 'EASY', className: 'filter-easy' },
    { label: 'Medium', value: 'MEDIUM', className: 'filter-medium' },
    { label: 'Hard', value: 'HARD', className: 'filter-hard' },
  ]

  return (
    <div className="dashboard-page fadeIn">
      <div className="dashboard-header">
        <div className="dashboard-header-text">
          <h1 className="page-title">
            <span className="title-icon"><Lightbulb size={32} /></span>
            Challenges
          </h1>
          <p className="page-subtitle">
            Sharpen your skills with curated programming problems
          </p>
        </div>

        <div className="filter-group">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              className={`btn btn-filter ${btn.className} ${
                filter === btn.value ? 'active' : ''
              }`}
              onClick={() => setFilter(btn.value)}
            >
              {btn.label}
              {btn.value === 'ALL' ? (
                <span className="filter-count">{problems.length}</span>
              ) : (
                <span className="filter-count">
                  {problems.filter((p) => p.difficulty?.toUpperCase() === btn.value).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

{loading && (
        <div className="card">
          <div className="problem-table">
            <div className="skeleton skeleton-title" style={{ margin: '16px' }}></div>
            <div className="skeleton skeleton-badge" style={{ margin: '16px' }}></div>
            <div className="skeleton skeleton-tags" style={{ margin: '16px' }}></div>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="empty-state">
          <div className="empty-icon"><AlertTriangle size={48} /></div>
          <h2 className="empty-title">Something went wrong</h2>
          <p className="empty-text">{error}</p>
          <button onClick={fetchProblems} className="btn btn-primary">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filteredProblems.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><Inbox size={48} /></div>
          <h2 className="empty-title">No problems found</h2>
          <p className="empty-text">
            {filter === 'ALL'
              ? 'No problems have been added yet. Check back later!'
              : `No ${filter.toLowerCase()} problems available. Try a different filter.`}
          </p>
          {filter !== 'ALL' && (
            <button
              onClick={() => setFilter('ALL')}
              className="btn btn-outline"
            >
              Show All Problems
            </button>
          )}
        </div>
      )}

      {!loading && !error && filteredProblems.length > 0 && (
        <div className="slideUp">
          <table className="problem-table">
            <thead>
              <tr>
                <th className="col-status"></th>
                <th className="col-index">#</th>
                <th className="col-title">Title</th>
                <th className="col-difficulty">Difficulty</th>
                <th className="col-acceptance">Acceptance</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem, index) => (
                <tr
                  key={problem._id}
                  onClick={() => navigate(`/problems/${problem._id}`)}
                >
                  <td className="col-status">
                    <Circle size={16} style={{ color: 'var(--text-muted)', opacity: '0.4' }} />
                  </td>
                  <td className="col-index">{index + 1}</td>
                  <td className="col-title">{problem.title}</td>
                  <td className="col-difficulty">
                    <span className={`badge ${getDifficultyClass(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="col-acceptance">
                    {problem.acceptanceRate != null ? `${problem.acceptanceRate}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function getDifficultyClass(difficulty) {
  switch (difficulty?.toUpperCase()) {
    case 'EASY': return 'difficulty-easy'
    case 'MEDIUM': return 'difficulty-medium'
    case 'HARD': return 'difficulty-hard'
    default: return 'difficulty-easy'
  }
}

export default Dashboard

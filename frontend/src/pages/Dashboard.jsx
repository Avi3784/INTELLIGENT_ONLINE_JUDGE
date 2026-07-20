import { useState, useEffect } from 'react'
import { getProblems } from '../services/api'
import ProblemCard from '../components/ProblemCard'
import { Lightbulb, AlertTriangle, Inbox } from 'lucide-react'

function Dashboard() {
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
        <div className="problems-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card skeleton-card">
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-badge"></div>
              <div className="skeleton skeleton-tags"></div>
            </div>
          ))}
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
        <div className="problems-grid">
          {filteredProblems.map((problem, index) => (
            <div
              key={problem._id}
              className="slideUp"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProblemCard problem={problem} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProblemById } from '../services/api'

function ProblemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await getProblemById(id)
        const data = response.data.data || response.data.problem || response.data
        setProblem(data)
      } catch (err) {
        console.error('Failed to fetch problem:', err)
        if (err.response?.status === 404) {
          setError('Problem not found')
        } else {
          setError('Failed to load problem details')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProblem()
  }, [id])

  const getDifficultyClass = (difficulty) => {
    switch (difficulty?.toUpperCase()) {
      case 'EASY': return 'difficulty-easy'
      case 'MEDIUM': return 'difficulty-medium'
      case 'HARD': return 'difficulty-hard'
      default: return 'difficulty-easy'
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading problem...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-page fadeIn">
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h2 className="empty-title">{error}</h2>
          <p className="empty-text">
            The problem you're looking for might have been removed or doesn't exist.
          </p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            ← Back to Challenges
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="problem-detail-page fadeIn">
      <button
        onClick={() => navigate('/dashboard')}
        className="btn btn-ghost back-btn"
      >
        ← Back to Challenges
      </button>

      <div className="problem-header">
        <div className="problem-title-row">
          <h1 className="problem-title">{problem.title}</h1>
          <span className={`badge badge-lg ${getDifficultyClass(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>

        {problem.tags && problem.tags.length > 0 && (
          <div className="problem-tags">
            {problem.tags.map((tag, index) => (
              <span key={index} className="badge badge-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="problem-constraints">
          {problem.timeLimit && (
            <div className="constraint-badge">
              <span className="constraint-icon">⏱️</span>
              <span>Time Limit: {problem.timeLimit}ms</span>
            </div>
          )}
          {problem.memoryLimit && (
            <div className="constraint-badge">
              <span className="constraint-icon">💾</span>
              <span>Memory Limit: {problem.memoryLimit}MB</span>
            </div>
          )}
        </div>
      </div>

      <div className="problem-section">
        <h2 className="section-title">Description</h2>
        <div className="problem-description">
          {problem.description?.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {problem.inputFormat && (
        <div className="problem-section">
          <h2 className="section-title">Input Format</h2>
          <div className="problem-description">
            <p>{problem.inputFormat}</p>
          </div>
        </div>
      )}

      {problem.outputFormat && (
        <div className="problem-section">
          <h2 className="section-title">Output Format</h2>
          <div className="problem-description">
            <p>{problem.outputFormat}</p>
          </div>
        </div>
      )}

      {problem.sampleTestCases && problem.sampleTestCases.length > 0 && (
        <div className="problem-section">
          <h2 className="section-title">Sample Test Cases</h2>
          <div className="test-cases">
            {problem.sampleTestCases.map((tc, index) => (
              <div key={index} className="test-case-card">
                <div className="test-case-header">
                  <span className="test-case-label">Example {index + 1}</span>
                </div>
                <div className="test-case-body">
                  <div className="test-case-section">
                    <span className="test-case-section-label">Input</span>
                    <pre className="test-case-code">{tc.input}</pre>
                  </div>
                  <div className="test-case-section">
                    <span className="test-case-section-label">Output</span>
                    <pre className="test-case-code">{tc.expectedOutput}</pre>
                  </div>
                  {tc.explanation && (
                    <div className="test-case-section">
                      <span className="test-case-section-label">Explanation</span>
                      <p className="test-case-explanation">{tc.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="problem-section">
        <h2 className="section-title">Submit Solution</h2>
        <div className="code-editor-placeholder">
          <div className="placeholder-icon">⌨️</div>
          <h3 className="placeholder-title">Code Editor — Coming Soon</h3>
          <p className="placeholder-text">
            The integrated code editor with syntax highlighting, multiple language support,
            and real-time submission will be available in the next module.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProblemDetail

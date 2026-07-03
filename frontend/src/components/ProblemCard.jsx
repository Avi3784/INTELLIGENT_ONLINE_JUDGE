import { useNavigate } from 'react-router-dom'

function ProblemCard({ problem }) {
  const navigate = useNavigate()

  const getDifficultyClass = (difficulty) => {
    switch (difficulty?.toUpperCase()) {
      case 'EASY': return 'difficulty-easy'
      case 'MEDIUM': return 'difficulty-medium'
      case 'HARD': return 'difficulty-hard'
      default: return 'difficulty-easy'
    }
  }

  const handleClick = () => {
    navigate(`/problems/${problem._id}`)
  }

  return (
    <div
      className={`card problem-card ${getDifficultyClass(problem.difficulty)}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="problem-card-header">
        <h3 className="problem-card-title">{problem.title}</h3>
        <span className={`badge ${getDifficultyClass(problem.difficulty)}`}>
          {problem.difficulty}
        </span>
      </div>

      {problem.tags && problem.tags.length > 0 && (
        <div className="problem-card-tags">
          {problem.tags.map((tag, index) => (
            <span key={index} className="badge badge-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="problem-card-footer">
        <span className="problem-card-link">
          Solve Challenge →
        </span>
      </div>
    </div>
  )
}

export default ProblemCard

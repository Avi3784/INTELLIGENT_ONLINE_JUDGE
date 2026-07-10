import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProblemById, runCode, submitCode, getAIFeedback } from '../services/api'
import Editor from '@monaco-editor/react'

const STARTER_CODE = {
  python: '# Write your solution here\n\n',
  javascript: '// Write your solution here\n\n',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n',
  java: 'import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n    }\n}\n',
}

const LANGUAGE_MAP = {
  python: 'python',
  javascript: 'javascript',
  cpp: 'cpp',
  java: 'java',
}

function renderMarkdown(text) {
  if (!text) return ''
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  // Line breaks (only for lines not already wrapped in tags)
  html = html.replace(/\n{2,}/g, '</p><p>')
  html = '<p>' + html + '</p>'
  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '')
  html = html.replace(/<p>(<h[123]>)/g, '$1')
  html = html.replace(/(<\/h[123]>)<\/p>/g, '$1')
  html = html.replace(/<p>(<pre>)/g, '$1')
  html = html.replace(/(<\/pre>)<\/p>/g, '$1')
  html = html.replace(/<p>(<ul>)/g, '$1')
  html = html.replace(/(<\/ul>)<\/p>/g, '$1')
  return html
}

function ProblemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState(STARTER_CODE['python'])
  const [results, setResults] = useState(null)
  const [verdict, setVerdict] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiFeedback, setAiFeedback] = useState(null)

  const hasSubmitted = useRef(false)

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

  const handleLanguageChange = (e) => {
    const newLang = e.target.value
    setLanguage(newLang)
    setCode(STARTER_CODE[newLang])
  }

  const handleRun = async () => {
    setIsRunning(true)
    setResults(null)
    setVerdict(null)
    try {
      const response = await runCode({ problemId: id, language, code })
      const data = response.data.data || response.data
      setResults(data.testResults || data.results || [])
    } catch (err) {
      console.error('Run error:', err)
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to run code'
      setResults([{ testCase: 1, passed: false, error: msg }])
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setResults(null)
    setVerdict(null)
    setAiFeedback(null)
    try {
      const response = await submitCode({ problemId: id, language, code })
      const data = response.data.data || response.data
      setResults(data.testResults || data.results || [])
      setVerdict(data.verdict || data.status || null)
      hasSubmitted.current = true
    } catch (err) {
      console.error('Submit error:', err)
      const msg = err.response?.data?.message || err.response?.data?.error || 'Submission failed'
      setResults([{ testCase: 1, passed: false, error: msg }])
      setVerdict('ERROR')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAIFeedback = async () => {
    setAiLoading(true)
    try {
      const response = await getAIFeedback({
        code,
        language,
        problemTitle: problem.title,
        problemDescription: problem.description,
        verdict,
      })
      const data = response.data.data || response.data
      setAiFeedback(data.feedback || data.message || data)
    } catch (err) {
      console.error('AI feedback error:', err)
      setAiFeedback('Failed to get AI feedback. Please try again.')
    } finally {
      setAiLoading(false)
    }
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
    if (upper === 'AC' || upper === 'ACCEPTED') return '✅ Accepted'
    if (upper === 'WA' || upper === 'WRONG ANSWER' || upper === 'WRONG_ANSWER') return '❌ Wrong Answer'
    if (upper === 'TLE' || upper === 'TIME LIMIT EXCEEDED' || upper === 'TIME_LIMIT_EXCEEDED') return '⏱️ Time Limit Exceeded'
    if (upper === 'RTE' || upper === 'RUNTIME ERROR' || upper === 'RUNTIME_ERROR' || upper === 'RE') return '💥 Runtime Error'
    return v
  }

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
    <div className="fadeIn">
      <div className="workspace-back-bar">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-ghost back-btn"
        >
          ← Back to Challenges
        </button>
      </div>

      <div className="problem-workspace">
        {/* Left Panel — Problem Info */}
        <div className="problem-info-panel">
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
                  <span>{problem.timeLimit}ms</span>
                </div>
              )}
              {problem.memoryLimit && (
                <div className="constraint-badge">
                  <span className="constraint-icon">💾</span>
                  <span>{problem.memoryLimit}MB</span>
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
        </div>

        {/* Right Panel — Code Editor */}
        <div className="code-editor-panel">
          <div className="editor-toolbar">
            <select
              className="language-selector"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>

          <div className="editor-wrapper">
            <Editor
              height="calc(100vh - 420px)"
              theme="vs-dark"
              language={LANGUAGE_MAP[language]}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
              }}
            />
          </div>

          <div className="editor-actions">
            <button
              className="btn btn-run"
              onClick={handleRun}
              disabled={isRunning || isSubmitting}
            >
              {isRunning ? (
                <span className="btn-loading">
                  <span className="loading-spinner loading-spinner-sm"></span>
                  Running...
                </span>
              ) : (
                '▶ Run Code'
              )}
            </button>
            <button
              className="btn btn-submit"
              onClick={handleSubmit}
              disabled={isRunning || isSubmitting}
            >
              {isSubmitting ? (
                <span className="btn-loading">
                  <span className="loading-spinner loading-spinner-sm"></span>
                  Submitting...
                </span>
              ) : (
                '📤 Submit'
              )}
            </button>
          </div>

          {/* Results Panel */}
          {results && (
            <div className="results-panel fadeIn">
              <div className="results-header">
                <span className="results-title">
                  {verdict ? 'Submission Results' : 'Run Results'}
                </span>
                {verdict && (
                  <span className={`verdict-badge ${getVerdictClass(verdict)}`}>
                    {getVerdictLabel(verdict)}
                  </span>
                )}
              </div>
              <div className="results-body">
                {results.map((result, index) => (
                  <div key={index}>
                    <div className={`test-result-item ${result.passed ? 'passed' : 'failed'}`}>
                      <span>
                        {result.passed ? '✅' : '❌'}{' '}
                        Test {result.testCase || index + 1}
                        {result.isHidden ? ' (Hidden)' : ''}
                      </span>
                      <span>
                        {result.executionTime ? `${result.executionTime}ms` : ''}
                      </span>
                    </div>
                    {!result.passed && !result.isHidden && (
                      <div className="test-result-detail">
                        {result.error ? (
                          <div>
                            <span style={{ color: 'var(--color-hard)' }}>Error: </span>
                            {result.error}
                          </div>
                        ) : (
                          <>
                            {result.expectedOutput !== undefined && (
                              <div>
                                <span style={{ color: 'var(--text-muted)' }}>Expected: </span>
                                <span style={{ color: 'var(--color-easy)' }}>{result.expectedOutput}</span>
                              </div>
                            )}
                            {result.actualOutput !== undefined && (
                              <div>
                                <span style={{ color: 'var(--text-muted)' }}>Actual: </span>
                                <span style={{ color: 'var(--color-hard)' }}>{result.actualOutput}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Feedback Section */}
          {hasSubmitted.current && (
            <div className="ai-feedback-section fadeIn">
              <button
                className="btn btn-ai"
                onClick={handleAIFeedback}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <span className="btn-loading">
                    <span className="loading-spinner loading-spinner-sm"></span>
                    Analyzing your code...
                  </span>
                ) : (
                  '🤖 Get AI Feedback'
                )}
              </button>

              {aiFeedback && (
                <div className="ai-feedback-card fadeIn">
                  <div className="ai-feedback-header">
                    <span className="ai-feedback-title">🤖 AI Analysis</span>
                  </div>
                  <div
                    className="ai-feedback-content"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(typeof aiFeedback === 'string' ? aiFeedback : JSON.stringify(aiFeedback)) }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProblemDetail

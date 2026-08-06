import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProblemById, runCode, submitCode, getAIFeedback } from '../services/api'
import Editor from '@monaco-editor/react'
import { CheckCircle, XCircle, Clock, Database, Search, Play, Send, Zap, Bot, ArrowLeft, MessageSquare, BookOpen, Lightbulb } from 'lucide-react'
import SolutionsTab from '../components/SolutionsTab'

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
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  html = html.replace(/\n{2,}/g, '</p><p>')
  html = '<p>' + html + '</p>'
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
  
  // Console state
  const [consoleTab, setConsoleTab] = useState('testcases')
  const [customInput, setCustomInput] = useState('')
  const [results, setResults] = useState(null)
  const [verdict, setVerdict] = useState(null)
  
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiFeedback, setAiFeedback] = useState(null)
  
  const [leftTab, setLeftTab] = useState('description') // 'description' or 'solutions'
  const [showHints, setShowHints] = useState(false)

  const hasSubmitted = useRef(false)

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await getProblemById(id)
        const data = response.data.data || response.data.problem || response.data
        setProblem(data)
        if (data.sampleTestCases && data.sampleTestCases.length > 0) {
          setCustomInput(data.sampleTestCases[0].input || '')
        }
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

  useEffect(() => {
    if (!problem) {
      return
    }

    if (problem.defaultCode && problem.defaultCode[language]) {
      setCode(problem.defaultCode[language])
    } else {
      setCode(STARTER_CODE[language])
    }
  }, [problem, language])

  const handleLanguageChange = (e) => {
    const newLang = e.target.value
    setLanguage(newLang)
  }

  const handleRun = async () => {
    setIsRunning(true)
    setResults(null)
    setVerdict(null)
    setConsoleTab('result')
    try {
      // If custom input matches a sample test case, use its expected output
      let expectedOut = '';
      if (problem && problem.sampleTestCases) {
        const matchedTc = problem.sampleTestCases.find(tc => tc.input === customInput);
        if (matchedTc) expectedOut = matchedTc.expectedOutput || '';
      }
      const customTestCases = customInput.trim() ? [{ input: customInput, expectedOutput: expectedOut }] : []
      const response = await runCode({ problemId: id, language, code, customTestCases })
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
    setConsoleTab('result')
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
      const msg = err.response?.data?.message || err.message || 'Failed to get AI feedback. Please try again.'
      setAiFeedback(`**Error:** ${msg}`)
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
    if (upper === 'AC' || upper === 'ACCEPTED') return <><CheckCircle size={16} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Accepted</>
    if (upper === 'WA' || upper === 'WRONG ANSWER' || upper === 'WRONG_ANSWER') return <><XCircle size={16} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Wrong Answer</>
    if (upper === 'TLE' || upper === 'TIME LIMIT EXCEEDED' || upper === 'TIME_LIMIT_EXCEEDED') return <><Clock size={16} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Time Limit Exceeded</>
    if (upper === 'RTE' || upper === 'RUNTIME ERROR' || upper === 'RUNTIME_ERROR' || upper === 'RE') return <><Zap size={16} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Runtime Error</>
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
          <div className="empty-icon"><Search size={48} /></div>
          <h2 className="empty-title">{error}</h2>
          <p className="empty-text">
            The problem you're looking for might have been removed or doesn't exist.
          </p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Back to Challenges
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fadeIn leetcode-layout-wrapper">
      <div className="workspace-back-bar">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-ghost back-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} /> Back to Challenges
        </button>
      </div>

      <div className="leetcode-workspace">
        {/* Left Pane: Problem Description */}
        <div className="pane left-pane">
          <div className="pane-content problem-info-panel">
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
                    <span key={index} className="badge badge-tag">{tag}</span>
                  ))}
                </div>
              )}

              <div className="problem-constraints">
                {problem.timeLimit && (
                  <div className="constraint-badge">
                    <span className="constraint-icon"><Clock size={16} /></span>
                    <span>{problem.timeLimit}ms</span>
                  </div>
                )}
                {problem.memoryLimit && (
                  <div className="constraint-badge">
                    <span className="constraint-icon"><Database size={16} /></span>
                    <span>{problem.memoryLimit}MB</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', borderBottom: '1px solid var(--border-color)' }}>
                <button 
                  className={`btn btn-ghost ${leftTab === 'description' ? 'active-tab' : ''}`}
                  onClick={() => setLeftTab('description')}
                  style={{ borderBottom: leftTab === 'description' ? '2px solid var(--primary)' : 'none', borderRadius: '0' }}
                >
                  <BookOpen size={16} style={{marginRight: '6px'}}/> Description
                </button>
                <button 
                  className={`btn btn-ghost ${leftTab === 'solutions' ? 'active-tab' : ''}`}
                  onClick={() => setLeftTab('solutions')}
                  style={{ borderBottom: leftTab === 'solutions' ? '2px solid var(--primary)' : 'none', borderRadius: '0' }}
                >
                  <MessageSquare size={16} style={{marginRight: '6px'}}/> Community Solutions
                </button>
                {problem.officialSolution && (
                  <button 
                    className={`btn btn-ghost ${leftTab === 'official' ? 'active-tab' : ''}`}
                    onClick={() => setLeftTab('official')}
                    style={{ borderBottom: leftTab === 'official' ? '2px solid var(--primary)' : 'none', borderRadius: '0', color: 'var(--color-easy)' }}
                  >
                    <CheckCircle size={16} style={{marginRight: '6px'}}/> Official Solution
                  </button>
                )}
              </div>
            </div>

            {leftTab === 'description' ? (
              <>
                <div className="problem-section">
                  <div className="problem-description">
                    {problem.description?.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {problem.hints && problem.hints.length > 0 && (
                  <div className="problem-section hints-section">
                    <button 
                      className="btn btn-outline" 
                      onClick={() => setShowHints(!showHints)}
                      style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lightbulb size={16} color="var(--color-medium)"/> 
                        {showHints ? 'Hide Hints' : `Show Hints (${problem.hints.length})`}
                      </span>
                    </button>
                    {showHints && (
                      <div className="hints-list" style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {problem.hints.map((hint, idx) => (
                          <div key={idx} style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-medium)' }}>
                            <strong>Hint {idx + 1}:</strong> {hint}
                          </div>
                        ))}
                      </div>
                    )}
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </>
            ) : leftTab === 'official' && problem.officialSolution ? (
              <div className="problem-section" style={{ padding: 'var(--space-lg)' }}>
                <h2 className="section-title text-xl font-bold mb-4" style={{ color: 'var(--color-easy)' }}>Official Solution</h2>
                <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--color-easy)' }}>
                  <h3 className="font-semibold mb-2">Layman Explanation</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{problem.officialSolution.explanation}</p>
                </div>
                
                <h3 className="font-semibold mb-3">Solution Code ({language})</h3>
                {problem.officialSolution.code && problem.officialSolution.code[language] ? (
                  <pre className="p-4 rounded-xl overflow-x-auto" style={{ backgroundColor: '#000', border: '1px solid var(--border-color)', fontFamily: 'monospace' }}>
                    <code>{problem.officialSolution.code[language]}</code>
                  </pre>
                ) : (
                  <div className="p-4 text-center text-gray-500 italic">No official code available for {language}.</div>
                )}
              </div>
            ) : (
              <SolutionsTab problemId={id} />
            )}
          </div>
        </div>

        {/* Right Pane: Code Editor + Console */}
        <div className="pane right-pane">
          {/* Top Half: Editor */}
          <div className="editor-container">
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
              
              <div className="editor-actions-top">
                <button className="btn btn-outline btn-sm" onClick={handleRun} disabled={isRunning || isSubmitting}>
                  {isRunning ? 'Running...' : <><Play size={16} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }}/> Run</>}
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={isRunning || isSubmitting}>
                  {isSubmitting ? 'Submitting...' : <><Send size={16} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }}/> Submit</>}
                </button>
              </div>
            </div>
            
            <div className="editor-wrapper">
              <Editor
                height="100%"
                theme="vs-dark"
                language={LANGUAGE_MAP[language]}
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  padding: { top: 16 },
                  fontFamily: "'JetBrains Mono', monospace",
                  smoothScrolling: true,
                }}
              />
            </div>
          </div>

          {/* Bottom Half: Console */}
          <div className="console-container">
            <div className="console-header">
              <button 
                className={`console-tab ${consoleTab === 'testcases' ? 'active' : ''}`}
                onClick={() => setConsoleTab('testcases')}
              >
                Testcases
              </button>
              <button 
                className={`console-tab ${consoleTab === 'result' ? 'active' : ''}`}
                onClick={() => setConsoleTab('result')}
              >
                Test Result
              </button>
            </div>
            
            <div className="console-body">
              {consoleTab === 'testcases' && (
                <div className="console-testcases">
                  <p className="console-label">Custom Input (Provide input matching the problem format):</p>
                  <textarea 
                    className="custom-input-textarea"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="e.g. [2,7,11,15]\n9"
                  />
                </div>
              )}

              {consoleTab === 'result' && (
                <div className="console-result">
                  {!results && !verdict && (
                    <div className="console-empty">
                      Run your code or submit to see results.
                    </div>
                  )}

                  {verdict && (
                    <div className="verdict-banner">
                      <span className={`verdict-badge ${getVerdictClass(verdict)}`}>
                        {getVerdictLabel(verdict)}
                      </span>
                    </div>
                  )}

                  {results && results.map((result, index) => (
                    <div key={index} className="result-card" style={{ marginBottom: '16px' }}>
                      <div className={`result-status ${result.passed || result.expectedOutput === '' ? 'passed' : 'failed'}`}>
                        {result.passed ? <><CheckCircle size={16} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Test Case Passed</> : 
                         result.expectedOutput === '' ? <><CheckCircle size={16} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Execution Complete</> : 
                         <><XCircle size={16} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Test Case Failed</>}
                        {result.isHidden && ' (Hidden)'}
                      </div>
                      
                      {!result.passed && !result.isHidden && (
                        <div className="result-details">
                          {result.error ? (
                            <div className="result-block error-block">
                              <strong>Runtime Error:</strong>
                              <pre>{result.error}</pre>
                            </div>
                          ) : (
                            <>
                              <div className="result-block">
                                <strong>Input:</strong>
                                <pre>{result.input}</pre>
                              </div>
                              <div className="result-block">
                                <strong>Your Output:</strong>
                                <pre className="actual-output" style={{ color: result.expectedOutput === '' ? 'var(--text-primary)' : 'var(--color-hard)' }}>{result.actualOutput}</pre>
                              </div>
                              {result.expectedOutput !== '' && (
                                <div className="result-block">
                                  <strong>Expected:</strong>
                                  <pre className="expected-output" style={{ color: 'var(--color-easy)' }}>{result.expectedOutput}</pre>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      
                      {/* Show output if execution completed without expectedOutput (custom testcase) */}
                      {result.passed === false && !result.isHidden && !result.error && result.expectedOutput === '' && (
                        <div className="result-details">
                          <div className="result-block">
                            <strong>Input:</strong>
                            <pre>{result.input}</pre>
                          </div>
                          <div className="result-block">
                            <strong>Output:</strong>
                            <pre className="actual-output" style={{ color: 'var(--text-primary)' }}>{result.actualOutput}</pre>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* AI Feedback Box inside Results */}
                  {hasSubmitted.current && (
                    <div className="ai-feedback-section" style={{ marginTop: '24px' }}>
                      <button className="btn btn-ai" onClick={handleAIFeedback} disabled={aiLoading}>
                        {aiLoading ? 'Analyzing...' : <><Bot size={16} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Get AI Feedback</>}
                      </button>
                      
                      {aiFeedback && (
                        <div className="ai-feedback-card" style={{ marginTop: '16px' }}>
                          <div className="ai-feedback-header" style={{ fontWeight: 'bold', marginBottom: '8px' }}><Bot size={20} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> AI Analysis</div>
                          <div
                            className="ai-feedback-content"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(typeof aiFeedback === 'string' ? aiFeedback : JSON.stringify(aiFeedback)) }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProblemDetail

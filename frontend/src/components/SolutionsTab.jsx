import React, { useState, useEffect } from 'react';
import { getSolutions, postSolution, upvoteSolution } from '../services/api';
import { MessageSquare, Code, Send, ThumbsUp, User, Layout, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SolutionsTab = ({ problemId }) => {
  // Store the list of solutions from the database
  const [solutions, setSolutions] = useState([]);
  // Track if we are currently loading data
  const [loading, setLoading] = useState(true);
  // Store any errors that happen
  const [error, setError] = useState(null);
  
  // Store what the user types in the form
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [explanation, setExplanation] = useState('');
  
  // Track if the form is currently saving
  const [submitting, setSubmitting] = useState(false);
  // Track if the form is open or closed
  const [showForm, setShowForm] = useState(false);

  // Fetch solutions when the page loads
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setLoading(true);
        const response = await getSolutions(problemId);
        setSolutions(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch solutions", err);
        setError("Failed to load solutions.");
      } finally {
        setLoading(false);
      }
    };
    if (problemId) {
      fetchSolutions();
    }
  }, [problemId]);

  // Handle when the user clicks submit on their new solution
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the page from reloading
    if (!code.trim() || !explanation.trim()) return;
    
    try {
      setSubmitting(true);
      const response = await postSolution({ problemId, code, language, explanation });
      const newSolution = response.data.data;
      if (newSolution) {
        setSolutions([newSolution, ...solutions]);
      }
      setCode('');
      setExplanation('');
      setShowForm(false);
    } catch (err) {
      console.error("Failed to post solution", err);
      alert("Failed to post solution");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle when a user clicks the like button
  const handleUpvote = async (solutionId) => {
    try {
      const res = await upvoteSolution(solutionId);
      const updatedSolution = res.data.data;
      setSolutions(solutions.map(s => s._id === solutionId ? updatedSolution : s));
    } catch (err) {
      console.error("Failed to upvote", err);
    }
  };

  return (
    <div className="py-8 px-2 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--border-color)]">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-3 text-white">
            <MessageSquare className="text-[var(--primary)]" /> Community Solutions
          </h3>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Learn from other developers' approaches</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center gap-2"
          style={{ background: showForm ? 'var(--bg-card)' : '', color: showForm ? 'var(--text-primary)' : '' }}
        >
          <Code size={16} /> {showForm ? 'Cancel' : 'Share Solution'}
        </button>
      </div>

      {/* Share Form (Collapsible) */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mb-10 overflow-hidden"
          >
            <div className="bg-[var(--bg-card)] border border-[var(--primary)] rounded-2xl p-6 shadow-[0_0_20px_rgba(0, 184, 163,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] opacity-10 blur-[50px] rounded-full"></div>
              
              <h4 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                <Terminal size={18} className="text-[var(--primary-light)]" /> Post Your Approach
              </h4>
              
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3">
                    <label className="block text-xs font-semibold mb-1 text-[var(--text-secondary)] uppercase tracking-wider">Language</label>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-white focus:outline-none focus:border-[var(--primary)] transition-colors"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                    </select>
                  </div>
                  <div className="w-full md:w-2/3">
                    <label className="block text-xs font-semibold mb-1 text-[var(--text-secondary)] uppercase tracking-wider">Explanation</label>
                    <input
                      type="text"
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-white focus:outline-none focus:border-[var(--primary)] transition-colors"
                      placeholder="Briefly explain your time/space complexity or logic..."
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--text-secondary)] uppercase tracking-wider">Code Solution</label>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-48 p-4 font-mono text-sm rounded-lg border border-[var(--border-color)] bg-[#0d0d12] text-[#e2e8f0] focus:outline-none focus:border-[var(--primary)] transition-colors resize-y shadow-inner"
                    placeholder="Paste your solution code here..."
                    required
                  />
                </div>
                
                <div className="flex justify-end pt-2">
                  <button 
                    type="submit" 
                    disabled={submitting || !code.trim() || !explanation.trim()}
                    className="btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 px-6 py-2.5 rounded-lg font-medium"
                  >
                    <Send className="w-4 h-4" /> {submitting ? 'Posting...' : 'Publish Solution'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solutions List */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        ) : solutions.length === 0 ? (
          <div className="text-center py-16 bg-[var(--bg-card)] border border-dashed border-[var(--border-color)] rounded-2xl flex flex-col items-center justify-center">
            <Layout className="w-12 h-12 text-[var(--text-muted)] mb-4 opacity-50" />
            <h4 className="text-lg font-medium text-[var(--text-primary)]">No solutions yet</h4>
            <p className="text-[var(--text-secondary)] mt-1 mb-6">Be the first to share your approach for this problem.</p>
            <button onClick={() => setShowForm(true)} className="btn btn-outline">Share Solution</button>
          </div>
        ) : (
          <div className="space-y-6">
            {solutions.map((sol, i) => (
              <motion.div
                key={sol._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:border-[var(--primary)] transition-colors group"
              >
                {/* Solution Header */}
                <div className="p-4 sm:p-5 border-b border-[var(--border-color)] bg-[rgba(0,0,0,0.2)] flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] p-[1px]">
                      <div className="w-full h-full bg-[var(--bg-card)] rounded-xl flex items-center justify-center text-[var(--primary-light)]">
                        <User size={18} />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--text-primary)]">{sol.userId?.username || 'Anonymous'}</div>
                      <div className="text-xs text-[var(--text-secondary)] font-medium">
                        {new Date(sol.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-xs px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full text-[var(--text-secondary)] font-semibold tracking-wider uppercase">
                      {sol.language || 'Unknown'}
                    </div>
                    <button 
                      onClick={() => handleUpvote(sol._id)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all group-hover:shadow-[0_0_10px_rgba(0, 184, 163,0.2)]"
                    >
                      <ThumbsUp size={14} className="group-hover:-translate-y-0.5 transition-transform" /> 
                      <span>{sol.upvotes?.length || 0}</span>
                    </button>
                  </div>
                </div>
                
                {/* Solution Body */}
                <div className="p-5 sm:p-6">
                  <div className="flex gap-2 mb-4">
                    <div className="w-1 h-full min-h-[24px] bg-gradient-to-b from-[var(--primary)] to-transparent rounded-full"></div>
                    <p className="text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                      {sol.explanation}
                    </p>
                  </div>
                  
                  <div className="relative group/code">
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                      {/* Could add a copy button here */}
                    </div>
                    <pre className="p-5 bg-[#0a0a0f] border border-[var(--border-color)] rounded-xl overflow-x-auto text-[13px] sm:text-sm font-mono text-[#e2e8f0] shadow-inner">
                      <code>{sol.code}</code>
                    </pre>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionsTab;

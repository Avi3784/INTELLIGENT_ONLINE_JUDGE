import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProblemById, createProblem, updateProblem } from '../services/api';
import { Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminProblemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'EASY',
    tags: '',
    timeLimit: 2000,
    memoryLimit: 256,
    methodName: '',
    sampleTestCases: [{ input: '', expectedOutput: '' }],
    hiddenTestCases: [{ input: '', expectedOutput: '' }],
    defaultCode: { python: '', javascript: '', cpp: '', java: '' }
  });

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/dashboard');
      return;
    }

    if (!isEdit) {
      return;
    }

    const fetchProblem = async () => {
      try {
        const res = await getProblemById(id);
        const p = res.data;
        setFormData({
          title: p.title,
          description: p.description,
          difficulty: p.difficulty,
          tags: p.tags.join(', '),
          timeLimit: p.timeLimit,
          memoryLimit: p.memoryLimit,
          methodName: p.methodName || '',
          sampleTestCases: p.sampleTestCases.length > 0 ? p.sampleTestCases : [{ input: '', expectedOutput: '' }],
          hiddenTestCases: p.hiddenTestCases && p.hiddenTestCases.length > 0 ? p.hiddenTestCases : [{ input: '', expectedOutput: '' }],
          defaultCode: p.defaultCode || { python: '', javascript: '', cpp: '', java: '' }
        });
      } catch (err) {
        console.error('Failed to fetch problem', err);
        alert('Failed to load problem data');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id, user, navigate, isEdit]);

  const handleArrayChange = (field, index, subfield, value) => {
    const newArr = [...formData[field]];
    newArr[index][subfield] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addTestCase = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], { input: '', expectedOutput: '' }] });
  };

  const removeTestCase = (field, index) => {
    const newArr = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArr });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (isEdit) {
        await updateProblem(id, payload);
      } else {
        await createProblem(payload);
      }
      navigate('/admin');
    } catch (err) {
      console.error('Failed to save', err);
      alert(err.response?.data?.message || 'Failed to save problem');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading-spinner loading-spinner-lg"></span></div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 fadeIn">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin')} className="btn btn-ghost p-2">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">{isEdit ? 'Edit Problem' : 'Create New Problem'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" className="input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Difficulty</label>
            <select className="input" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description (Markdown)</label>
          <textarea className="input min-h-[200px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input type="text" className="input" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Time Limit (ms)</label>
            <input type="number" className="input" value={formData.timeLimit} onChange={e => setFormData({...formData, timeLimit: Number(e.target.value)})} />
          </div>
          <div className="form-group">
            <label className="form-label">Method Name</label>
            <input type="text" className="input" value={formData.methodName} onChange={e => setFormData({...formData, methodName: e.target.value})} placeholder="e.g. twoSum" />
          </div>
        </div>

        <div className="border-t border-[rgba(0, 184, 163,0.2)] pt-6">
          <h3 className="text-xl font-bold text-white mb-4">Sample Test Cases</h3>
          {formData.sampleTestCases.map((tc, idx) => (
            <div key={idx} className="flex gap-4 mb-4 items-start">
              <div className="flex-1">
                <input type="text" className="input mb-2" placeholder="Input (e.g. [2,7,11,15]\n9)" value={tc.input} onChange={e => handleArrayChange('sampleTestCases', idx, 'input', e.target.value)} required />
              </div>
              <div className="flex-1">
                <input type="text" className="input" placeholder="Expected Output (e.g. [0,1])" value={tc.expectedOutput} onChange={e => handleArrayChange('sampleTestCases', idx, 'expectedOutput', e.target.value)} required />
              </div>
              <button type="button" onClick={() => removeTestCase('sampleTestCases', idx)} className="btn btn-ghost text-red-400 mt-1">X</button>
            </div>
          ))}
          <button type="button" onClick={() => addTestCase('sampleTestCases')} className="btn btn-outline btn-sm">Add Sample Test Case</button>
        </div>

        <div className="border-t border-[rgba(0, 184, 163,0.2)] pt-6">
          <h3 className="text-xl font-bold text-white mb-4">Hidden Test Cases</h3>
          {formData.hiddenTestCases.map((tc, idx) => (
            <div key={idx} className="flex gap-4 mb-4 items-start">
              <div className="flex-1">
                <input type="text" className="input mb-2" placeholder="Input" value={tc.input} onChange={e => handleArrayChange('hiddenTestCases', idx, 'input', e.target.value)} required />
              </div>
              <div className="flex-1">
                <input type="text" className="input" placeholder="Expected Output" value={tc.expectedOutput} onChange={e => handleArrayChange('hiddenTestCases', idx, 'expectedOutput', e.target.value)} required />
              </div>
              <button type="button" onClick={() => removeTestCase('hiddenTestCases', idx)} className="btn btn-ghost text-red-400 mt-1">X</button>
            </div>
          ))}
          <button type="button" onClick={() => addTestCase('hiddenTestCases')} className="btn btn-outline btn-sm">Add Hidden Test Case</button>
        </div>

        <div className="flex justify-end pt-6">
          <button type="submit" className="btn btn-primary flex items-center gap-2" disabled={submitting}>
            {submitting ? <span className="loading-spinner"></span> : <Save size={18} />}
            {isEdit ? 'Update Problem' : 'Create Problem'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProblemForm;

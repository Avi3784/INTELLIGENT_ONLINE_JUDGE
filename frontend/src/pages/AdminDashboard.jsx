import React, { useState, useEffect } from 'react';
import { getAdminStats, getAdminUsers, toggleUserRole, deleteUser, getProblems, deleteProblem } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Code, Activity, Edit, Trash2, Shield, ShieldOff, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [activeTab, setActiveTab] = useState('problems');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, problemsRes] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getProblems({ limit: 100 })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setProblems(problemsRes.data.problems);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (id) => {
    try {
      await toggleUserRole(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle role');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user and all their submissions?')) {
      try {
        await deleteUser(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteProblem = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        await deleteProblem(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete problem');
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading-spinner loading-spinner-lg"></span></div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Manage problems, users, and view platform statistics.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 flex items-center gap-4">
          <div className="p-4 bg-[rgba(99,102,241,0.1)] rounded-full text-primary">
            <Users size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-wider">Total Users</p>
            <h3 className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</h3>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="p-4 bg-[rgba(16,185,129,0.1)] rounded-full text-emerald-500">
            <Code size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-wider">Total Problems</p>
            <h3 className="text-3xl font-bold text-white">{stats?.totalProblems || 0}</h3>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="p-4 bg-[rgba(245,158,11,0.1)] rounded-full text-amber-500">
            <Activity size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-wider">Total Submissions</p>
            <h3 className="text-3xl font-bold text-white">{stats?.totalSubmissions || 0}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[rgba(99,102,241,0.2)] mb-6">
        <button
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'problems' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('problems')}
        >
          Manage Problems
        </button>
        <button
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
      </div>

      {/* Problems Tab */}
      {activeTab === 'problems' && (
        <div className="card p-6 slideUp">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Coding Problems</h2>
            <Link to="/admin/problems/new" className="btn btn-primary flex items-center gap-2">
              <Plus size={18} /> Add New Problem
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[rgba(99,102,241,0.2)] text-gray-400">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Difficulty</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.map(problem => (
                  <tr key={problem._id} className="border-b border-[rgba(99,102,241,0.1)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-4 text-white font-medium">{problem.title}</td>
                    <td className="py-4">
                      <span className={`badge ${problem.difficulty === 'EASY' ? 'badge-easy' : problem.difficulty === 'MEDIUM' ? 'badge-medium' : 'badge-hard'}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="py-4 flex justify-end gap-2">
                      <Link to={`/admin/problems/${problem._id}/edit`} className="btn btn-ghost btn-sm text-blue-400 hover:text-blue-300">
                        <Edit size={16} />
                      </Link>
                      <button onClick={() => handleDeleteProblem(problem._id)} className="btn btn-ghost btn-sm text-red-400 hover:text-red-300">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card p-6 slideUp">
          <h2 className="text-xl font-bold text-white mb-6">Registered Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[rgba(99,102,241,0.2)] text-gray-400">
                  <th className="pb-3 font-medium">Username</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-[rgba(99,102,241,0.1)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-4 text-white font-medium flex items-center gap-2">
                      {u.avatar && <img src={u.avatar} alt="avatar" className="w-6 h-6 rounded-full" />}
                      {u.username}
                    </td>
                    <td className="py-4 text-gray-300">{u.email}</td>
                    <td className="py-4">
                      {u.isAdmin ? (
                        <span className="badge badge-hard flex items-center gap-1 w-max"><Shield size={12} /> Admin</span>
                      ) : (
                        <span className="badge badge-easy w-max">User</span>
                      )}
                    </td>
                    <td className="py-4 flex justify-end gap-2">
                      {user._id !== u._id && (
                        <>
                          <button onClick={() => handleRoleToggle(u._id)} className="btn btn-ghost btn-sm text-yellow-400 hover:text-yellow-300" title="Toggle Role">
                            {u.isAdmin ? <ShieldOff size={16} /> : <Shield size={16} />}
                          </button>
                          <button onClick={() => handleDeleteUser(u._id)} className="btn btn-ghost btn-sm text-red-400 hover:text-red-300" title="Delete User">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

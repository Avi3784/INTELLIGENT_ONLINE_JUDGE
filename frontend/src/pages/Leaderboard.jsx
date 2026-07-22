import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLeaderboard } from '../services/api';
import { Trophy, Medal } from 'lucide-react';
import '../Leaderboard.css';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await getLeaderboard();
        const sortedUsers = res.data.data || [];
        setUsers(sortedUsers.map((u, i) => ({ ...u, rank: i + 1 })));
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
        setError("Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="p-8 text-center text-[var(--text-secondary)]">Loading leaderboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <Trophy className="w-8 h-8 text-yellow-500" style={{ color: '#eab308', width: '32px', height: '32px' }} />
        <h1 className="leaderboard-title">Global Leaderboard</h1>
      </div>
      
      <div className="leaderboard-card">
        <div className="leaderboard-grid leaderboard-grid-header">
          <div className="text-center">Rank</div>
          <div>User</div>
          <div className="text-right">Problems Solved</div>
        </div>
        
        <div>
          {users.map((user, i) => (
            <motion.div
              key={user.username || i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="leaderboard-grid leaderboard-row"
            >
              <div className="rank-col">
                {user.rank === 1 ? <Medal style={{ width: '24px', height: '24px', color: '#eab308' }} /> :
                 user.rank === 2 ? <Medal style={{ width: '24px', height: '24px', color: '#9ca3af' }} /> :
                 user.rank === 3 ? <Medal style={{ width: '24px', height: '24px', color: '#d97706' }} /> :
                 <span className="rank-text">#{user.rank}</span>}
              </div>
              <div className="user-col">{user.username}</div>
              <div className="score-col">{user.solvedCount}</div>
            </motion.div>
          ))}
          {users.length === 0 && (
            <div className="empty-leaderboard">No users found on the leaderboard.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

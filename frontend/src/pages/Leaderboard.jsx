import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLeaderboard } from '../services/api';
import { Trophy, Medal } from 'lucide-react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setUsers(data || []);
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
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold">Global Leaderboard</h1>
      </div>
      
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[var(--border-color)] font-semibold text-[var(--text-secondary)] bg-opacity-50">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-7">User</div>
          <div className="col-span-3 text-right">Problems Solved</div>
        </div>
        
        <div className="divide-y divide-[var(--border-color)]">
          {users.map((user, i) => (
            <motion.div
              key={user.username || i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-black/5 transition-colors"
            >
              <div className="col-span-2 flex justify-center items-center">
                {user.rank === 1 ? <Medal className="w-6 h-6 text-yellow-500" /> :
                 user.rank === 2 ? <Medal className="w-6 h-6 text-gray-400" /> :
                 user.rank === 3 ? <Medal className="w-6 h-6 text-amber-600" /> :
                 <span className="text-lg font-bold text-[var(--text-secondary)]">#{user.rank}</span>}
              </div>
              <div className="col-span-7 font-medium text-lg">{user.username}</div>
              <div className="col-span-3 text-right font-mono text-xl text-blue-500">{user.solvedCount}</div>
            </motion.div>
          ))}
          {users.length === 0 && (
            <div className="p-8 text-center text-[var(--text-secondary)]">No users found on the leaderboard.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

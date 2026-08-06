import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import { SOCKET_URL } from '../config';

const ARENA_URL = `${SOCKET_URL.replace(/\/$/, '')}/arena`;

const Arena = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [arenaSocket, setArenaSocket] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, waiting, matched
  const [matchData, setMatchData] = useState(null);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const socket = io(ARENA_URL, { withCredentials: true });
    setArenaSocket(socket);

    socket.on('queue_status', (data) => setStatus(data.status));
    
    socket.on('match_found', (data) => {
      setStatus('matched');
      setMatchData(data);
      // In a full implementation, we would redirect to a battle editor here.
    });

    socket.on('match_over', (data) => {
      alert(`Match Over! You ${data.result === 'win' ? 'WON' : 'LOST'}! Elo change: ${data.newElo}`);
      setStatus('idle');
      setMatchData(null);
    });

    return () => socket.disconnect();
  }, [user, navigate]);

  const joinQueue = () => {
    if (arenaSocket && user) {
      arenaSocket.emit('join_queue', { userId: user._id, username: user.username, eloRating: user.eloRating || 1200 });
      setStatus('waiting');
    }
  };

  const leaveQueue = () => {
    if (arenaSocket) {
      arenaSocket.emit('leave_queue');
      setStatus('idle');
    }
  };

return (
    <div className="arena-container dashboard-page fadeIn" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 className="page-title" style={{ justifyContent: 'center' }}>⚔️ 1v1 Code Arena</h1>
      <p className="page-subtitle" style={{ color: 'var(--text-secondary)' }}>Your current ELO: {user?.eloRating || 1200}</p>
      
      {status === 'idle' && (
        <div style={{ marginTop: '2rem' }}>
          <button onClick={joinQueue} className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1.2rem' }}>
            Find Match
          </button>
        </div>
      )}

      {status === 'waiting' && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ color: 'var(--text-primary)' }}>Searching for an opponent...</h2>
          <div style={{ margin: '20px auto' }}>
            <div className="loading-spinner"></div>
          </div>
          <button onClick={leaveQueue} className="btn btn-outline" style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      )}

      {status === 'matched' && matchData && (
        <div className="card" style={{ padding: '2rem', borderRadius: '16px', marginTop: '2rem', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
          <h2 style={{ color: 'var(--color-easy)' }}>Match Found!</h2>
          <h3 style={{ color: 'var(--text-primary)' }}>You vs {matchData.opponent.username} (Elo: {matchData.opponent.eloRating})</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Problem ID: {matchData.problemId}</p>
          <button onClick={() => navigate(`/problems/${matchData.problemId}?matchId=${matchData.matchId}`)} className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1.2rem' }}>
            Enter Battle
          </button>
        </div>
      )}
    </div>
  );
};

export default Arena;

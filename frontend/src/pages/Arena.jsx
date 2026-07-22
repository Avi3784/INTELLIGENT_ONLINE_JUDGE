import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const ARENA_URL = 'http://localhost:5000/arena';

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
      alert(\`Match Over! You \${data.result === 'win' ? 'WON' : 'LOST'}! Elo change: \${data.newElo}\`);
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
    <div className="arena-container" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>⚔️ 1v1 Code Arena</h1>
      <p>Your current ELO: {user?.eloRating || 1200}</p>
      
      {status === 'idle' && (
        <button onClick={joinQueue} style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px' }}>
          Find Match
        </button>
      )}

      {status === 'waiting' && (
        <div>
          <h2>Searching for an opponent...</h2>
          <div className="spinner" style={{ margin: '20px auto' }}>🔄</div>
          <button onClick={leaveQueue} style={{ padding: '10px 20px', cursor: 'pointer' }}>Cancel</button>
        </div>
      )}

      {status === 'matched' && matchData && (
        <div style={{ background: '#2c3e50', padding: '2rem', borderRadius: '10px', color: 'white' }}>
          <h2>Match Found!</h2>
          <h3>You vs {matchData.opponent.username} (Elo: {matchData.opponent.eloRating})</h3>
          <p>Problem ID: {matchData.problemId}</p>
          <button onClick={() => navigate(\`/problems/\${matchData.problemId}?matchId=\${matchData.matchId}\`)} style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px' }}>
            Enter Battle
          </button>
        </div>
      )}
    </div>
  );
};

export default Arena;

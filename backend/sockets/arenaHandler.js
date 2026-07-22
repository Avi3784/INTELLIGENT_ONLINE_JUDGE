const User = require('../models/User');
const Problem = require('../models/Problem');
const crypto = require('crypto');

// Simple in-memory queue and match storage for MVP
const waitingPlayers = [];
const activeMatches = new Map();

module.exports = (io) => {
  const arenaNamespace = io.of('/arena');

  arenaNamespace.on('connection', (socket) => {
    
    socket.on('join_queue', async (data) => {
      const { userId, username, eloRating } = data;
      
      // Remove if already in queue
      const existingIndex = waitingPlayers.findIndex(p => p.userId === userId);
      if (existingIndex !== -1) waitingPlayers.splice(existingIndex, 1);

      waitingPlayers.push({ socketId: socket.id, userId, username, eloRating });
      socket.emit('queue_status', { status: 'waiting' });

      // Check if we can make a match (for MVP, any 2 players. For prod, we'd check ELO difference)
      if (waitingPlayers.length >= 2) {
        const player1 = waitingPlayers.shift();
        const player2 = waitingPlayers.shift();

        // Pick a random problem (Easy/Medium)
        const problems = await Problem.find({ difficulty: { $in: ['Easy', 'Medium'] } });
        const randomProblem = problems.length > 0 ? problems[Math.floor(Math.random() * problems.length)] : null;
        
        if (!randomProblem) {
          // If no problems exist in DB, abort
          return; 
        }

        const matchId = crypto.randomUUID();
        const matchData = {
          matchId,
          problemId: randomProblem._id,
          players: [
            { userId: player1.userId, username: player1.username, socketId: player1.socketId, progress: 'Started' },
            { userId: player2.userId, username: player2.username, socketId: player2.socketId, progress: 'Started' }
          ],
          status: 'active'
        };
        
        activeMatches.set(matchId, matchData);

        // Notify Player 1
        arenaNamespace.to(player1.socketId).emit('match_found', {
          matchId,
          problemId: randomProblem._id,
          opponent: { username: player2.username, eloRating: player2.eloRating }
        });

        // Notify Player 2
        arenaNamespace.to(player2.socketId).emit('match_found', {
          matchId,
          problemId: randomProblem._id,
          opponent: { username: player1.username, eloRating: player1.eloRating }
        });
      }
    });

    socket.on('leave_queue', () => {
      const existingIndex = waitingPlayers.findIndex(p => p.socketId === socket.id);
      if (existingIndex !== -1) waitingPlayers.splice(existingIndex, 1);
    });

    socket.on('match_progress', (data) => {
      const { matchId, userId, progress } = data;
      const match = activeMatches.get(matchId);
      if (match && match.status === 'active') {
        const opponent = match.players.find(p => p.userId !== userId);
        if (opponent) {
          // Forward progress to opponent
          arenaNamespace.to(opponent.socketId).emit('opponent_progress', { progress });
        }
      }
    });

    socket.on('match_complete', async (data) => {
      const { matchId, winnerId } = data;
      const match = activeMatches.get(matchId);
      
      if (match && match.status === 'active') {
        match.status = 'finished';
        const winner = match.players.find(p => p.userId === winnerId);
        const loser = match.players.find(p => p.userId !== winnerId);
        
        if (winner && loser) {
          // Calculate ELO (simplified: +25 for win, -25 for loss)
          await User.findByIdAndUpdate(winner.userId, { $inc: { eloRating: 25, matchesWon: 1 } });
          await User.findByIdAndUpdate(loser.userId, { $inc: { eloRating: -25, matchesLost: 1 } });
          
          arenaNamespace.to(winner.socketId).emit('match_over', { result: 'win', newElo: 25 });
          arenaNamespace.to(loser.socketId).emit('match_over', { result: 'loss', newElo: -25 });
        }
      }
    });

    socket.on('disconnect', () => {
      // Remove from queue
      const existingIndex = waitingPlayers.findIndex(p => p.socketId === socket.id);
      if (existingIndex !== -1) waitingPlayers.splice(existingIndex, 1);
      
      // Auto-lose active matches if disconnect
      for (const [matchId, match] of activeMatches.entries()) {
        if (match.status === 'active') {
          const disconnectedPlayer = match.players.find(p => p.socketId === socket.id);
          if (disconnectedPlayer) {
            match.status = 'finished';
            const winner = match.players.find(p => p.socketId !== socket.id);
            if (winner) {
               arenaNamespace.to(winner.socketId).emit('match_over', { result: 'win', reason: 'opponent_disconnected', newElo: 15 });
               User.findByIdAndUpdate(winner.userId, { $inc: { eloRating: 15, matchesWon: 1 } }).catch(() => {});
            }
          }
        }
      }
    });
  });
};

import { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TrackerSystem = ({ problems }) => {
  const { user } = useAuth();
  
  // Safely default solvedProblems to an empty array
  const solvedProblemIds = user?.solvedProblems || [];
  
  // Calculate stats based on solved problems
  const stats = useMemo(() => {
    let easy = 0;
    let medium = 0;
    let hard = 0;

    solvedProblemIds.forEach(id => {
      // Handle case where solvedProblem is an object (populated) or just string ID
      const problemId = typeof id === 'object' ? id._id : id;
      const problem = problems.find(p => p._id === problemId);
      
      if (problem) {
        if (problem.difficulty === 'EASY') easy++;
        else if (problem.difficulty === 'MEDIUM') medium++;
        else if (problem.difficulty === 'HARD') hard++;
      }
    });

    const totalEasy = problems.filter(p => p.difficulty === 'EASY').length || 1;
    const totalMedium = problems.filter(p => p.difficulty === 'MEDIUM').length || 1;
    const totalHard = problems.filter(p => p.difficulty === 'HARD').length || 1;

    return {
      easy: { solved: easy, total: totalEasy, percent: (easy / totalEasy) * 100 },
      medium: { solved: medium, total: totalMedium, percent: (medium / totalMedium) * 100 },
      hard: { solved: hard, total: totalHard, percent: (hard / totalHard) * 100 },
      totalSolved: easy + medium + hard,
    };
  }, [solvedProblemIds, problems]);


  return (
    <div className="tracker-system" style={{ padding: '0 0 24px 0', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      
      {/* Left: Stats Rings */}
      <div style={{ flex: '1', minWidth: '300px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--text-primary)' }}>
          <Trophy size={20} style={{ color: 'var(--primary)' }} /> Your Progress
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="stat-row">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--color-easy)', fontWeight: 'bold' }}>Easy</span>
              <span style={{ color: 'var(--text-secondary)' }}>{stats.easy.solved} / {stats.easy.total}</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${stats.easy.percent}%`, height: '100%', backgroundColor: 'var(--color-easy)', transition: 'width 1s ease' }} />
            </div>
          </div>

          <div className="stat-row">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--color-medium)', fontWeight: 'bold' }}>Medium</span>
              <span style={{ color: 'var(--text-secondary)' }}>{stats.medium.solved} / {stats.medium.total}</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${stats.medium.percent}%`, height: '100%', backgroundColor: 'var(--color-medium)', transition: 'width 1s ease' }} />
            </div>
          </div>

          <div className="stat-row">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--color-hard)', fontWeight: 'bold' }}>Hard</span>
              <span style={{ color: 'var(--text-secondary)' }}>{stats.hard.solved} / {stats.hard.total}</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${stats.hard.percent}%`, height: '100%', backgroundColor: 'var(--color-hard)', transition: 'width 1s ease' }} />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default TrackerSystem;

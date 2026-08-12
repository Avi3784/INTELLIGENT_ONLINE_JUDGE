import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { API } from './services/api'
import './App.css'
import './new_styles.css'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import Navbar from './components/Navbar'
import LiveChat from './components/LiveChat'
import ProtectedRoute from './components/ProtectedRoute'
import Chatbot from './components/Chatbot'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProblemDetail from './pages/ProblemDetail'
import Profile from './pages/Profile'
import Leaderboard from './pages/Leaderboard'
import AlgorithmVisualizer from './pages/AlgorithmVisualizer'
import OAuthCallback from './pages/OAuthCallback'
import AdminDashboard from './pages/AdminDashboard'
import AdminProblemForm from './pages/AdminProblemForm'

function App() {
  const [isWakingServer, setIsWakingServer] = useState(false);
  const [serverAwake, setServerAwake] = useState(false);

  useEffect(() => {
    // Ping the backend to wake it up and track latency
    const pingBackend = async () => {
      const startTime = Date.now();
      let timer;
      
      try {
        // If request takes longer than 1s, show the waking state
        timer = setTimeout(() => {
          if (!serverAwake) setIsWakingServer(true);
        }, 1000);

        await API.get('/problems'); // lightweight public endpoint
        
        clearTimeout(timer);
        setServerAwake(true);
        setIsWakingServer(false);
      } catch (err) {
        clearTimeout(timer);
        setServerAwake(true); // Treat as awake even on error to let normal app handle it
        setIsWakingServer(false);
      }
    };

    pingBackend();
  }, []);

  return (
    <BrowserRouter>
      {isWakingServer && (
        <div className="server-wake-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(11, 14, 20, 0.95)', zIndex: 9999, 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="loading-spinner" style={{ width: '50px', height: '50px', marginBottom: '20px' }}></div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Waking up the server...</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', textAlign: 'center' }}>
            Our backend runs on a free Render tier which spins down when idle. 
            It might take up to 50 seconds to wake up on your first visit. Hang tight!
          </p>
        </div>
      )}
      <AuthProvider>
        <SocketProvider>
          <Navbar />
          <LiveChat />
          <Chatbot />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/oauth-callback" element={<OAuthCallback />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/problems/:id" element={<ProtectedRoute><ProblemDetail /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/visualizer" element={<AlgorithmVisualizer />} />              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/problems/new" element={<ProtectedRoute><AdminProblemForm /></ProtectedRoute>} />
              <Route path="/admin/problems/:id/edit" element={<ProtectedRoute><AdminProblemForm /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

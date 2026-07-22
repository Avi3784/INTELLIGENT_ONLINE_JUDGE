import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './new_styles.css'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import Navbar from './components/Navbar'
import LiveChat from './components/LiveChat'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProblemDetail from './pages/ProblemDetail'
import Profile from './pages/Profile'
import Leaderboard from './pages/Leaderboard'
import AlgorithmVisualizer from './pages/AlgorithmVisualizer'
import ProtectedRoute from './components/ProtectedRoute'
import OAuthCallback from './pages/OAuthCallback'
import AdminDashboard from './pages/AdminDashboard'
import AdminProblemForm from './pages/AdminProblemForm'
import Arena from './pages/Arena'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Navbar />
          <LiveChat />

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
              <Route path="/visualizer" element={<AlgorithmVisualizer />} />
              <Route path="/arena" element={<Arena />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
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

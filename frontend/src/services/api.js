import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
})

// Attach JWT token from localStorage to every outgoing request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const getMe = () => API.get('/auth/me')

export const getProblems = (params) => API.get('/problems', { params })
export const getProblemById = (id) => API.get(`/problems/${id}`)

export const submitCode = (data) => API.post('/submissions', data)
export const runCode = (data) => API.post('/submissions/run', data)
export const getSubmissions = (params) => API.get('/submissions', { params })
export const getSubmissionById = (id) => API.get(`/submissions/${id}`)

export const getAIFeedback = (data) => API.post('/ai/feedback', data)

export const getUserProfile = () => API.get('/users/profile')
export const getLeaderboard = () => API.get('/users/leaderboard')

export const getSolutions = (problemId) => API.get(`/solutions/problem/${problemId}`)
export const postSolution = (data) => API.post('/solutions', data)
export const upvoteSolution = (id) => API.put(`/solutions/${id}/upvote`)

// Admin Routes
export const getAdminStats = () => API.get('/admin/stats')
export const getAdminUsers = () => API.get('/admin/users')
export const toggleUserRole = (id) => API.put(`/admin/users/${id}/role`)
export const deleteUser = (id) => API.delete(`/admin/users/${id}`)

export const createProblem = (data) => API.post('/problems', data)
export const updateProblem = (id, data) => API.put(`/problems/${id}`, data)
export const deleteProblem = (id) => API.delete(`/problems/${id}`)

export default API

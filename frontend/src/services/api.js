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

export default API

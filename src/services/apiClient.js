import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, 
  headers: {
    Accept: 'application/json',
  },
})

if (import.meta.env.VITE_API_KEY) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${import.meta.env.VITE_API_KEY}`
}

export default apiClient
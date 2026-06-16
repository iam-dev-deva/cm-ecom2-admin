import axios from 'axios'

const STORAGE_KEY = 'cmAdminUser'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '',
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(
  (config) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const user = saved ? JSON.parse(saved) : null
      if (user && user.token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${user.token}`
      }
    } catch (e) {
      console.log(e);
      
      // ignore
    }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(error)
  }
)

export default instance

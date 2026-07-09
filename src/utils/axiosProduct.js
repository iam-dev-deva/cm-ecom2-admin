import axios from 'axios'
import AuthToken from './AuthToken.js'

const STORAGE_KEY = 'cmAdminUser'

const instance = axios.create({
  baseURL: "https://rudra.circlemark.in"+"/ProductServices/api",
  headers: {
    'Content-Type': 'application/json',
  },
})

// Toggle for testing: set to true to send the raw token instead of encrypted.
const USE_PLAIN_TOKEN = false

instance.interceptors.request.use(
  (config) => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      const user = saved ? JSON.parse(saved) : null
      if (user && (user.token || user.JWTToken)) {
        config.headers = config.headers || {}

        // Always log the stored user for diagnosis
        console.log('Saved user object (request):', user)

        const tokenValue = user.token || user.JWTToken
         config.headers["USERID"] = "1";
        if (USE_PLAIN_TOKEN) {
          config.headers["JwtToken"] = tokenValue
        } else {
          config.headers["JwtToken"] = AuthToken.encryptToken(tokenValue)
        }
      }
    } catch (e) {
      console.error('Token header setup failed:', e)
    }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config

    // Retry logic: stop after MAX_RETRIES attempts with incremental delay
    const MAX_RETRIES = 3
    const BASE_DELAY_MS = 300

    function wait(ms) {
      return new Promise((res) => setTimeout(res, ms))
    }

    if (config) {
      config.__retryCount = config.__retryCount || 0

      const status = error?.response?.status
      const isServerError = !status || status >= 500
      const method = (config.method || '').toLowerCase()
      const retryableMethods = ['get', 'put', 'delete', 'head', 'options']

      if (isServerError && config.__retryCount < MAX_RETRIES && retryableMethods.includes(method)) {
        config.__retryCount += 1
        const delay = BASE_DELAY_MS * config.__retryCount
        console.warn(`Request failed (attempt ${config.__retryCount}), retrying after ${delay}ms`)
        await wait(delay)
        return instance(config)
      }
    }

    if (error?.response?.status === 401) {
      try {
        sessionStorage.removeItem(STORAGE_KEY)
      } catch (e) {
        // ignore
      }

      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default instance

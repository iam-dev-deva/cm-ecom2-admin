import axios from 'axios'
import { encryptToken, decryptToken } from './AuthToken.js'

const STORAGE_KEY = 'cmAdminUser'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '',
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
      if (user && user.token) {
        config.headers = config.headers || {}

        // Always log the stored user for diagnosis
        console.log('Saved user object (request):', user)

        if (USE_PLAIN_TOKEN) {
          config.headers.JwtToken = decryptToken(user.JWTToken)
        } else {
          // config.headers.JwtToken = encryptToken(user.token)
          config.headers.JwtToken = decryptToken(user.JWTToken)

        }

        // Log raw header value and attempted decryption
        try {
          console.log('Raw JwtToken header:', config.headers.JwtToken)
          console.log('Decrypted JwtToken:', decryptToken(config.headers.JwtToken))
        } catch (e) {
          console.error('Decrypt log failed:', e)
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
    }

    return Promise.reject(error)
  }
)

export default instance

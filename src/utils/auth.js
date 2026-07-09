import axios from './axiosProduct.js'
import AuthToken from './AuthToken.js'

const STORAGE_KEY = 'cmAdminUser'
const LOGIN_URL = 'https://rudra.circlemark.in/AdminServices/api/user/getuserInfo'

export function saveUser(user) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function getDecryptedStoredToken() {
  const saved = sessionStorage.getItem(STORAGE_KEY)
  const user = saved ? JSON.parse(saved) : null
  console.log('user object:', user?.JWTToken)
  const cipherText = user?.JWTToken || ''
  if (!cipherText) return ''

  try {
    console.info("token:", AuthToken.encryptToken(cipherText))
    return AuthToken.encryptToken(cipherText)
  } catch (e) {
    console.error('Failed to decrypt stored token:', e)
    return ''
  }
}

export function getStoredUser() {
  const saved = sessionStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : null
}

export function isAuthenticated() {
  return Boolean(getStoredUser());
}

export function logout() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export async function loginUser(credentials) {
  try {
    const response = await axios.post(LOGIN_URL, credentials);
    return response.data;
  } catch (err) {
    if (err.response) {
      const message = err.response.data?.message || err.response.statusText;
      throw new Error(` ${message}`|| 'Login failed. Please verify your credentials.');
    }
    throw err;
  }
}

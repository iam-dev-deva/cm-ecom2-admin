import axios from './axios'

const STORAGE_KEY = 'cmAdminUser'
const LOGIN_URL = 'https://rudra.circlemark.in/AdminServices/api/user/getuserInfo'

export function saveUser(user) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
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

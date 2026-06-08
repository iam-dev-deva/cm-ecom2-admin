const STORAGE_KEY = 'cmAdminUser'
const LOGIN_URL = 'http://rudra.circlemark.in/AdminServices/api/user/getuserInfo'

export function saveUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function getStoredUser() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? JSON.parse(saved) : null
}

export function isAuthenticated() {
  return Boolean(getStoredUser())
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY)
}

export async function loginUser(credentials) {
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Login request failed: ${response.status} ${text}`)
  }

  return response.json()
}

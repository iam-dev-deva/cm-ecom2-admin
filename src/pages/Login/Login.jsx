import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { isAuthenticated, loginUser, saveUser } from '../../utils/auth'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ CompId: 1, UserName: 'Ai', Password: 'Ai123' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'CompId' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await loginUser(form)
      if (response.success && response.data) {
        saveUser(response.data)
        navigate('/dashboard', { replace: true })
      } else {
        setError(response.message || 'Login failed. Please verify your credentials.')
      }
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to connect to the login service.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        {error && <div className="login-error">{error}</div>}
        <label>
          Company ID
          <input
            name="CompId"
            type="number"
            value={form.CompId}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Username
          <input
            name="UserName"
            type="text"
            value={form.UserName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password
          <input
            name="Password"
            type="password"
            value={form.Password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

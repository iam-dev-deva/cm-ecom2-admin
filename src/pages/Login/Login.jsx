import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { isAuthenticated, loginUser, saveUser } from '../../utils/auth'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ CompId: 1, UserName: '', Password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
    <div className={styles.login_page}>
      <form className={styles.login_form} onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        {error && <div className={styles.login_error}>{error}</div>}
        <div className={styles.input_group}>
          <span className={styles.login_s}>
            Username
          </span>
          <input
            name="UserName"
            type="text"
            value={form.UserName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.input_group}>
          <span className={styles.login_label}>
            Password
          </span>
          <div className={styles.password_wrapper}>
            <input
              name="Password"
              type={showPassword ? "text" : "password"}
              value={form.Password}
              onChange={handleChange}
              required
            />

            <span
              className={styles.password_toggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button type="submit" disabled={loading} className={styles.login_button}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <div className={styles.checkbox_group}>
          <input type="checkbox" id="Remember_me" />
          <label htmlFor="Remember_me">
            Remember me
          </label>
        </div>

        <p>Don’t have an acount?  <span className={styles.signup_link} onClick={() => navigate('/signup')}>
          Sign up
        </span></p>
      </form>
    </div>
  )
}

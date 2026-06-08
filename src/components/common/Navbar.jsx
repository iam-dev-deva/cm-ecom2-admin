import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { getStoredUser, logout } from '../../utils/auth'

const activeStyle = {
  fontWeight: 'bold',
  textDecoration: 'underline',
}

export default function Navbar() {
  const navigate = useNavigate()
  const user = getStoredUser()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-title">Circlemark Admin</span>
        {user?.UserName && <span className="navbar-user">Welcome, {user.UserName}</span>}
      </div>
      <nav className="navbar-links">
        <NavLink to="/dashboard" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
          Dashboard
        </NavLink>
        <NavLink to="/products" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
          Products
        </NavLink>
        <NavLink to="/categories" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
          Categories
        </NavLink>
        <NavLink to="/orders" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
          Orders
        </NavLink>
        <NavLink to="/settings" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
          Settings
        </NavLink>
      </nav>
      <button type="button" className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </header>
  )
}

import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { getStoredUser, logout } from '../../utils/auth'

const activeStyle = {
  
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
        <span className="navbar-title">Ecom Admin</span>
        {user?.UserName && <span className="navbar-user">Welcome, {user.UserName}</span>}
      </div>
      <nav className="navbar-links">
        <NavLink to="/dashboard"  className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/products"  className={({ isActive }) => (isActive ? "active" : "")}>
          Products
        </NavLink>
        <NavLink to="/categories"  className={({ isActive }) => (isActive ? "active" : "")}>
          Categories
        </NavLink>
        <NavLink to="/orders"  className={({ isActive }) => (isActive ? "active" : "")}>
          Orders
        </NavLink>
        <NavLink to="/settings"  className={({ isActive }) => (isActive ? "active" : "")}>
          Settings
        </NavLink>
      </nav>
      <button type="button" className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </header>
  )
}

import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Navigation</span>
      </div>
      <nav className="sidebar-links">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Dashboard
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Products
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Categories
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Orders
        </NavLink>
        <NavLink to="/customers" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Customers
        </NavLink>
        <NavLink to="/coupons" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Coupons
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Reports
        </NavLink>
      </nav>
    </aside>
  )
}

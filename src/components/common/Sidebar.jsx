import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <span className="sidebar-title">Menu</span>
        <button className="close-sidebar" onClick={() => onClose && onClose()} aria-label="Close sidebar">×</button>
      </div>
      <nav className="sidebar-links">
        <NavLink to="/dashboard" onClick={() => onClose && onClose()} className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Dashboard
        </NavLink>
        <NavLink to="/products" onClick={() => onClose && onClose()} className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Products
        </NavLink>
        <NavLink to="/categories" onClick={() => onClose && onClose()} className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Categories
        </NavLink>
        <NavLink to="/orders" onClick={() => onClose && onClose()} className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Orders
        </NavLink>
        <NavLink to="/customers" onClick={() => onClose && onClose()} className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Customers
        </NavLink>
        <NavLink to="/coupons" onClick={() => onClose && onClose()} className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Coupons
        </NavLink>
        <NavLink to="/reports" onClick={() => onClose && onClose()} className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Reports
        </NavLink>
      </nav>
    </aside>
  )
}

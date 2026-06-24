import React, { useState } from 'react'
import { PiArrowBendDownRightFill } from 'react-icons/pi';
import { NavLink } from 'react-router-dom'

export default function Sidebar({ isOpen, onClose }) {
  const [mainOpen, setMainOpen] = useState(false)
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
        <div className="sidebar-link sidebar-parent">
          <div
            type="button"
            className={`parent-toggle ${mainOpen ? 'open' : ''}`}
            onClick={() => setMainOpen((s) => !s)}
            aria-expanded={mainOpen}
          >
            <span>Main</span>
          </div>
          <div className={`submenu ${mainOpen ? 'open' : ''}`}>
            <NavLink to="/products" onClick={() => { setMainOpen(false); onClose && onClose() }} className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
            <PiArrowBendDownRightFill />  Products
            </NavLink>
            <NavLink to="/categories" onClick={() => { setMainOpen(false); onClose && onClose() }} className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
            <PiArrowBendDownRightFill />  Categories
            </NavLink>
          </div>
        </div>
        <NavLink to="/orders" onClick={() => onClose && onClose()} className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Orders
        </NavLink>
        {/* <NavLink to="/customers" onClick={() => onClose && onClose()} className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Customers
        </NavLink>
        <NavLink to="/coupons" onClick={() => onClose && onClose()} className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Coupons
        </NavLink>
        <NavLink to="/reports" onClick={() => onClose && onClose()} className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Reports
        </NavLink> */}
      </nav>
    </aside>
  )
}

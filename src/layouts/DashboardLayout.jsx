import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // close sidebar on route change (mobile UX)
    setSidebarOpen(false)
  }, [location])
  return (
    <div className="dashboard-layout">
      <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <div className="dashboard-content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

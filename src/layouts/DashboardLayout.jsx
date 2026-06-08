import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Navbar />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  )
}

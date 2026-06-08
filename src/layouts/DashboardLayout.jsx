import React from 'react'
import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      {/* Add dashboard layout components here */}
      <Outlet />
    </div>
  )
}

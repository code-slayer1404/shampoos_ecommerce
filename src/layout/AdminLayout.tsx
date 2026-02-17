import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminTopbar } from './AdminTopbar'
import { ToastSystem } from '../components/ui/ToastSystem'

const AdminLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} collapsed={collapsed} />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminTopbar onMenuClick={() => setDrawerOpen(true)} onToggleCollapse={() => setCollapsed((prev) => !prev)} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <ToastSystem />
    </div>
  )
}

export default AdminLayout

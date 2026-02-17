import { NavLink } from 'react-router-dom'
import { FiGrid, FiPackage, FiShoppingCart, FiUsers, FiX } from 'react-icons/fi'

const links = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/products', label: 'Products', icon: FiPackage },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingCart },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
]

interface Props {
  open: boolean
  collapsed: boolean
  onClose: () => void
}

export const AdminSidebar = ({ open, collapsed, onClose }: Props) => (
  <>
    <div className={`fixed inset-0 z-30 bg-black/40 lg:hidden ${open ? 'block' : 'hidden'}`} onClick={onClose} />
    <aside className={`fixed left-0 top-0 z-40 h-full bg-slate-900 text-white transition-all duration-200 lg:static ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
        <span className={`${collapsed ? 'hidden' : 'block'} font-semibold`}>Admin Panel</span>
        <button className="lg:hidden" onClick={onClose}><FiX /></button>
      </div>
      <nav className="space-y-1 p-3">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              end={link.end}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-slate-700' : 'hover:bg-slate-800'}`}
            >
              <Icon />
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  </>
)

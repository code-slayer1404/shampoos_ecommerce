import { FiLogOut, FiMenu } from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'

interface Props {
  onMenuClick: () => void
  onToggleCollapse: () => void
}

export const AdminTopbar = ({ onMenuClick, onToggleCollapse }: Props) => {
  const { logout, user } = useAuth()

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <button onClick={onMenuClick} className="rounded p-2 hover:bg-slate-100 lg:hidden"><FiMenu /></button>
        <button onClick={onToggleCollapse} className="hidden rounded p-2 hover:bg-slate-100 lg:block"><FiMenu /></button>
        <p className="text-sm text-slate-500">{user?.email}</p>
      </div>
      <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
        <FiLogOut /> Logout
      </button>
    </header>
  )
}

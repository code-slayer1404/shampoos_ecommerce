import { useEffect, useMemo, useState } from 'react'
import { adminService, AppUser } from '../../services/adminService'
import { Table } from '../../components/ui/Table'
import { Button } from '../../components/ui/Button'
import { useToastContext } from '../../hooks/useToastContext'

const UsersPage = () => {
  const { showToast } = useToastContext()
  const [users, setUsers] = useState<AppUser[]>([])

  const loadUsers = async () => {
    const response = await adminService.getUsers()
    setUsers(response.items)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const toggleBlock = async (user: AppUser) => {
    try {
      await adminService.updateUser(user._id, { isBlocked: !user.isBlocked })
      showToast('success', `User ${user.isBlocked ? 'unblocked' : 'blocked'}.`)
      loadUsers()
    } catch {
      showToast('error', 'Failed to update user.')
    }
  }

  const columns = useMemo(() => [
    { header: 'Name', key: 'name', render: (row: AppUser) => row.name },
    { header: 'Email', key: 'email', render: (row: AppUser) => row.email },
    {
      header: 'Status',
      key: 'status',
      render: (row: AppUser) => (
        <span className={`rounded-full px-2 py-1 text-xs ${row.isBlocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
          {row.isBlocked ? 'Blocked' : 'Active'}
        </span>
      ),
    },
    {
      header: 'Action',
      key: 'action',
      render: (row: AppUser) => (
        <Button variant="secondary" onClick={() => toggleBlock(row)}>{row.isBlocked ? 'Unblock' : 'Block'}</Button>
      ),
    },
  ], [])

  return <section><h1 className="mb-4 text-xl font-semibold">Users</h1><Table columns={columns} data={users} /></section>
}

export default UsersPage

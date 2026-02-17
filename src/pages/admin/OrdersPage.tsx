import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminService, Order } from '../../services/adminService'
import { Table } from '../../components/ui/Table'

const badgeMap: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    adminService.getOrders().then((response) => setOrders(response.items))
  }, [])

  const columns = useMemo(() => [
    { header: 'Order ID', key: 'id', render: (row: Order) => row._id },
    { header: 'Customer', key: 'customer', render: (row: Order) => row.user?.name || row.user?.email || '-' },
    { header: 'Total', key: 'total', render: (row: Order) => `$${row.totalPrice}` },
    {
      header: 'Status',
      key: 'status',
      render: (row: Order) => (
        <span className={`rounded-full px-2 py-1 text-xs ${badgeMap[row.status?.toLowerCase()] || 'bg-slate-100 text-slate-600'}`}>{row.status}</span>
      ),
    },
    { header: 'Action', key: 'action', render: (row: Order) => <Link className="text-slate-900 underline" to={`/admin/orders/${row._id}`}>View</Link> },
  ], [])

  return <section><h1 className="mb-4 text-xl font-semibold">Orders</h1><Table columns={columns} data={orders} /></section>
}

export default OrdersPage

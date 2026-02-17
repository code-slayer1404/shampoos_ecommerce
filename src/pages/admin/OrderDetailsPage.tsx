import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { adminService, Order } from '../../services/adminService'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useToastContext } from '../../hooks/useToastContext'

const OrderDetailsPage = () => {
  const { id = '' } = useParams()
  const { showToast } = useToastContext()
  const [order, setOrder] = useState<Order | null>(null)
  const [status, setStatus] = useState('')
  const [trackingId, setTrackingId] = useState('')

  useEffect(() => {
    adminService.getOrderDetails(id).then((response) => {
      setOrder(response)
      setStatus(response.status)
      setTrackingId(response.trackingId || '')
    })
  }, [id])

  const onSave = async () => {
    try {
      const updated = await adminService.updateOrder(id, { status, trackingId })
      setOrder(updated)
      showToast('success', 'Order updated.')
    } catch {
      showToast('error', 'Failed to update order.')
    }
  }

  if (!order) return <p>Loading order...</p>

  return (
    <section className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
      <h1 className="text-xl font-semibold">Order {order._id}</h1>
      <p className="text-sm text-slate-500">Customer: {order.user?.name || order.user?.email || '-'}</p>
      <div className="grid gap-3 md:grid-cols-2">
        <Input label="Status" value={status} onChange={(e) => setStatus(e.target.value)} />
        <Input label="Tracking ID" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} />
      </div>
      <Button onClick={onSave}>Update Status</Button>
    </section>
  )
}

export default OrderDetailsPage

import { useEffect, useState } from 'react'
import { adminService, DashboardStats } from '../../services/adminService'

const SkeletonCard = () => <div className="h-24 animate-pulse rounded-xl bg-slate-200" />

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await adminService.getDashboard()
        setStats(response)
      } catch {
        setError('Failed to load dashboard.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  if (isLoading) {
    return <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
  }

  if (error) {
    return <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
  }

  const cards = [
    { label: 'Total Orders', value: stats?.totalOrders ?? 0 },
    { label: 'Total Products', value: stats?.totalProducts ?? 0 },
    { label: 'Total Users', value: stats?.totalUsers ?? 0 },
    { label: 'Revenue', value: `$${stats?.revenue ?? 0}` },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.label} className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="mt-2 text-2xl font-semibold">{card.value}</p>
        </article>
      ))}
    </div>
  )
}

export default DashboardPage

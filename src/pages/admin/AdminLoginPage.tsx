import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const AdminLoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await login(form.email, form.password)
      navigate('/admin', { replace: true })
    } catch {
      setError('Invalid credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-6 text-2xl font-semibold">Admin Login</h1>
        <div className="space-y-4">
          <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
          <Input label="Password" type="password" required value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" isLoading={isSubmitting} className="w-full">Sign In</Button>
        </div>
      </form>
    </div>
  )
}

export default AdminLoginPage

import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
    <input
      className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-slate-500 ${error ? 'border-red-500' : 'border-slate-300'} ${className}`}
      {...props}
    />
    {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
  </label>
)

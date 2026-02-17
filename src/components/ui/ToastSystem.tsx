import { useToastContext } from '../../hooks/useToastContext'

export const ToastSystem = () => {
  const { toasts, removeToast } = useToastContext()

  return (
    <div className="fixed right-4 top-4 z-[60] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`min-w-60 rounded-lg px-4 py-3 text-sm text-white shadow ${toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-slate-800'}`}
        >
          <div className="flex items-center justify-between gap-4">
            <p>{toast.message}</p>
            <button onClick={() => removeToast(toast.id)}>✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}

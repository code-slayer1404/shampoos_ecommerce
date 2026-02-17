export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' }) => {
  const classes = size === 'sm' ? 'h-4 w-4 border-2' : 'h-8 w-8 border-[3px]'
  return <span className={`inline-block animate-spin rounded-full border-slate-200 border-t-slate-600 ${classes}`} />
}

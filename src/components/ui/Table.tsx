import { ReactNode } from 'react'

interface Column<T> {
  header: string
  key: string
  render: (row: T) => ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  emptyText?: string
}

export const Table = <T extends { _id?: string }>({ columns, data, emptyText = 'No data found.' }: TableProps<T>) => (
  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
    <table className="min-w-full text-left text-sm">
      <thead className="bg-slate-50 text-slate-500">
        <tr>
          {columns.map((column) => (
            <th key={column.key} className="px-4 py-3 font-medium">{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={row._id || idx} className="border-t border-slate-100">
            {columns.map((column) => (
              <td key={column.key} className="px-4 py-3">{column.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    {data.length === 0 && <p className="p-4 text-sm text-slate-500">{emptyText}</p>}
  </div>
)

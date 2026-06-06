'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface DataItem {
  id: string
  label: string
  value: number
  category: string
  timestamp: Date
}

interface DataTableProps {
  items: DataItem[]
  total: number
  page: number
  totalPages: number
  query: string
}

export function DataTable({
  items,
  total,
  page,
  totalPages,
  query,
}: DataTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          current.set(key, value)
        } else {
          current.delete(key)
        }
      })
      return current.toString()
    },
    [searchParams]
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const qs = createQueryString({ q: value, page: '1' })
    router.push(`${pathname}?${qs}`)
  }

  const handleNextPage = () => {
    const qs = createQueryString({ page: String(page + 1) })
    router.push(`${pathname}?${qs}`)
  }

  const handlePrevPage = () => {
    const qs = createQueryString({ page: String(page - 1) })
    router.push(`${pathname}?${qs}`)
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search items..."
          defaultValue={query}
          onChange={handleSearch}
          data-testid="search-input"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="divide-y divide-gray-100">
        {items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No items found for &ldquo;{query}&rdquo;
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              data-testid="list-item"
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{item.value.toLocaleString()}</p>
                <p className="text-xs text-gray-400">
                  {new Date(item.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Showing {items.length} of {total} items
        </p>
        <div className="flex gap-2">
          <button
            onClick={handlePrevPage}
            disabled={page <= 1}
            data-testid="prev-page-button"
            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="px-3 py-1 text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages}
            data-testid="next-page-button"
            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

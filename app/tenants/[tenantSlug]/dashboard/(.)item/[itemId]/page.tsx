'use client'

import { useRouter } from 'next/navigation'

export default function ItemModalPage({
  params,
}: {
  params: { itemId: string }
}) {
  const router = useRouter()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => router.back()}
    >
      <div
        data-testid="item-detail-modal"
        className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Item #{params.itemId} Details
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          Viewing details in modal overlay
        </p>
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Item ID
            </span>
            <p className="font-semibold text-gray-900">{params.itemId}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Status
            </span>
            <p className="font-semibold text-green-600">Active</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Last Updated
            </span>
            <p className="font-semibold text-gray-900">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

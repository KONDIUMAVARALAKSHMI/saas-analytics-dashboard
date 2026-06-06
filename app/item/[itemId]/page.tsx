import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function ItemDetailPage({
  params,
}: {
  params: { itemId: string }
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const tenantSlug = (session.user as any).tenantSlug ?? 'acme-corp'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        <Link
          href={`/tenants/${tenantSlug}/dashboard`}
          className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-flex items-center gap-1"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
          Item #{params.itemId}
        </h1>
        <p className="text-gray-500 text-sm mb-6">Full detail page view</p>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Item ID
            </span>
            <p className="font-semibold text-gray-900 mt-1">{params.itemId}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Status
            </span>
            <p className="font-semibold text-green-600 mt-1">Active</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Description
            </span>
            <p className="text-gray-700 mt-1">
              This is the full detail page for item #{params.itemId}. When
              accessed from the dashboard, this opens as a modal.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Last Updated
            </span>
            <p className="font-semibold text-gray-900 mt-1">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Suspense } from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { MetricsWidget } from '@/components/dashboard/metrics-widget'
import { RevenueWidget } from '@/components/dashboard/revenue-widget'
import { RealTimeFeed } from '@/components/dashboard/real-time-feed'
import { ExportButton } from '@/components/dashboard/export-button'
import { WidgetSkeleton } from '@/components/dashboard/widget-skeleton'

export default async function DashboardPage({
  params,
}: {
  params: { tenantSlug: string }
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const role = (session.user as any).role
  const isAdmin = role === 'ADMIN'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {session.user.name}
          </p>
        </div>
        <ExportButton />
      </div>

      {/* Admin-only panel */}
      {isAdmin && (
        <div
          data-testid="admin-only-panel"
          className="bg-purple-50 border border-purple-200 rounded-lg p-4"
        >
          <h3 className="font-semibold text-purple-800">Admin Panel</h3>
          <p className="text-purple-600 text-sm mt-1">
            You have admin privileges. Manage users, settings, and advanced
            analytics.
          </p>
        </div>
      )}

      {/* Widgets with Suspense streaming */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense
          fallback={
            <WidgetSkeleton testId="widget-loading-skeleton" label="Loading metrics..." />
          }
        >
          <MetricsWidget tenantSlug={params.tenantSlug} />
        </Suspense>

        <Suspense
          fallback={
            <WidgetSkeleton testId="widget-loading-skeleton-2" label="Loading revenue..." />
          }
        >
          <RevenueWidget tenantSlug={params.tenantSlug} />
        </Suspense>
      </div>

      {/* Item list with intercepting route links */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Items
        </h2>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((id) => (
            <div
              key={id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md"
            >
              <span className="text-gray-700">Item #{id}</span>
              <a
                href={`/item/${id}`}
                data-testid="item-detail-link"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time feed */}
      <RealTimeFeed />
    </div>
  )
}

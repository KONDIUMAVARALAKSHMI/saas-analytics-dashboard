import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

async function fetchMetrics(tenantSlug: string) {
  // Simulate slow data fetch for streaming demo
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const session = await auth()
  const tenantId = (session?.user as any)?.tenantId

  const data = await prisma.analyticsData.findMany({
    where: { tenantId, category: 'engagement' },
    orderBy: { timestamp: 'desc' },
    take: 4,
  })

  return data
}

export async function MetricsWidget({
  tenantSlug,
}: {
  tenantSlug: string
}) {
  const metrics = await fetchMetrics(tenantSlug)

  return (
    <div
      data-testid="widget-loaded-content"
      className="bg-white rounded-lg shadow p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        📈 Engagement Metrics
      </h2>
      <div className="space-y-3">
        {metrics.map((metric) => (
          <div key={metric.id} className="flex justify-between items-center">
            <span className="text-gray-600">{metric.label}</span>
            <span className="font-semibold text-gray-900">
              {metric.value.toLocaleString()}
            </span>
          </div>
        ))}
        {metrics.length === 0 && (
          <p className="text-gray-400 text-sm">No metrics data available</p>
        )}
      </div>
    </div>
  )
}

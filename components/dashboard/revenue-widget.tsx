import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

async function fetchRevenue(tenantSlug: string) {
  // Simulate slow data fetch for streaming demo
  await new Promise((resolve) => setTimeout(resolve, 2500))

  const session = await auth()
  const tenantId = (session?.user as any)?.tenantId

  const data = await prisma.analyticsData.findMany({
    where: { tenantId, category: 'finance' },
    orderBy: { timestamp: 'desc' },
    take: 4,
  })

  return data
}

export async function RevenueWidget({
  tenantSlug,
}: {
  tenantSlug: string
}) {
  const revenue = await fetchRevenue(tenantSlug)

  return (
    <div
      data-testid="widget-loaded-content"
      className="bg-white rounded-lg shadow p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        💰 Revenue Overview
      </h2>
      <div className="space-y-3">
        {revenue.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-semibold text-green-600">
              {item.category === 'finance' && item.label.includes('Rate')
                ? `${item.value}%`
                : `$${item.value.toLocaleString()}`}
            </span>
          </div>
        ))}
        {revenue.length === 0 && (
          <p className="text-gray-400 text-sm">No revenue data available</p>
        )}
      </div>
    </div>
  )
}

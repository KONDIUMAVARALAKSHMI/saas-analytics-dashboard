import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DataTable } from '@/components/dashboard/data-table'

const PAGE_SIZE = 5

export default async function DataPage({
  params,
  searchParams,
}: {
  params: { tenantSlug: string }
  searchParams: { q?: string; page?: string }
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const tenantId = (session.user as any).tenantId
  const query = searchParams.q ?? ''
  const page = parseInt(searchParams.page ?? '1', 10)
  const skip = (page - 1) * PAGE_SIZE

  const where = {
    tenantId,
    ...(query
      ? {
          label: {
            contains: query,
            mode: 'insensitive' as const,
          },
        }
      : {}),
  }

  const [items, total] = await Promise.all([
    prisma.analyticsData.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.analyticsData.count({ where }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Data Explorer</h1>
        <DataTable
          items={items}
          total={total}
          page={page}
          totalPages={totalPages}
          query={query}
        />
      </div>
    </div>
  )
}

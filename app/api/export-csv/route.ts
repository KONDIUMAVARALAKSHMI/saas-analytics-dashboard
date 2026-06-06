import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tenantId = (session.user as any).tenantId

  const data = await prisma.analyticsData.findMany({
    where: { tenantId },
    orderBy: { timestamp: 'desc' },
    take: 100,
  })

  const headers = ['id', 'value', 'timestamp', 'label', 'category']
  const rows = data.map((row) => [
    `"${row.id}"`,
    `"${row.value}"`,
    `"${row.timestamp.toISOString()}"`,
    `"${row.label}"`,
    `"${row.category}"`,
  ])

  const csvContent = [
    headers.map((h) => `"${h}"`).join(','),
    ...rows.map((r) => r.join(',')),
  ].join('\n')

  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="export.csv"',
    },
  })
}

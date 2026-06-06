import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { NavBar } from '@/components/dashboard/navbar'

export default async function DashboardLayout({
  children,
  analytics,
  support,
  params,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  support: React.ReactNode
  params: { tenantSlug: string }
}) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  const userTenantSlug = (session.user as any).tenantSlug
  if (userTenantSlug !== params.tenantSlug) {
    redirect(`/tenants/${userTenantSlug}/dashboard`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar user={session.user} tenantSlug={params.tenantSlug} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {analytics}
          {support}
        </div>
      </main>
    </div>
  )
}

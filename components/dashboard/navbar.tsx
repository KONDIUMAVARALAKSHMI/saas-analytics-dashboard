'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'

interface NavBarProps {
  user: any
  tenantSlug: string
}

export function NavBar({ user, tenantSlug }: NavBarProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link
              href={`/tenants/${tenantSlug}/dashboard`}
              className="text-lg font-bold text-blue-600"
            >
              SaaS Dashboard
            </Link>
            <Link
              href={`/tenants/${tenantSlug}/data`}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Data
            </Link>
            <Link
              href="/profile"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Profile
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              {(user as any)?.role}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-sm text-gray-500 hover:text-red-600 font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

'use client'

import { useEffect, useState } from 'react'

export default function FaultyPage() {
  const [shouldThrow, setShouldThrow] = useState(false)

  useEffect(() => {
    setShouldThrow(true)
  }, [])

  if (shouldThrow) {
    throw new Error('This is an intentional error for testing error boundaries')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-gray-500">Loading faulty page...</div>
    </div>
  )
}

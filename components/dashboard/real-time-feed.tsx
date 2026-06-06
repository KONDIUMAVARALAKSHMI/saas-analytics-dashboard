'use client'

import { useEffect, useState } from 'react'

interface FeedEvent {
  id: number
  type: string
  message: string
  value: number
  timestamp: string
}

export function RealTimeFeed() {
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const eventSource = new EventSource('/api/events')

    eventSource.onopen = () => {
      setConnected(true)
    }

    eventSource.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data)
        setEvents((prev) => [event, ...prev].slice(0, 20)) // Keep last 20 events
      } catch {}
    }

    eventSource.onerror = () => {
      setConnected(false)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          ⚡ Real-Time Feed
        </h2>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            connected
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {connected ? 'Live' : 'Disconnected'}
        </span>
      </div>
      <div
        data-testid="real-time-feed"
        className="space-y-2 max-h-48 overflow-y-auto"
      >
        {events.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            Connecting to live feed...
          </p>
        ) : (
          events.map((event) => (
            <div
              key={`${event.id}-${event.timestamp}`}
              className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-md"
            >
              <span className="text-gray-700">{event.message}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">{event.value}</span>
                <span className="text-gray-400 text-xs">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

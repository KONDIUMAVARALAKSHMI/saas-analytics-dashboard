interface WidgetSkeletonProps {
  testId?: string
  label?: string
}

export function WidgetSkeleton({
  testId = 'widget-loading-skeleton',
  label = 'Loading...',
}: WidgetSkeletonProps) {
  return (
    <div
      data-testid={testId}
      className="bg-white rounded-lg shadow p-6 animate-pulse"
    >
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <p className="mt-4 text-xs text-gray-400">{label}</p>
    </div>
  )
}

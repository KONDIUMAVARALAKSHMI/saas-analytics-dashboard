export default function AnalyticsSlot() {
  return (
    <div
      data-testid="analytics-view-content"
      className="bg-white rounded-lg shadow p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        📊 Analytics Overview
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Users</span>
          <span className="font-semibold text-gray-900">1,243</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Page Views</span>
          <span className="font-semibold text-gray-900">23,400</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Conversion Rate</span>
          <span className="font-semibold text-green-600">3.4%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Bounce Rate</span>
          <span className="font-semibold text-red-500">42.1%</span>
        </div>
      </div>
    </div>
  )
}

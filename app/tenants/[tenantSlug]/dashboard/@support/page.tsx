export default function SupportSlot() {
  return (
    <div
      data-testid="support-view-content"
      className="bg-white rounded-lg shadow p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        🎧 Support Overview
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Open Tickets</span>
          <span className="font-semibold text-yellow-600">47</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Resolved Today</span>
          <span className="font-semibold text-green-600">12</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Avg Response Time</span>
          <span className="font-semibold text-gray-900">2.4h</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Satisfaction Score</span>
          <span className="font-semibold text-green-600">4.8/5</span>
        </div>
      </div>
    </div>
  )
}

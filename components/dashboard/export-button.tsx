'use client'

export function ExportButton() {
  const handleExport = () => {
    const link = document.createElement('a')
    link.href = '/api/export-csv'
    link.download = 'export.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={handleExport}
      data-testid="export-csv-button"
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
    >
      <span>⬇</span>
      Export CSV
    </button>
  )
}

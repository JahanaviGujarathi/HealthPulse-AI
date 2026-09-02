/**
 * HealthPulse AI — Data Export Utility
 * Provides clean CSV and JSON export capabilities for surveillance records,
 * clinical cases, water quality telemetry, and audit logs.
 */

export interface ExportColumn<T> {
  header: string
  key: keyof T | ((row: T) => any)
}

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: ExportColumn<T>[],
): void {
  if (!data || data.length === 0) {
    console.warn('exportToCSV: No data provided for export')
    return
  }

  let headers: string[] = []
  let getRowValues: (row: T) => any[]

  if (columns && columns.length > 0) {
    headers = columns.map((col) => col.header)
    getRowValues = (row: T) =>
      columns.map((col) => {
        if (typeof col.key === 'function') {
          return col.key(row)
        }
        return row[col.key]
      })
  } else {
    headers = Object.keys(data[0])
    getRowValues = (row: T) => headers.map((key) => row[key])
  }

  const escapeCSVCell = (value: any): string => {
    if (value === null || value === undefined) return '""'
    const stringified = typeof value === 'object' ? JSON.stringify(value) : String(value)
    const escaped = stringified.replace(/"/g, '""')
    return `"${escaped}"`
  }

  const csvRows: string[] = []
  csvRows.push(headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','))

  for (const row of data) {
    const values = getRowValues(row)
    csvRows.push(values.map(escapeCSVCell).join(','))
  }

  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportToJSON<T>(data: T, filename: string): void {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename.endsWith('.json') ? filename : `${filename}.json`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

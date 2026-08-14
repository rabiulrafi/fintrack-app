import React, { useState } from 'react'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart'
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart'
import { useDashboard } from '@/hooks/useDashboard'
import { exportsApi } from '@/api/exports'
import { formatCurrency } from '@/utils/formatters'
import toast from 'react-hot-toast'

export const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10)
  )
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  )
  const [isExporting, setIsExporting] = useState(false)

  const { dashboardData, isLoading } = useDashboard(startDate, endDate)

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      setIsExporting(true)
      const filters = { date_from: startDate, date_to: endDate }
      if (format === 'csv') await exportsApi.exportCSV(filters)
      else if (format === 'excel') await exportsApi.exportExcel(filters)
      else if (format === 'pdf') await exportsApi.exportPDF(filters)
      toast.success(`Exported as ${format.toUpperCase()}`)
    } catch {
      toast.error('Failed to generate export')
    } finally {
      setIsExporting(false)
    }
  }

  const grandTotalExpenses =
    dashboardData?.category_expenses.reduce((acc, curr) => acc + curr.total, 0) || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Reports & Analytics</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Analyze income trends, expense distributions, and export data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Picker */}
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          {/* Export Buttons */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              className="px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              disabled={isExporting}
              className="px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" /> Excel
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-red-600" /> PDF
            </button>
          </div>
        </div>
      </div>

      {/* Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart
            data={dashboardData?.monthly_chart || []}
            isLoading={isLoading}
          />
        </div>
        <div>
          <CategoryPieChart
            data={dashboardData?.category_expenses || []}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Category Breakdown Table */}
      <Card title="Category Spending Breakdown" subtitle="Detailed expense distribution">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th className="text-right">Total Spent</th>
                <th className="text-right">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.category_expenses.map((item) => (
                <tr key={item.category_id}>
                  <td className="font-semibold text-gray-800">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.category_color || '#16a34a' }}
                      />
                      <span>{item.category_name}</span>
                    </div>
                  </td>
                  <td className="text-right font-bold text-gray-900">
                    {formatCurrency(item.total)}
                  </td>
                  <td className="text-right text-gray-500 font-medium">{item.percentage}%</td>
                </tr>
              ))}
              {dashboardData?.category_expenses.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-xs text-gray-400">
                    No expense data found for the selected range.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-bold">
                <td className="text-gray-900">Total</td>
                <td className="text-right text-gray-900">{formatCurrency(grandTotalExpenses)}</td>
                <td className="text-right text-gray-900">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  )
}

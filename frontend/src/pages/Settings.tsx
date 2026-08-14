import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { CURRENCIES } from '@/utils/constants'
import { exportsApi } from '@/api/exports'
import { useThemeStore, Theme } from '@/stores/themeStore'
import { Sun, Moon, Laptop } from 'lucide-react'
import toast from 'react-hot-toast'

export const Settings: React.FC = () => {
  const [currency, setCurrency] = useState('BDT')
  const [isExportAllOpen, setIsExportAllOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { theme, setTheme } = useThemeStore()

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Preferences saved successfully')
  }

  const handleExportAll = async () => {
    try {
      setIsExporting(true)
      await exportsApi.exportCSV()
      setIsExportAllOpen(false)
      toast.success('Complete dataset downloaded')
    } catch {
      toast.error('Failed to export dataset')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Application Settings</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Configure appearance, display preferences, and data management.
        </p>
      </div>

      {/* Theme Appearance Card */}
      <Card title="Appearance & Theme" subtitle="Choose between light, dark, or system preference">
        <div className="space-y-3">
          <label className="form-label">Theme Mode</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                theme === 'light'
                  ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500/20 font-bold'
                  : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <span className="text-xs">Light</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                theme === 'dark'
                  ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500/20 font-bold'
                  : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Moon className="w-5 h-5 text-indigo-500" />
              <span className="text-xs">Dark</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                theme === 'system'
                  ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500/20 font-bold'
                  : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Laptop className="w-5 h-5 text-gray-500" />
              <span className="text-xs">System</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Preferences Card */}
      <Card title="General Preferences" subtitle="Display and default currency options">
        <form onSubmit={handleSavePreferences} className="space-y-4">
          <Select
            label="Default Display Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol}) - {c.name}
              </option>
            ))}
          </Select>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary">
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>

      {/* Data Management Card */}
      <Card title="Data Management" subtitle="Backup and complete data export options">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800">
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Backup All Financial Data</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Download a complete copy of all your transactions in standard CSV format.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setIsExportAllOpen(true)}
              size="sm"
            >
              Export Complete Backup
            </Button>
          </div>
        </div>
      </Card>

      {/* Backup Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isExportAllOpen}
        onClose={() => setIsExportAllOpen(false)}
        onConfirm={handleExportAll}
        title="Download Complete Data Backup"
        message="This will generate a full CSV file containing all income and expense records associated with your account."
        confirmText="Download CSV"
        isLoading={isExporting}
      />
    </div>
  )
}

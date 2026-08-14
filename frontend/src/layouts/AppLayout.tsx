import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ReceiptText,
  Landmark,
  Tags,
  PieChart,
  FileSpreadsheet,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Plus,
  ArrowLeftRight,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Modal } from '@/components/ui/Modal'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { TransferForm } from '@/components/transfers/TransferForm'
import { useTransactions } from '@/hooks/useTransactions'
import { useAccounts } from '@/hooks/useAccounts'
import { useCategories } from '@/hooks/useCategories'
import { useTransfers } from '@/hooks/useTransfers'
import type { TransactionCreate, TransferCreate } from '@/types'

export const AppLayout: React.FC = () => {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [isQuickTransferOpen, setIsQuickTransferOpen] = useState(false)

  const { accounts } = useAccounts()
  const { categories } = useCategories()
  const { createTransaction, isCreating } = useTransactions()
  const { createTransfer, isCreating: isTransferring } = useTransfers()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const handleQuickAdd = async (data: TransactionCreate) => {
    await createTransaction(data)
    setIsQuickAddOpen(false)
  }

  const handleQuickTransfer = async (data: TransferCreate) => {
    await createTransfer(data)
    setIsQuickTransferOpen(false)
  }

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/transactions', label: 'Transactions', icon: <ReceiptText className="w-4 h-4" /> },
    { to: '/accounts', label: 'Accounts', icon: <Landmark className="w-4 h-4" /> },
    { to: '/categories', label: 'Categories', icon: <Tags className="w-4 h-4" /> },
    { to: '/budgets', label: 'Budgets', icon: <PieChart className="w-4 h-4" /> },
    { to: '/reports', label: 'Reports & Export', icon: <FileSpreadsheet className="w-4 h-4" /> },
  ]

  const secondaryLinks = [
    { to: '/profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { to: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col md:flex-row transition-colors">
      {/* ─── Sidebar (Desktop) ──────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 p-5 justify-between fixed h-full z-30 transition-colors">
        <div>
          {/* Logo & Theme Toggle */}
          <div className="flex items-center justify-between px-2 mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
                F
              </div>
              <div>
                <h1 className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">FinTrack</h1>
                <p className="text-[11px] text-gray-400 font-medium">Income & Expense</p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mb-6 px-1">
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/60 rounded-lg text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
            <button
              onClick={() => setIsQuickTransferOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-xs font-bold transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" /> Transfer
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
          {secondaryLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ─── Mobile Header ─────────────────────────────────────────────────── */}
      <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
          <span className="font-bold text-gray-900 dark:text-white">FinTrack</span>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="p-2 bg-primary-600 text-white rounded-lg text-xs font-medium"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ─── Mobile Menu Drawer ────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-64 h-full p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">
                    F
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">FinTrack</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
              {secondaryLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="sidebar-link w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Main Content Container ────────────────────────────────────────── */}
      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 max-w-7xl">
        <Outlet />
      </main>

      {/* Quick Add Transaction Modal */}
      <Modal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        title="Add Transaction"
        description="Record a new income or expense transaction"
      >
        <TransactionForm
          accounts={accounts}
          categories={categories}
          onSubmit={handleQuickAdd}
          onCancel={() => setIsQuickAddOpen(false)}
          isLoading={isCreating}
        />
      </Modal>

      {/* Quick Transfer Modal */}
      <Modal
        isOpen={isQuickTransferOpen}
        onClose={() => setIsQuickTransferOpen(false)}
        title="Transfer Funds"
        description="Move money between your accounts"
      >
        <TransferForm
          accounts={accounts}
          onSubmit={handleQuickTransfer}
          onCancel={() => setIsQuickTransferOpen(false)}
          isLoading={isTransferring}
        />
      </Modal>
    </div>
  )
}

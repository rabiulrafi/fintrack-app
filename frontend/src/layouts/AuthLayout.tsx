import React from 'react'
import { Outlet } from 'react-router-dom'

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-extrabold text-2xl mx-auto shadow-md mb-3">
          F
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">FinTrack</h2>
        <p className="mt-1 text-sm text-gray-500">Production-ready Personal Finance Tracker</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-gray-100/50 rounded-2xl border border-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

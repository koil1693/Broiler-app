import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../features/auth/pages/LoginPage'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import TripDetailsPage from '../features/trips/pages/TripDetailsPage'
import RateManagementPage from '../features/finance/pages/RateManagementPage'
import DispatchDashboard from '../features/trips/pages/DispatchDashboard'
import VendorMasterPage from '../features/vendors/pages/VendorMasterPage'
import VendorLedgerPage from '../features/vendors/pages/VendorLedgerPage'
import ReconciliationPage from '../features/finance/pages/ReconciliationPage'
import DailyOverviewPage from '../features/finance/pages/DailyOverviewPage'
import PaymentEntryPage from '../features/finance/pages/PaymentEntryPage'
import DriverMasterPage from '../features/drivers/pages/DriverMasterPage'
import DashboardLayout from '../components/layout/DashboardLayout'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? <DashboardLayout>{children}</DashboardLayout> : <Navigate to="/login" />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/dispatch" element={<PrivateRoute><DispatchDashboard /></PrivateRoute>} />
      <Route path="/trips/new" element={<Navigate to="/dispatch" />} />
      <Route path="/trips/:id" element={<PrivateRoute><TripDetailsPage /></PrivateRoute>} />
      <Route path="/rates" element={<PrivateRoute><RateManagementPage /></PrivateRoute>} />
      <Route path="/vendors" element={<PrivateRoute><VendorMasterPage /></PrivateRoute>} />
      <Route path="/drivers" element={<PrivateRoute><DriverMasterPage /></PrivateRoute>} />
      <Route path="/vendors/:vendorId/ledger" element={<PrivateRoute><VendorLedgerPage /></PrivateRoute>} />
      <Route path="/reconciliation" element={<PrivateRoute><ReconciliationPage /></PrivateRoute>} />
      <Route path="/daily-overview" element={<PrivateRoute><DailyOverviewPage /></PrivateRoute>} />
      <Route path="/payments/entry" element={<PrivateRoute><PaymentEntryPage /></PrivateRoute>} />
    </Routes>
  )
}

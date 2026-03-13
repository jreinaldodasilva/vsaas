import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout/DashboardLayout';
import { ProtectedRoute } from '../components/Auth/ProtectedRoute/ProtectedRoute';
import { LoginPage } from '../pages/Login/LoginPage';
import { DashboardPage } from '../pages/Admin/Dashboard/DashboardPage';

// TODO: Import and add domain-specific pages here

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        {/* TODO: Add forgot-password, reset-password routes */}
      </Route>

      {/* Protected staff routes */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        {/* TODO: Add domain-specific routes here */}
        {/* <Route path="/admin/patients" element={<PatientManagementPage />} /> */}
      </Route>

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/unauthorized" element={<div>Acesso não autorizado</div>} />
      <Route path="*" element={<div>Página não encontrada</div>} />
    </Routes>
  );
}

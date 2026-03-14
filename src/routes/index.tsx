import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout/DashboardLayout';
import { ProtectedRoute } from '../components/Auth/ProtectedRoute/ProtectedRoute';
import { LoginPage } from '../pages/Login/LoginPage';
import { RegisterPage } from '../pages/Register/RegisterPage';
import { AcceptInvitePage } from '../pages/AcceptInvite/AcceptInvitePage';
import { ForgotPasswordPage } from '../pages/ForgotPassword/ForgotPasswordPage';
import { DashboardPage } from '../pages/Admin/Dashboard/DashboardPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/accept-invite" element={<AcceptInvitePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/unauthorized" element={<div>Acesso não autorizado</div>} />
      <Route path="*" element={<div>Página não encontrada</div>} />
    </Routes>
  );
}

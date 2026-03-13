import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUIStore } from '../../store/uiStore';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`dashboard-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          {/* TODO: Add your app logo/branding here */}
          <span className="sidebar-brand">vSaaS</span>
          <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">☰</button>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Dashboard
          </NavLink>
          {/* TODO: Add domain-specific nav links here */}
        </nav>
        <div className="sidebar-footer">
          <span className="sidebar-user">{user?.name}</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sair</button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

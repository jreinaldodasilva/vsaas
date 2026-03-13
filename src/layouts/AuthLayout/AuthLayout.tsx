import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        {/* TODO: Add your app logo/branding here */}
        <div className="auth-brand">
          <h1>vSaaS</h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

import { useAuth } from '../../../contexts/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <p>Bem-vindo, {user?.name}!</p>
      {/* TODO: Add domain-specific dashboard widgets here */}
    </div>
  );
}

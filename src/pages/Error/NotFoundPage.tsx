import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/UI';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: 24 }}>
      <h1 style={{ fontSize: 72, margin: 0, color: '#e2e8f0' }}>404</h1>
      <p style={{ fontSize: 18, color: '#64748b', marginBottom: 24 }}>Página não encontrada</p>
      <Button onClick={() => navigate('/admin/dashboard')}>Voltar ao início</Button>
    </div>
  );
}

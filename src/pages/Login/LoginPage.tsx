import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../../components/Auth/LoginForm/LoginForm';

export function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="login-page">
      <h2>Entrar</h2>
      <LoginForm onSuccess={() => navigate('/admin/dashboard')} />
      <p>
        <a href="/forgot-password">Esqueceu a senha?</a>
      </p>
    </div>
  );
}

import { useNavigate, Link } from 'react-router-dom';
import { LoginForm } from '../../components/Auth/LoginForm/LoginForm';

export function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="login-page">
      <h2>Entrar</h2>
      <LoginForm onSuccess={() => navigate('/admin/dashboard')} />
      <p>
        <Link to="/forgot-password">Esqueceu a senha?</Link>
      </p>
      <p>
        Não tem uma conta? <Link to="/register">Criar conta</Link>
      </p>
    </div>
  );
}

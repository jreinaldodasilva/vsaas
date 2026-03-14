import { useState, FormEvent } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/api/authService';
import { PasswordInput } from '../../components/UI';

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="reset-password-page">
        <h2>Link inválido</h2>
        <p>O link de redefinição de senha é inválido ou está faltando o token.</p>
        <Link to="/forgot-password">Solicitar novo link</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="reset-password-page">
        <h2>Senha redefinida!</h2>
        <p>Sua senha foi alterada com sucesso.</p>
        <Link to="/login">Ir para login</Link>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <h2>Redefinir senha</h2>
      <form onSubmit={handleSubmit}>
        <PasswordInput
          id="password"
          label="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          showStrength
        />
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Redefinir senha'}</button>
      </form>
      <p><Link to="/login">Voltar para login</Link></p>
    </div>
  );
}

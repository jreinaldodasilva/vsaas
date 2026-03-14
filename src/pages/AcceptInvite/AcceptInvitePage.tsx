import { useState, FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { http } from '../../services/http';
import { PasswordInput } from '../../components/UI';

export function AcceptInvitePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [form, setForm] = useState({ name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="accept-invite-page">
        <h2>Convite inválido</h2>
        <p>O link de convite é inválido ou está faltando o token.</p>
        <Link to="/login">Ir para login</Link>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await http.post('/api/v1/auth/accept-invite', { token, ...form });
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao aceitar convite');
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="accept-invite-page">
      <h2>Aceitar convite</h2>
      <p>Complete seu cadastro para entrar na equipe.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nome</label>
          <input id="name" type="text" value={form.name} onChange={set('name')} required minLength={2} />
        </div>
        <div>
          <PasswordInput
            id="password"
            label="Senha"
            value={form.password}
            onChange={set('password')}
            required
            minLength={8}
            showStrength
          />
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Criando...' : 'Criar conta'}</button>
      </form>
    </div>
  );
}

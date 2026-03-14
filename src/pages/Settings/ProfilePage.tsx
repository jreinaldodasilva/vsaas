import { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/api/authService';
import { PasswordInput } from '../../components/UI';
import { useToast } from '../../hooks/useToast';

export function ProfilePage() {
  const { user } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.changePassword(form.currentPassword, form.newPassword);
      toast.success('Senha alterada com sucesso');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      toast.error(err.message || 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="profile-page">
      <h2>Meu perfil</h2>

      <section style={{ marginBottom: 32 }}>
        <h3>Informações</h3>
        <p><strong>Nome:</strong> {user?.name}</p>
        <p><strong>E-mail:</strong> {user?.email}</p>
        <p><strong>Função:</strong> {user?.role}</p>
      </section>

      <section>
        <h3>Alterar senha</h3>
        <form onSubmit={handleChangePassword}>
          <div>
            <PasswordInput
              id="currentPassword"
              label="Senha atual"
              value={form.currentPassword}
              onChange={set('currentPassword')}
              required
            />
          </div>
          <div>
            <PasswordInput
              id="newPassword"
              label="Nova senha"
              value={form.newPassword}
              onChange={set('newPassword')}
              required
              minLength={8}
              showStrength
            />
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Alterar senha'}</button>
        </form>
      </section>
    </div>
  );
}

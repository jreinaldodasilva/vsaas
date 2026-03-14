import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/api/authService';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Erro ao enviar e-mail de recuperação');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="forgot-password-page">
        <h2>E-mail enviado</h2>
        <p>Se o e-mail estiver registrado, você receberá um link para redefinir sua senha.</p>
        <Link to="/login">Voltar ao login</Link>
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <h2>Esqueceu a senha?</h2>
      <p>Informe seu e-mail para receber um link de recuperação.</p>
      <form onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        <div className="form-field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? 'Enviando...' : 'Enviar link'}
        </button>
      </form>
      <p><Link to="/login">Voltar ao login</Link></p>
    </div>
  );
}

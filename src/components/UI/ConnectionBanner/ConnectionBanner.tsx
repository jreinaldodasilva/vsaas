import { useHealthCheck } from '../../../hooks/useHealthCheck';

export function ConnectionBanner() {
  const { isApiReachable, recheckNow } = useHealthCheck();

  if (isApiReachable) return null;

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: '8px 16px',
        background: '#e74c3c',
        color: '#fff',
        textAlign: 'center',
        fontSize: '0.9em',
      }}
    >
      Sem conexão com o servidor.{' '}
      <button
        onClick={recheckNow}
        style={{ background: 'none', border: '1px solid #fff', color: '#fff', cursor: 'pointer', borderRadius: 4, padding: '2px 8px' }}
      >
        Tentar novamente
      </button>
    </div>
  );
}

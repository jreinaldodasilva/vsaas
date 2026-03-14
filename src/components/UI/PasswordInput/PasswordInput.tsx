import { useState, useMemo, InputHTMLAttributes } from 'react';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showStrength?: boolean;
  label?: string;
}

const RULES = [
  { test: (v: string) => v.length >= 8, label: 'Mínimo 8 caracteres' },
  { test: (v: string) => /[A-Z]/.test(v), label: 'Letra maiúscula' },
  { test: (v: string) => /[0-9]/.test(v), label: 'Número' },
  { test: (v: string) => /[^A-Za-z0-9]/.test(v), label: 'Caractere especial' },
];

const STRENGTH_LABELS = ['Fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'] as const;
const STRENGTH_COLORS = ['#e74c3c', '#e74c3c', '#f39c12', '#2ecc71', '#27ae60'] as const;

export function PasswordInput({ showStrength = false, label, value, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const val = String(value ?? '');

  const passed = useMemo(() => RULES.filter((r) => r.test(val)), [val]);
  const score = passed.length;

  return (
    <div className="password-input">
      {label && <label htmlFor={props.id}>{label}</label>}
      <div style={{ position: 'relative', display: 'flex' }}>
        <input {...props} type={visible ? 'text' : 'password'} value={value} />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {visible ? '🙈' : '👁'}
        </button>
      </div>
      {showStrength && val.length > 0 && (
        <div className="password-strength" aria-live="polite">
          <div
            style={{
              height: 4,
              borderRadius: 2,
              background: '#eee',
              marginTop: 4,
            }}
          >
            <div
              style={{
                width: `${(score / RULES.length) * 100}%`,
                height: '100%',
                borderRadius: 2,
                background: STRENGTH_COLORS[score],
                transition: 'width 0.2s, background 0.2s',
              }}
            />
          </div>
          <small style={{ color: STRENGTH_COLORS[score] }}>{STRENGTH_LABELS[score]}</small>
          <ul style={{ fontSize: '0.8em', margin: '4px 0 0', paddingLeft: 16 }}>
            {RULES.map((r) => (
              <li key={r.label} style={{ color: r.test(val) ? '#27ae60' : '#999' }}>
                {r.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

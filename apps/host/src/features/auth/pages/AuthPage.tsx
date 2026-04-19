import { FormEvent, useState } from 'react';

interface AuthPageProps {
  onLogin: (input: { email: string; password: string }) => Promise<void>;
  onRegister: (input: { name: string; email: string; password: string }) => Promise<void>;
}

export function AuthPage({ onLogin, onRegister }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await onLogin({ email, password });
      } else {
        await onRegister({ name, email, password });
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-stack">
      <section className="panel auth-panel">
        <p className="section-label">Authentication</p>
        <h2>{mode === 'login' ? 'Sign in to continue' : 'Create your account'}</h2>
        <p>Use simple auth to access storefront pages and protected cart APIs.</p>

        <div className="auth-switch">
          <button
            type="button"
            className={mode === 'login' ? 'nav-link active' : 'nav-link'}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'nav-link active' : 'nav-link'}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {mode === 'register' ? (
            <label className="toolbar-field">
              <span>Name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
          ) : null}

          <label className="toolbar-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="toolbar-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          </label>

          {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}

          <button type="submit" className="primary-inline" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
      </section>
    </section>
  );
}

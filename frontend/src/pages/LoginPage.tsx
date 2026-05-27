import { useState } from 'react';
import { APP_NAME } from '@/lib/constants';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginPage() {
  const login = useLogin();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    login.mutate({ email, password });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-surface-base">
      <div className="w-full max-w-sm px-6">
        {/* Logo / wordmark */}
        <div className="mb-8 text-center">
          <p className="label-caps text-ink-muted mb-1">Welcome to</p>
          <h1 className="font-heading text-3xl font-bold text-ink">{APP_NAME}</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="label-caps text-ink-muted" htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@inventoryos.com"
              disabled={login.isPending}
              required
              className="bg-surface-card"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-caps text-ink-muted" htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={login.isPending}
              required
              className="bg-surface-card"
            />
          </div>

          {login.isError && (
            <p role="alert" className="text-sm text-status-error text-center">
              Invalid email or password.
            </p>
          )}

          <Button
            type="submit"
            disabled={login.isPending || !email || !password}
            className="mt-1 w-full"
          >
            {login.isPending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        {/* Demo hint */}
        <p className="mt-6 text-center text-xs text-ink-muted">
          Demo: <span className="font-mono text-ink-dim">admin@inventoryos.com</span>
          {' / '}
          <span className="font-mono text-ink-dim">password123</span>
        </p>
      </div>
    </div>
  );
}

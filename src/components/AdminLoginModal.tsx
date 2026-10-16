import { useState } from 'react';
import { X, Lock, Loader2 } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export function AdminLoginModal() {
  const { showLogin, setShowLogin, login } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!showLogin) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-surface border border-line p-6 sm:p-8 max-w-sm w-full text-ink">
        <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-line">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted" />
            <h3 className="font-serif text-2xl font-normal text-ink">Admin Session</h3>
          </div>
          <button
            onClick={() => setShowLogin(false)}
            className="text-muted hover:text-ink p-1"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 border border-red-500/30 bg-bg text-red-600 dark:text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="admin@example.com"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" /> Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

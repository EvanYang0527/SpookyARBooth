import { FormEvent, useState } from 'react';
import { Leaf, Lock, Loader2, User } from 'lucide-react';
import { login } from '../services/authApi';

type LoginFormProps = {
  onSuccess: (auth: { token: string; username: string; role: 'admin' | 'user'; theme: string }) => void;
};

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await login({ username: username.trim(), password });
      onSuccess({ token: result.token, username: result.username, role: result.role, theme: result.theme });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950 px-4">
      <div className="max-w-md w-full bg-amber-950/80 border border-amber-600/40 rounded-2xl shadow-2xl shadow-amber-900/40 p-8 backdrop-blur">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-600/50 mb-4">
            <Leaf className="w-9 h-9 text-amber-950" />
          </div>
          <h1 className="text-2xl font-bold text-amber-400">Gratitude Photo Booth</h1>
          <p className="text-sm text-amber-200/60 mt-2">Sign in to capture your autumn moment.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-amber-300 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-amber-950/80 border border-amber-700/60 rounded-lg text-amber-100 placeholder:text-amber-200/30 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              placeholder="Enter your username"
              autoComplete="username"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-amber-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-amber-950/80 border border-amber-700/60 rounded-lg text-amber-100 placeholder:text-amber-200/30 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-200 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-amber-950 font-semibold rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

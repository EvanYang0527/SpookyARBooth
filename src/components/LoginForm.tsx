import { FormEvent, useState } from 'react';
import { Ghost, Lock, Loader2, User } from 'lucide-react';
import { login } from '../services/authApi';

type LoginFormProps = {
  onSuccess: (auth: { token: string; username: string }) => void;
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
      onSuccess({ token: result.token, username: username.trim() });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-purple-900 to-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-900/80 border border-orange-500/40 rounded-2xl shadow-2xl shadow-orange-900/40 p-8 backdrop-blur">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/60 mb-4">
            <Ghost className="w-9 h-9 text-gray-900" />
          </div>
          <h1 className="text-2xl font-bold text-orange-400">Spooky AR Booth</h1>
          <p className="text-sm text-gray-400 mt-2">Sign in to start conjuring eerie effects.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-400" />
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full px-4 py-3 bg-gray-950/80 border border-gray-700 rounded-lg text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder="Enter your username"
              autoComplete="username"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-400" />
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-4 py-3 bg-gray-950/80 border border-gray-700 rounded-lg text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
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
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-gray-900 font-semibold rounded-lg transition-colors"
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

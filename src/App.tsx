import { useEffect, useState } from 'react';
import Header from './components/Header';
import CameraView from './components/CameraView';
import EffectPicker, { EffectType } from './components/EffectPicker';
import ResultPanel from './components/ResultPanel';
import AdminDashboard from './components/admin/AdminDashboard';
import { applyEffectWithRetry, EffectsApiError } from './services/effectsApi';
import { AlertCircle } from 'lucide-react';
import LoginForm from './components/LoginForm';

type AppState = 'camera' | 'processing' | 'result' | 'error';
type Page = 'photobooth' | 'admin';

const AUTH_TOKEN_KEY = 'spooky_ar_auth_token';
const AUTH_USERNAME_KEY = 'spooky_ar_username';
const AUTH_ROLE_KEY = 'spooky_ar_role';

function App() {
  const authPreference = import.meta.env.VITE_REQUIRE_AUTH;
  const isAuthDisabled =
    authPreference === 'false' || (import.meta.env.DEV && authPreference !== 'true');

  const [page, setPage] = useState<Page>('photobooth');
  const [state, setState] = useState<AppState>('camera');
  const [selectedEffect, setSelectedEffect] = useState<EffectType>('thanksgiving_glow');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [processedImage, setProcessedImage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isRetryable, setIsRetryable] = useState(false);

  const [authToken, setAuthToken] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null
  );
  const [username, setUsername] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(AUTH_USERNAME_KEY) : null
  );
  const [role, setRole] = useState<'admin' | 'user' | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(AUTH_ROLE_KEY);
    return stored === 'admin' || stored === 'user' ? stored : null;
  });

  useEffect(() => {
    if (authToken) localStorage.setItem(AUTH_TOKEN_KEY, authToken);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  }, [authToken]);

  useEffect(() => {
    if (username) localStorage.setItem(AUTH_USERNAME_KEY, username);
    else localStorage.removeItem(AUTH_USERNAME_KEY);
  }, [username]);

  useEffect(() => {
    if (role) localStorage.setItem(AUTH_ROLE_KEY, role);
    else localStorage.removeItem(AUTH_ROLE_KEY);
  }, [role]);

  const handleLoginSuccess = (auth: { token: string; username: string; role: 'admin' | 'user' }) => {
    setAuthToken(auth.token);
    setUsername(auth.username);
    setRole(auth.role);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUsername(null);
    setRole(null);
    setCapturedImage('');
    setProcessedImage('');
    setError('');
    setState('camera');
    setPage('photobooth');
  };

  const handleCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setState('processing');
    setError('');
    try {
      const result = await applyEffectWithRetry(imageData, selectedEffect, 70);
      setProcessedImage(result);
      setState('result');
    } catch (err) {
      if (err instanceof EffectsApiError) {
        setError(err.message);
        setIsRetryable(err.isRetryable);
      } else {
        setError('An unexpected error occurred. Please try again.');
        setIsRetryable(true);
      }
      setState('error');
    }
  };

  const handleRetake = () => {
    setCapturedImage('');
    setProcessedImage('');
    setError('');
    setState('camera');
  };

  const handleRetryProcessing = async () => {
    if (!capturedImage) return;
    setState('processing');
    setError('');
    try {
      const result = await applyEffectWithRetry(capturedImage, selectedEffect, 70);
      setProcessedImage(result);
      setState('result');
    } catch (err) {
      if (err instanceof EffectsApiError) {
        setError(err.message);
        setIsRetryable(err.isRetryable);
      } else {
        setError('An unexpected error occurred. Please try again.');
        setIsRetryable(true);
      }
      setState('error');
    }
  };

  if (!authToken && !isAuthDisabled) {
    return <LoginForm onSuccess={handleLoginSuccess} />;
  }

  const effectiveUsername = isAuthDisabled ? username ?? 'Local Tester' : username ?? undefined;
  const effectiveRole = isAuthDisabled ? (role ?? null) : role;

  if (page === 'admin') {
    return <AdminDashboard onBack={() => setPage('photobooth')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950">
      <Header
        username={effectiveUsername}
        role={effectiveRole}
        onLogout={isAuthDisabled ? undefined : handleLogout}
        onAdminClick={() => setPage('admin')}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-3 flex items-center justify-center gap-3">
            Gratitude Photo Booth
          </h1>
          <p className="text-amber-200/70 text-lg">
            Capture your photo and celebrate autumn gratitude
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {(state === 'camera' || state === 'processing') && (
            <>
              <EffectPicker
                selectedEffect={selectedEffect}
                onSelectEffect={setSelectedEffect}
                disabled={state === 'processing'}
              />
              <CameraView onCapture={handleCapture} isProcessing={state === 'processing'} />
            </>
          )}

          {state === 'result' && (
            <ResultPanel
              originalImage={capturedImage}
              processedImage={processedImage}
              effect={selectedEffect}
              onRetake={handleRetake}
            />
          )}

          {state === 'error' && (
            <div className="w-full">
              <div className="relative w-full aspect-video bg-amber-950/60 rounded-xl flex flex-col items-center justify-center p-8 border-2 border-red-500/30">
                <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                <h3 className="text-red-400 text-xl font-bold mb-2">Processing Error</h3>
                <p className="text-red-300 text-center mb-6 max-w-md">{error}</p>
                <div className="flex gap-4">
                  {isRetryable && (
                    <button
                      onClick={handleRetryProcessing}
                      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      Retry Processing
                    </button>
                  )}
                  <button
                    onClick={handleRetake}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Take New Photo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center mt-12 text-amber-200/40">
          <p className="flex items-center justify-center gap-2">
            Powered by ITS Technology Innovation Office
            <span className="text-amber-400">🍂</span>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;

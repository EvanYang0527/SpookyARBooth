import { useEffect, useState } from 'react';
import Header from './components/Header';
import CameraView from './components/CameraView';
import EffectPicker from './components/EffectPicker';
import ResultPanel from './components/ResultPanel';
import AdminDashboard from './components/admin/AdminDashboard';
import { applyEffectWithRetry, EffectsApiError } from './services/effectsApi';
import { AlertCircle } from 'lucide-react';
import LoginForm from './components/LoginForm';
import { getTheme } from './themes';

type AppState = 'camera' | 'processing' | 'result' | 'error';
type Page = 'photobooth' | 'admin';

const AUTH_TOKEN_KEY    = 'spooky_ar_auth_token';
const AUTH_USERNAME_KEY = 'spooky_ar_username';
const AUTH_ROLE_KEY     = 'spooky_ar_role';
const AUTH_THEME_KEY    = 'spooky_ar_theme';

function App() {
  const authPreference = import.meta.env.VITE_REQUIRE_AUTH;
  const isAuthDisabled =
    authPreference === 'false' || (import.meta.env.DEV && authPreference !== 'true');

  const [page, setPage] = useState<Page>('photobooth');
  const [state, setState] = useState<AppState>('camera');
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
  const [theme, setTheme] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(AUTH_THEME_KEY) : null
  );

  const themeConfig = getTheme(theme);

  const [selectedEffect, setSelectedEffect] = useState<string>(() => {
    const storedTheme = typeof window !== 'undefined' ? localStorage.getItem(AUTH_THEME_KEY) : null;
    const config = getTheme(storedTheme);
    return config.effects[0]?.id ?? 'thanksgiving_glow';
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

  useEffect(() => {
    if (theme) localStorage.setItem(AUTH_THEME_KEY, theme);
    else localStorage.removeItem(AUTH_THEME_KEY);
  }, [theme]);

  const handleLoginSuccess = (auth: { token: string; username: string; role: 'admin' | 'user'; theme: string }) => {
    setAuthToken(auth.token);
    setUsername(auth.username);
    setRole(auth.role);
    setTheme(auth.theme);
    const config = getTheme(auth.theme);
    setSelectedEffect(config.effects[0]?.id ?? 'thanksgiving_glow');
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUsername(null);
    setRole(null);
    setTheme(null);
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

  const effectName = themeConfig.effects.find(e => e.id === selectedEffect)?.name ?? selectedEffect;

  return (
    <div className={`h-screen flex flex-col ${themeConfig.colors.mainBg} overflow-hidden`}>
      <Header
        username={effectiveUsername}
        role={effectiveRole}
        onLogout={isAuthDisabled ? undefined : handleLogout}
        onAdminClick={() => setPage('admin')}
        themeConfig={themeConfig}
      />

      <main className="flex-1 flex overflow-hidden">
        {(state === 'camera' || state === 'processing') && (
          <>
            {/* Left: camera feed */}
            <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
              <CameraView
                onCapture={handleCapture}
                isProcessing={state === 'processing'}
                colors={themeConfig.colors}
              />
            </div>

            {/* Right: effect picker sidebar */}
            <div className={`w-80 border-l ${themeConfig.colors.sidebarBorder} overflow-y-auto p-4 ${themeConfig.colors.sidebarBg} flex-shrink-0`}>
              <EffectPicker
                themeId={themeConfig.id}
                effects={themeConfig.effects}
                colors={themeConfig.colors}
                selectedEffect={selectedEffect}
                onSelectEffect={setSelectedEffect}
                disabled={state === 'processing'}
              />
            </div>
          </>
        )}

        {state === 'result' && (
          <div className="flex-1 overflow-y-auto p-4">
            <ResultPanel
              originalImage={capturedImage}
              processedImage={processedImage}
              effect={selectedEffect}
              effectName={effectName}
              frames={themeConfig.frames}
              defaultFrame={themeConfig.defaultFrame}
              processingText={themeConfig.processingText}
              onRetake={handleRetake}
            />
          </div>
        )}

        {state === 'error' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-lg bg-black/40 rounded-xl flex flex-col items-center justify-center p-8 border-2 border-red-500/30">
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
                  className={`px-6 py-3 bg-gradient-to-r ${themeConfig.colors.captureBtn} text-white font-semibold rounded-lg transition-colors`}
                >
                  Take New Photo
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

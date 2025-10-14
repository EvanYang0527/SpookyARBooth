import { useState } from 'react';
import Header from './components/Header';
import CameraView from './components/CameraView';
import EffectPicker, { EffectType } from './components/EffectPicker';
import ResultPanel from './components/ResultPanel';
import { applyEffectWithRetry, EffectsApiError } from './services/effectsApi';
import { Ghost, AlertCircle } from 'lucide-react';

type AppState = 'camera' | 'processing' | 'result' | 'error';

function App() {
  const [state, setState] = useState<AppState>('camera');
  const [selectedEffect, setSelectedEffect] = useState<EffectType>('cartoon_ghost');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [processedImage, setProcessedImage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isRetryable, setIsRetryable] = useState(false);

  const handleCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setState('processing');
    setError('');

    try {
      const result = await applyEffectWithRetry(imageData, selectedEffect, 70);
      setProcessedImage(result);
      setState('result');
    } catch (err) {
      console.error('Effect processing error:', err);

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
      console.error('Effect processing retry error:', err);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 mb-3 flex items-center justify-center gap-3">
            <Ghost className="w-10 h-10 text-orange-400 animate-bounce" />
            Spooky AR Photo Booth
            <Ghost className="w-10 h-10 text-purple-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
          </h1>
          <p className="text-gray-400 text-lg">
            Capture your photo and add haunting Halloween effects
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

              <CameraView
                onCapture={handleCapture}
                isProcessing={state === 'processing'}
              />
            </>
          )}

          {state === 'result' && (
            <ResultPanel
              imageData={processedImage}
              effect={selectedEffect}
              onRetake={handleRetake}
            />
          )}

          {state === 'error' && (
            <div className="w-full">
              <div className="relative w-full aspect-video bg-gray-800 rounded-xl flex flex-col items-center justify-center p-8 border-2 border-red-500/30">
                <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                <h3 className="text-red-400 text-xl font-bold mb-2">Processing Error</h3>
                <p className="text-red-300 text-center mb-6 max-w-md">{error}</p>

                <div className="flex gap-4">
                  {isRetryable && (
                    <button
                      onClick={handleRetryProcessing}
                      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-gray-900 font-semibold rounded-lg transition-colors"
                    >
                      Retry Processing
                    </button>
                  )}

                  <button
                    onClick={handleRetake}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Take New Photo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p className="flex items-center justify-center gap-2">
            Powered by ITS Technology Innovation Office
            <span className="text-orange-400">🎃</span>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;

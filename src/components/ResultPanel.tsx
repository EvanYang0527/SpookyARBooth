import { Download, RotateCcw, Loader2 } from 'lucide-react';
import { EffectType } from './EffectPicker';

interface ResultPanelProps {
  imageData: string;
  effect: EffectType;
  onRetake: () => void;
  isProcessing?: boolean;
}

export default function ResultPanel({ imageData, effect, onRetake, isProcessing }: ResultPanelProps) {
  const downloadImage = () => {
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.download = `spooky-photo-${effect}-${timestamp}.png`;
    link.href = imageData;
    link.click();
  };

  const effectNames: Record<EffectType, string> = {
    cartoon_ghost: 'Cartoon Ghost',
    haunted_fog: 'Haunted Fog',
    vhs_glitch: 'VHS Glitch',
    pumpkin_aura: 'Pumpkin Aura'
  };

  return (
    <div className="w-full">
      <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden border-2 border-orange-500/30 shadow-2xl shadow-orange-500/20">
        {isProcessing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95">
            <Loader2 className="w-16 h-16 text-orange-400 animate-spin mb-4" />
            <p className="text-orange-400 text-lg font-semibold">Applying spooky effects...</p>
            <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
          </div>
        ) : (
          <img
            src={imageData}
            alt="Spooky photo result"
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {!isProcessing && (
        <>
          <div className="mt-4 text-center">
            <p className="text-purple-400 font-semibold">
              Effect Applied: <span className="text-orange-400">{effectNames[effect]}</span>
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={downloadImage}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
            >
              <Download className="w-6 h-6" />
              Download Photo
            </button>

            <button
              onClick={onRetake}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
            >
              <RotateCcw className="w-6 h-6" />
              Retake Photo
            </button>
          </div>
        </>
      )}
    </div>
  );
}

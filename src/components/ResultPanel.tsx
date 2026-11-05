import { Download, RotateCcw, Loader2 } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { EffectType } from './EffectPicker';

interface ResultPanelProps {
  originalImage: string;
  processedImage: string;
  effect: EffectType;
  onRetake: () => void;
  isProcessing?: boolean;
}

type FrameOption = 'Gratitude1' | 'Gratitude2';

const FRAME_CONFIGS: Record<FrameOption, {
  path: string;
  label: string;
  window: { widthRatio: number; heightRatio: number; offsetXRatio: number; offsetYRatio: number };
}> = {
  Gratitude1: {
    path: '/Gratitude1.png',
    label: 'Gratitude (Autumn)',
    window: { widthRatio: 0.84, heightRatio: 0.73, offsetXRatio: 0, offsetYRatio: 0.03 }
  },
  Gratitude2: {
    path: '/Gratitude2.png',
    label: 'Gratitude (Classic)',
    window: { widthRatio: 0.88, heightRatio: 0.7, offsetXRatio: 0, offsetYRatio: 0.0 }
  }
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const drawImageCover = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const imgWidth = image.naturalWidth || image.width;
  const imgHeight = image.naturalHeight || image.height;

  if (imgWidth === 0 || imgHeight === 0) {
    return;
  }

  const imgAspect = imgWidth / imgHeight;
  const boxAspect = width / height;

  let drawWidth = width;
  let drawHeight = height;

  if (imgAspect > boxAspect) {
    drawHeight = height;
    drawWidth = height * imgAspect;
  } else {
    drawWidth = width;
    drawHeight = width / imgAspect;
  }

  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
};

export default function ResultPanel({
  originalImage,
  processedImage,
  effect,
  onRetake,
  isProcessing
}: ResultPanelProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<FrameOption>('Gratitude2');

  const frameConfig = FRAME_CONFIGS[selectedFrame];
  const FRAME_WINDOW = frameConfig.window;

  const frameWindowStyle: CSSProperties = {
    position: 'absolute',
    left: `${((1 - FRAME_WINDOW.widthRatio) / 2 + FRAME_WINDOW.offsetXRatio) * 100}%`,
    top: `${((1 - FRAME_WINDOW.heightRatio) / 2 + FRAME_WINDOW.offsetYRatio) * 100}%`,
    width: `${FRAME_WINDOW.widthRatio * 100}%`,
    height: `${FRAME_WINDOW.heightRatio * 100}%`
  };

  const activeImage = showOriginal ? originalImage || processedImage : processedImage || originalImage;

  const downloadImage = async () => {
    try {
      const [resultImage, frameImage] = await Promise.all([
        loadImage(activeImage),
        loadImage(frameConfig.path)
      ]);

      const width = frameImage.naturalWidth || resultImage.naturalWidth || resultImage.width;
      const height = frameImage.naturalHeight || resultImage.naturalHeight || resultImage.height;
      const windowWidth = width * FRAME_WINDOW.widthRatio;
      const windowHeight = height * FRAME_WINDOW.heightRatio;
      const windowX = width * ((1 - FRAME_WINDOW.widthRatio) / 2 + FRAME_WINDOW.offsetXRatio);
      const windowY = height * ((1 - FRAME_WINDOW.heightRatio) / 2 + FRAME_WINDOW.offsetYRatio);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to initialize canvas rendering context');
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      drawImageCover(ctx, resultImage, windowX, windowY, windowWidth, windowHeight);
      ctx.drawImage(frameImage, 0, 0, width, height);

      const framedImage = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const label = showOriginal ? 'original' : effect;
      link.download = `gratitude-photo-${label}-${timestamp}.png`;
      link.href = framedImage;
      link.click();
    } catch (error) {
      console.error('Failed to download framed image', error);

      const link = document.createElement('a');
      const fallbackStamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      link.download = `gratitude-photo-${effect}-${fallbackStamp}.png`;
      link.href = activeImage;
      link.click();
    }
  };

  const effectNames: Record<EffectType, string> = {
    thanksgiving_glow: 'Thanksgiving Glow',
    autumn_leaves: 'Autumn Leaves',
    grateful_sparkle: 'Grateful Sparkle',
    harvest_magic: 'Harvest Magic',
    cozy_thanksgiving: 'Cozy Thanksgiving',
    fall_confetti: 'Fall Confetti',
    golden_harvest: 'Golden Harvest',
    thankful_moments: 'Thankful Moments',
    pumpkin_patch: 'Pumpkin Patch',
    autumn_bokeh: 'Autumn Bokeh',
    fall_crown: 'Fall Crown',
    thanksgiving_magic: 'Thanksgiving Magic'
  };

  return (
    <div className="w-full">
      {/* Frame selector */}
      {!isProcessing && (
        <div className="mb-4">
          <p className="text-center text-amber-400 font-semibold mb-3">Choose Your Frame</p>
          <div className="flex gap-4 justify-center">
            {(Object.keys(FRAME_CONFIGS) as FrameOption[]).map((frameKey) => {
              const config = FRAME_CONFIGS[frameKey];
              const isActive = selectedFrame === frameKey;
              return (
                <button
                  key={frameKey}
                  onClick={() => setSelectedFrame(frameKey)}
                  className={`relative rounded-xl overflow-hidden border-4 transition-all transform hover:scale-105 shadow-lg ${
                    isActive
                      ? 'border-amber-400 shadow-amber-400/50'
                      : 'border-gray-600 hover:border-amber-400/60'
                  }`}
                  style={{ width: 180, height: 120 }}
                >
                  <img
                    src={config.path}
                    alt={config.label}
                    className="w-full h-full object-fill"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-amber-400/10" />
                  )}
                  <div className={`absolute bottom-0 left-0 right-0 py-1 text-xs font-semibold text-center ${
                    isActive ? 'bg-amber-400 text-gray-900' : 'bg-gray-900/80 text-gray-300'
                  }`}>
                    {config.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Photo preview with frame */}
      <div className="relative aspect-[3/2] bg-gray-800 rounded-xl overflow-hidden border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20">
        {isProcessing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95">
            <Loader2 className="w-16 h-16 text-amber-400 animate-spin mb-4" />
            <p className="text-amber-400 text-lg font-semibold">Applying Thanksgiving effects...</p>
            <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
          </div>
        ) : (
          <div className="absolute inset-0">
            <div
              className="overflow-hidden"
              style={frameWindowStyle}
            >
              <img
                src={activeImage}
                alt={showOriginal ? 'Original photo' : 'Thanksgiving photo result'}
                className="w-full h-full object-cover"
              />
            </div>
            <img
              src={frameConfig.path}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
            />
          </div>
        )}
      </div>

      {!isProcessing && (
        <>
          <div className="mt-4 flex flex-col items-center gap-3 text-center">
            <p className="text-amber-400 font-semibold">
              Effect Applied: <span className="text-orange-400">{effectNames[effect]}</span>
            </p>
            <p className="text-gray-400 text-sm">
              Currently viewing: {showOriginal ? 'Original Photo' : 'Thanksgiving Remix'}
            </p>
            <button
              onClick={() => setShowOriginal((prev) => !prev)}
              className="px-6 py-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors"
            >
              {showOriginal ? 'Show Thanksgiving Photo' : 'Show Original Photo'}
            </button>
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
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
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

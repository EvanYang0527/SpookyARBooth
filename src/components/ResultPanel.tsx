import { Download, RotateCcw, Loader2 } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import type { ThemeFrame } from '../themes';

interface ResultPanelProps {
  originalImage: string;
  processedImage: string;
  effect: string;
  effectName: string;
  frames: Record<string, ThemeFrame>;
  defaultFrame: string;
  processingText?: string;
  onRetake: () => void;
  isProcessing?: boolean;
}

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
  effectName,
  frames,
  defaultFrame,
  processingText = 'Applying effects...',
  onRetake,
  isProcessing
}: ResultPanelProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<string>(defaultFrame);

  const frameConfig = frames[selectedFrame] ?? Object.values(frames)[0];
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
      const currentFrameConfig = frames[selectedFrame] ?? Object.values(frames)[0];
      const [resultImage, frameImage] = await Promise.all([
        loadImage(activeImage),
        loadImage(currentFrameConfig.path)
      ]);

      const currentFW = currentFrameConfig.window;
      const width = frameImage.naturalWidth || resultImage.naturalWidth || resultImage.width;
      const height = frameImage.naturalHeight || resultImage.naturalHeight || resultImage.height;
      const windowWidth = width * currentFW.widthRatio;
      const windowHeight = height * currentFW.heightRatio;
      const windowX = width * ((1 - currentFW.widthRatio) / 2 + currentFW.offsetXRatio);
      const windowY = height * ((1 - currentFW.heightRatio) / 2 + currentFW.offsetYRatio);

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

  return (
    <div className="flex gap-6 h-full">
      {/* Left: photo preview */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="relative aspect-[3/2] bg-gray-800 rounded-xl overflow-hidden border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20">
          {isProcessing ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95">
              <Loader2 className="w-16 h-16 text-amber-400 animate-spin mb-4" />
              <p className="text-amber-400 text-lg font-semibold">{processingText}</p>
              <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
            </div>
          ) : (
            <div className="absolute inset-0">
              <div className="overflow-hidden" style={frameWindowStyle}>
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
          <div className="mt-3 text-center">
            <p className="text-amber-400 font-semibold text-sm">
              Effect Applied: <span className="text-orange-400">{effectName}</span>
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Viewing: {showOriginal ? 'Original Photo' : 'Transformed Photo'}
            </p>
          </div>
        )}
      </div>

      {/* Right: controls */}
      {!isProcessing && (
        <div className="w-64 flex-shrink-0 flex flex-col gap-5">
          {/* Frame selector */}
          <div>
            <p className="text-amber-400 font-semibold text-sm mb-2">Choose Your Frame</p>
            <div className="flex flex-col gap-2">
              {Object.keys(frames).map((frameKey) => {
                const config = frames[frameKey];
                const isActive = selectedFrame === frameKey;
                return (
                  <button
                    key={frameKey}
                    onClick={() => setSelectedFrame(frameKey)}
                    className={`relative rounded-xl overflow-hidden border-4 transition-all hover:scale-[1.02] shadow-md w-full aspect-[3/2] ${
                      isActive
                        ? 'border-amber-400 shadow-amber-400/50'
                        : 'border-gray-600 hover:border-amber-400/60'
                    }`}
                  >
                    <img src={config.path} alt={config.label} className="w-full h-full object-fill" />
                    {isActive && <div className="absolute inset-0 bg-amber-400/10" />}
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

          {/* Toggle original */}
          <button
            onClick={() => setShowOriginal((prev) => !prev)}
            className="w-full px-4 py-2.5 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors text-sm"
          >
            {showOriginal ? 'Show Transformed Photo' : 'Show Original Photo'}
          </button>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-auto">
            <button
              onClick={downloadImage}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Photo
            </button>

            <button
              onClick={onRetake}
              className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Retake Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

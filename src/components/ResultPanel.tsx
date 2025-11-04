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

const FRAME_ASSET_PATH = '/CarnivalFrame.png';
const FRAME_WINDOW = {
  widthRatio: 1,
  heightRatio: 0.8,
  offsetXRatio: 0,
  offsetYRatio: -0.04
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
  const frameWindowStyle: CSSProperties = {
    position: 'absolute',
    left: `${((1 - FRAME_WINDOW.widthRatio) / 2 + FRAME_WINDOW.offsetXRatio) * 100}%`,
    top: `${((1 - FRAME_WINDOW.heightRatio) / 2 + FRAME_WINDOW.offsetYRatio) * 100}%`,
    width: `${FRAME_WINDOW.widthRatio * 100}%`,
    height: `${FRAME_WINDOW.heightRatio * 100}%`
  };

  const [showOriginal, setShowOriginal] = useState(false);
  const activeImage = showOriginal ? originalImage || processedImage : processedImage || originalImage;

  const downloadImage = async () => {
    try {
      const [resultImage, frameImage] = await Promise.all([
        loadImage(activeImage),
        loadImage(FRAME_ASSET_PATH)
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
      link.download = `spooky-photo-${label}-${timestamp}.png`;
      link.href = framedImage;
      link.click();
    } catch (error) {
      console.error('Failed to download framed image', error);

      const link = document.createElement('a');
      const fallbackStamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      link.download = `spooky-photo-${effect}-${fallbackStamp}.png`;
      link.href = activeImage;
      link.click();
    }
  };

  const effectNames: Record<EffectType, string> = {
    cartoon_ghost: 'Cartoon Ghost',
    haunted_fog: 'Haunted Fog',
    vhs_glitch: 'VHS Glitch',
    pumpkin_aura: 'Pumpkin Aura',
    witch_makeover: 'Witch Makeover',
    vampire_glam: 'Vampire Glam',
    zombie_decay: 'Zombie Decay',
    bubble_mirage: 'Bubble Mirage',
    laser_carnival: 'Laser Carnival',
    sparkle_rain: 'Sparkle Rain',
    ai_masquerade: 'AI Masquerade',
    glitch_glam: 'Glitch Glam',
    confetti_explosion: 'Confetti Explosion',
    mask_magic: 'Mask Magic',
    electric_groove: 'Electric Groove',
    joker_illusion: 'Joker Illusion',
    midway_marquee: 'Midway Marquee',
    cotton_candy_twirl: 'Cotton Candy Twirl'
  };

  return (
    <div className="w-full">
      <div className="relative aspect-[3/2] bg-gray-800 rounded-xl overflow-hidden border-2 border-orange-500/30 shadow-2xl shadow-orange-500/20">
        {isProcessing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95">
            <Loader2 className="w-16 h-16 text-orange-400 animate-spin mb-4" />
            <p className="text-orange-400 text-lg font-semibold">Applying spooky effects...</p>
            <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
          </div>
        ) : (
          <div className="absolute inset-0">
            <div
              className="overflow-hidden rounded-lg"
              style={frameWindowStyle}
            >
              <img
                src={activeImage}
                alt={showOriginal ? 'Original photo' : 'Spooky photo result'}
                className="w-full h-full object-cover"
              />
            </div>
            <img
              src={FRAME_ASSET_PATH}
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
            <p className="text-purple-400 font-semibold">
              Effect Applied: <span className="text-orange-400">{effectNames[effect]}</span>
            </p>
            <p className="text-gray-400 text-sm">
              Currently viewing: {showOriginal ? 'Original Photo' : 'Spooky Remix'}
            </p>
            <button
              onClick={() => setShowOriginal((prev) => !prev)}
              className="px-6 py-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors"
            >
              {showOriginal ? 'Show Spooky Photo' : 'Show Original Photo'}
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

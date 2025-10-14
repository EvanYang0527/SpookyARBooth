import { useEffect, useRef, useState } from 'react';
import { Camera, AlertCircle } from 'lucide-react';

interface CameraViewProps {
  onCapture: (imageData: string) => void;
  isProcessing: boolean;
}

export default function CameraView({ onCapture, isProcessing }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [frozenFrame, setFrozenFrame] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
        };
      }
    } catch (err) {
      setError('Camera access denied. Please grant permission to use your camera.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !isCameraReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setFrozenFrame(imageData);
      setIsFrozen(true);
      if (!video.paused) {
        video.pause();
      }
      onCapture(imageData);
    }
  };

  useEffect(() => {
    if (!isProcessing && isFrozen && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise) {
        playPromise.catch(err => {
          console.error('Error resuming camera playback:', err);
        });
      }
      setIsFrozen(false);
      setFrozenFrame(null);
    }
  }, [isProcessing, isFrozen]);

  const retryCamera = () => {
    stopCamera();
    startCamera();
  };

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-gray-800 rounded-xl flex flex-col items-center justify-center p-8 border-2 border-red-500/30">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <p className="text-red-400 text-center mb-4">{error}</p>
        <button
          onClick={retryCamera}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-gray-900 font-semibold rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden border-2 border-orange-500/30 shadow-2xl shadow-orange-500/20">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {isFrozen && frozenFrame && (
          <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
            <img
              src={frozenFrame}
              alt="Captured frame preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-4 border-purple-400/60 m-8 rounded-lg animate-pulse"></div>
          </div>
        )}

        {!isCameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <div className="text-center">
              <Camera className="w-12 h-12 text-orange-400 mx-auto mb-3 animate-pulse" />
              <p className="text-orange-400">Starting camera...</p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none border-4 border-dashed border-purple-400/30 m-8 rounded-lg"></div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-6 flex justify-center">
        <button
          onClick={captureImage}
          disabled={!isCameraReady || isProcessing}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 disabled:scale-100 shadow-lg disabled:cursor-not-allowed flex items-center gap-3"
        >
          <Camera className="w-6 h-6" />
          {isProcessing ? 'Processing...' : 'Capture Photo'}
        </button>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const AUDIT_STORAGE_KEY = 'employee_dashboard_audit_image';

type RouteState = {
  row?: Record<string, unknown>;
};

export default function DetailsPage() {
  const { id = '0' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { row } = (location.state as RouteState) ?? {};

  const videoRef = useRef<HTMLVideoElement>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        // Intentional: do not set streamRef.current = null (see README "Intentional Bug")
      }
    };
  }, []);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch {
      setError('Unable to access camera. Please allow camera permission.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/png');
    setPhotoDataUrl(dataUrl);
    setMergedImage(null);
    stopCamera();
  };

  const withCanvasCoords = (
    event: PointerEvent<HTMLCanvasElement>,
    callback: (x: number, y: number, ctx: CanvasRenderingContext2D) => void
  ) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    callback(x, y, ctx);
  };

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    withCanvasCoords(event, (x, y, ctx) => {
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(x, y);
    });
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    withCanvasCoords(event, (x, y, ctx) => {
      ctx.lineTo(x, y);
      ctx.stroke();
    });
  };

  const handlePointerEnd = () => {
    setDrawing(false);
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const mergeAndContinue = async () => {
    if (!photoDataUrl || !signatureCanvasRef.current) return;

    const image = new Image();
    image.src = photoDataUrl;
    await image.decode();

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = image.width;
    outputCanvas.height = image.height;
    const ctx = outputCanvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(image, 0, 0);
    ctx.drawImage(signatureCanvasRef.current, 0, 0, outputCanvas.width, outputCanvas.height);

    const mergedDataUrl = outputCanvas.toDataURL('image/png');
    setMergedImage(mergedDataUrl);
    localStorage.setItem(AUDIT_STORAGE_KEY, mergedDataUrl);
    navigate(`/analytics/${id}`, { state: { mergedImage: mergedDataUrl, row } });
  };

  return (
    <div className="details-page">
      <h1>Identity Verification</h1>
      <p className="details-subtitle">Employee ID: {id}</p>
      {row && <p className="details-subtitle">Name: {String(row.Name ?? 'Unknown')}</p>}
      {error && <p className="details-error">{error}</p>}

      {!photoDataUrl && (
        <div className="camera-stage">
          <video ref={videoRef} className="camera-view" playsInline muted />
          <div className="details-actions">
            {!cameraReady ? (
              <button type="button" onClick={startCamera}>
                Start Camera
              </button>
            ) : (
              <>
                <button type="button" onClick={capturePhoto}>Capture Photo</button>
                <button type="button" onClick={stopCamera}>Stop Camera</button>
              </>
            )}
          </div>
        </div>
      )}

      {photoDataUrl && (
        <>
          <div className="signature-stage">
            <img src={photoDataUrl} alt="Captured profile" className="captured-photo" />
            <canvas
              ref={signatureCanvasRef}
              width={640}
              height={480}
              className="signature-canvas"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerLeave={handlePointerEnd}
            />
          </div>
          <p className="draw-help">Sign directly over the photo using mouse or touch.</p>
          <div className="details-actions">
            <button type="button" onClick={clearSignature}>Clear Signature</button>
            <button type="button" onClick={mergeAndContinue}>Merge and Continue</button>
          </div>
        </>
      )}

      {mergedImage && (
        <div className="preview-block">
          <p>Audit image preview:</p>
          <img src={mergedImage} alt="Merged audit preview" className="preview-image" />
        </div>
      )}

      <style>{`
        .details-page {
          min-height: 100vh;
          padding: 1rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          background: #f8fafc;
        }
        h1 { margin: 0.25rem 0 0; }
        .details-subtitle { margin: 0; color: #475569; }
        .details-error { color: #b91c1c; margin: 0; }
        .camera-stage, .signature-stage {
          width: min(92vw, 640px);
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: #fff;
        }
        .camera-view, .captured-photo {
          width: 100%;
          display: block;
          border-radius: 8px;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          background: #111827;
        }
        .signature-stage {
          position: relative;
          overflow: hidden;
        }
        .signature-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          touch-action: none;
          cursor: crosshair;
        }
        .details-actions {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .details-actions button {
          border: 1px solid #cbd5e1;
          background: #fff;
          border-radius: 6px;
          padding: 0.5rem 0.8rem;
          cursor: pointer;
        }
        .details-actions button:hover { background: #f1f5f9; }
        .draw-help { margin: 0; color: #475569; }
        .preview-block { width: min(92vw, 640px); }
        .preview-image { width: 100%; border-radius: 8px; border: 1px solid #cbd5e1; }
      `}</style>
    </div>
  );
}

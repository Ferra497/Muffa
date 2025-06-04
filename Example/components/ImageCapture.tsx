'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ImageCaptureProps {
  onImageAnalyzed: (foods: Array<{
    name: string;
    category: string;
    confidence: number;
    suggested_expiry_days: number;
  }>) => void;
  onClose: () => void;
}

export default function ImageCapture({ onImageAnalyzed, onClose }: ImageCaptureProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  console.log('ImageCapture component rendered');

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setError(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Impossibile accedere alla fotocamera. Prova a caricare un\'immagine.');
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    console.log('Capturing photo...');
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageDataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File uploaded:', file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCapturedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;

    console.log('Starting image analysis...');
    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      
      // Create form data
      const formData = new FormData();
      formData.append('image', blob, 'food-image.jpg');

      // Send to API
      const apiResponse = await fetch('/api/analyze-food', {
        method: 'POST',
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();
      console.log('Analysis result received:', result);

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.foods && result.foods.length > 0) {
        toast({
          title: "Alimenti riconosciuti!",
          description: `Trovati ${result.foods.length} alimenti nell'immagine`,
        });
        onImageAnalyzed(result.foods);
      } else {
        toast({
          title: "Nessun alimento riconosciuto",
          description: "Prova con un'altra immagine più chiara",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Error analyzing image:', error);
      setError('Errore durante l\'analisi dell\'immagine. Riprova.');
      toast({
        title: "Errore",
        description: "Impossibile analizzare l'immagine",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetCapture = () => {
    console.log('Resetting capture...');
    setCapturedImage(null);
    setError(null);
    stopCamera();
  };

  // Start camera when component mounts
  useState(() => {
    startCamera();
    return () => stopCamera(); // Cleanup on unmount
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Riconosci alimenti</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
              {error}
            </div>
          )}

          {/* Camera/Image Display */}
          <div className="relative aspect-video bg-neutral-100 rounded-lg overflow-hidden">
            {capturedImage ? (
              <img 
                src={capturedImage} 
                alt="Captured food" 
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Controls */}
          <div className="space-y-3">
            {!capturedImage ? (
              <div className="flex gap-3">
                <Button
                  onClick={capturePhoto}
                  className="flex-1 bg-fresh-gradient text-white"
                  disabled={!!error}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Scatta foto
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="flex-1 bg-fresh-gradient text-white"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Analizzando...
                    </>
                  ) : (
                    'Analizza alimenti'
                  )}
                </Button>
                <Button variant="outline" onClick={resetCapture}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </Card>
    </div>
  );
}
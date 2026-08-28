import React, { useRef, useState, useEffect } from 'react';
import { X, Camera, RefreshCw, Zap, Upload } from 'lucide-react';

export default function PlantCameraScanner({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable, falling back to file input simulation.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 300;
      canvas.height = videoRef.current.videoHeight || 300;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          onCapture(blob);
          onClose();
        }
      }, 'image/jpeg');
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera color="#059669" size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Live Leaf Pathology Scanner</h3>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{
          position: 'relative',
          width: '100%',
          height: '320px',
          background: '#000',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Animated Reticle */}
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            border: '2px dashed #10b981',
            borderRadius: '16px',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981',
            fontWeight: 700,
            fontSize: '0.8rem'
          }}>
            ALIGN LEAF HERE
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '1.25rem' }}>
          <button onClick={toggleCamera} className="btn btn-outline" style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0 }}>
            <RefreshCw size={20} />
          </button>
          
          <button onClick={handleCapture} className="btn btn-primary" style={{ borderRadius: '50%', width: '60px', height: '60px', padding: 0, background: '#059669' }}>
            <Camera size={28} />
          </button>

          <button onClick={onClose} className="btn btn-outline" style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0 }}>
            <Zap size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

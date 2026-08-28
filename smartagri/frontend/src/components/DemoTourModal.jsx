import React, { useState } from 'react';
import { X, ChevronRight, Sparkles, Check } from 'lucide-react';

export default function DemoTourModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: "Welcome to SmartAgri AI 🌾",
      desc: "SmartAgri AI is an end-to-end decision support platform that combines Soil N-P-K Telemetry, Vision Pathology, Yield Regressors, Mandi Price Intelligence, and Government Subsidies."
    },
    {
      title: "1. Soil & Crop Advisor 🌱",
      desc: "Get 98.86% accurate Random Forest crop recommendations based on Nitrogen, Phosphorus, Potassium, pH, and local weather telemetry."
    },
    {
      title: "2. PyTorch Vision Pathology 📸",
      desc: "Scan leaf disease symptoms using your camera. Our ResNet-38 Vision model and Spatial Agreement layer diagnose pathogens with dual-track organic & chemical remedies."
    },
    {
      title: "3. Mandi Market Intelligence 📈",
      desc: "Discover 'Where to Sell' your harvest across 57,000+ daily Agmarknet Mandi price records to maximize profit realization."
    },
    {
      title: "4. RAG Central AI Farmer Assistant 🤖",
      desc: "Chat naturally in English, Hindi, or Hinglish with our ICAR RAG-augmented AI assistant that calls live weather and price tools on the fly."
    }
  ];

  const current = tourSteps[step];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: '#d1fae5', color: '#047857',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          <Sparkles size={30} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', color: '#0f172a' }}>
          {current.title}
        </h3>

        <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {current.desc}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
          {tourSteps.map((_, i) => (
            <div 
              key={i} 
              style={{
                width: i === step ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === step ? '#059669' : '#cbd5e1',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {step < tourSteps.length - 1 ? (
            <button 
              onClick={() => setStep(step + 1)} 
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Next Feature <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              onClick={onClose} 
              className="btn btn-primary"
              style={{ width: '100%', background: '#047857' }}
            >
              Get Started <Check size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

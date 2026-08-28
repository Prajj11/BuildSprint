import React, { useState, useEffect, useContext } from 'react';
import { Camera, Upload, AlertTriangle, ShieldCheck, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import PlantCameraScanner from '../components/PlantCameraScanner';

export default function DiseaseDetection() {
  const [samples, setSamples] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    api.getDiseaseSamples().then(data => {
      if (data && data.samples) setSamples(data.samples);
    }).catch(err => console.error(err));
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      runUploadDiagnosis(file);
    }
  };

  const runUploadDiagnosis = (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    api.diagnoseDiseaseUpload(formData)
      .then(res => setDiagnosis(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSampleClick = (filename) => {
    setLoading(true);
    setPreviewUrl(`/static/samples/${filename}`);
    api.diagnoseDiseaseSample(filename)
      .then(res => setDiagnosis(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleCameraCapture = (blob) => {
    const file = new File([blob], 'camera_scan.jpg', { type: 'image/jpeg' });
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(blob));
    runUploadDiagnosis(file);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      <div>
        <span className="badge badge-dark" style={{ border: '1px solid #10B981', marginBottom: '0.4rem' }}>
          PYTORCH RESNET-38 & SPATIAL CONSENSUS ENGINE
        </span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.2rem', color: '#0F172A', letterSpacing: '-0.5px' }}>
          Computer Vision Leaf Pathology Diagnostics
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
          Scan leaf disease symptoms using your camera or upload leaf images for instant multi-scale vision consensus.
        </p>
      </div>

      <div className="grid-2">
        {/* Leaf Scan Interface */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>Leaf Image Acquisition</h3>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
            <button onClick={() => setIsCameraOpen(true)} className="btn btn-primary" style={{ flex: 1, padding: '0.85rem' }}>
              <Camera size={20} /> Open Live Camera
            </button>
            <label className="btn btn-outline" style={{ flex: 1, padding: '0.85rem', cursor: 'pointer', textAlign: 'center' }}>
              <Upload size={20} /> Upload Leaf File
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          </div>

          {previewUrl && (
            <div style={{ position: 'relative', width: '100%', height: '230px', borderRadius: '14px', overflow: 'hidden', border: '2px solid #10B981', marginBottom: '1.25rem' }}>
              <img src={previewUrl} alt="Leaf preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {loading && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(11, 31, 23, 0.75)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700 }}>
                  <RefreshCw className="spin" size={32} color="#10B981" />
                  <span>PyTorch ResNet-38 Vision Scanning...</span>
                </div>
              )}
            </div>
          )}

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.75rem' }}>
              Test Sample Leaf Images (Click to Scan)
            </h4>
            <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {samples.map((s, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleSampleClick(s.filename)}
                  style={{
                    minWidth: '95px',
                    height: '95px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '2px solid #E2E8F0',
                    position: 'relative'
                  }}
                >
                  <img src={s.url} alt={s.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(11, 31, 23, 0.8)', color: 'white', fontSize: '0.65rem', textAlign: 'center', padding: '2px 0', fontWeight: 700 }}>
                    {s.filename.split('_')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Diagnosis Results */}
        <div className="glass-card">
          {loading ? (
            <div style={{ padding: '4rem 1.5rem', textAlign: 'center', color: '#10B981', fontWeight: 700 }}>
              <RefreshCw className="spin" size={36} style={{ margin: '0 auto 1rem auto' }} />
              Executing PyTorch ResNet-38 & Multi-Scale Spatial Consensus...
            </div>
          ) : diagnosis ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                background: diagnosis.is_low_confidence ? '#FEF3C7' : (diagnosis.status === 'Healthy' ? '#D1FAE5' : '#FEE2E2'),
                border: `1px solid ${diagnosis.is_low_confidence ? '#FDE047' : (diagnosis.status === 'Healthy' ? '#10B981' : '#FCA5A5')}`,
                borderRadius: '14px',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge ${diagnosis.is_low_confidence ? 'badge-warning' : (diagnosis.status === 'Healthy' ? 'badge-primary' : 'badge-danger')}`}>
                    {diagnosis.confidence_tier} ({diagnosis.confidence_percentage})
                  </span>
                  {diagnosis.is_low_confidence && <AlertTriangle color="#B45309" size={20} />}
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.5rem', color: '#0F172A', letterSpacing: '-0.5px' }}>
                  {diagnosis.condition}
                </h2>
                <p style={{ fontSize: '0.85rem', marginTop: '0.2rem', color: '#334155' }}>
                  {diagnosis.symptoms || diagnosis.warning}
                </p>
              </div>

              {/* Treatment Tracks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#047857', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldCheck size={16} /> Certified Organic Treatment
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#065F46' }}>{diagnosis.organic_treatment}</p>
                </div>

                <div style={{ background: '#F8FAF8', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0369A1', marginBottom: '0.3rem' }}>
                    Chemical Intervention (Safe Dilution Ratios)
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#334155' }}>{diagnosis.chemical_treatment}</p>
                </div>

                <div style={{ background: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: '12px', padding: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#B45309', marginBottom: '0.3rem' }}>
                    Cultural Sanitation Steps
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#78350F' }}>{diagnosis.immediate_actions}</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '4rem 1.5rem', textAlign: 'center', color: '#94A3B8' }}>
              <Camera size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#475569' }}>No Image Captured</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>Open live camera or click a sample leaf image to run diagnosis.</p>
            </div>
          )}
        </div>
      </div>

      <PlantCameraScanner 
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
}

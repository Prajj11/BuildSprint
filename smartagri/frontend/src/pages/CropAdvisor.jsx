import React, { useState, useEffect, useContext } from 'react';
import { Sprout, CheckCircle, BarChart2, Sparkles, Sliders } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

export default function CropAdvisor() {
  const { user } = useContext(AuthContext);
  const [inputs, setInputs] = useState({
    N: user?.N || 90,
    P: user?.P || 42,
    K: user?.K || 43,
    temperature: 24.0,
    humidity: 80.0,
    ph: user?.ph || 6.5,
    rainfall: 200.0
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setInputs(prev => ({
        ...prev,
        N: user.N || prev.N,
        P: user.P || prev.P,
        K: user.K || prev.K,
        ph: user.ph || prev.ph
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handlePredict = (e) => {
    e.preventDefault();
    setLoading(true);
    api.predictCrop(inputs)
      .then(res => setResult(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const chartColors = ['#059669', '#0284c7', '#d97706', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }} className="animate-fade-in">
      <div>
        <span className="badge badge-primary">
          <Sparkles size={12} /> RANDOM FOREST ENGINE (98.86% ACCURACY)
        </span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: '#0f172a' }}>
          Soil Macro-Nutrient & Climate Crop Advisor
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Enter your soil testing N-P-K parameters and localized micro-climate to predict optimal crop suitability.
        </p>
      </div>

      <div className="grid-2">
        {/* Input Form */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#0f172a' }}>
            <div style={{ background: '#d1fae5', padding: '0.4rem', borderRadius: '10px', color: '#059669', display: 'flex' }}>
              <Sprout size={18} />
            </div>
            Agronomic Telemetry Inputs
          </h3>

          <form onSubmit={handlePredict} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="grid-3">
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Nitrogen (N) kg/ha</label>
                <input type="number" name="N" value={inputs.N} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Phosphorus (P) kg/ha</label>
                <input type="number" name="P" value={inputs.P} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Potassium (K) kg/ha</label>
                <input type="number" name="K" value={inputs.K} onChange={handleChange} className="input-field" required />
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Temperature (°C)</label>
                <input type="number" step="0.1" name="temperature" value={inputs.temperature} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Humidity (%)</label>
                <input type="number" step="0.1" name="humidity" value={inputs.humidity} onChange={handleChange} className="input-field" required />
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Soil pH (3.5 - 9.0)</label>
                <input type="number" step="0.1" name="ph" value={inputs.ph} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Annual Rainfall (mm)</label>
                <input type="number" step="0.1" name="rainfall" value={inputs.rainfall} onChange={handleChange} className="input-field" required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%', padding: '0.75rem' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="skeleton" style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                  Analyzing Agronomic Telemetry...
                </span>
              ) : 'Predict Recommended Crop'}
            </button>
          </form>
        </div>

        {/* Prediction Results */}
        <div className="glass-card">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
              <div className="skeleton" style={{ height: '90px', borderRadius: '16px' }} />
              <div className="skeleton" style={{ height: '120px', borderRadius: '12px' }} />
              <div className="skeleton" style={{ height: '180px', borderRadius: '12px' }} />
            </div>
          ) : result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-scale-in">
              <div style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
                padding: '1.5rem',
                borderRadius: '16px',
                color: 'white',
                boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.3)'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a7f3d0' }}>
                  PRIMARY RECOMMENDATION
                </span>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.2rem 0', letterSpacing: '-0.02em' }}>{result.recommended_crop}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#ecfdf5' }}>
                  <CheckCircle size={18} color="#a7f3d0" /> Model Confidence: {result.confidence_percentage}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem', color: '#0f172a' }}>Top 3 Alternative Recommended Crops</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {result.top_3.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(248, 250, 252, 0.8)',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>{idx+1}. {item.crop}</span>
                      <span className="badge badge-secondary">{item.percentage}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem', color: '#0f172a' }}>Explainable Feature Importance Weighting</h4>
                <div style={{ width: '100%', height: '180px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(result.feature_importances).map(([k, v]) => ({ name: k, weight: v }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" interval={0} fontSize={11} stroke="#94a3b8" tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                      <Bar dataKey="weight" radius={[6, 6, 0, 0]}>
                        {Object.keys(result.feature_importances).map((_, i) => (
                          <Cell key={i} fill={chartColors[i % chartColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '4rem 1.5rem', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ background: '#f1f5f9', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <BarChart2 size={32} color="#64748b" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#334155' }}>No Prediction Executed</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '0.4rem', color: '#64748b' }}>Fill in soil N-P-K & climate parameters and click predict to calculate optimal crop fit.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

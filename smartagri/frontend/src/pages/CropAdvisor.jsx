import React, { useState, useEffect, useContext } from 'react';
import { Sprout, CheckCircle, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      <div>
        <span className="badge badge-primary">RANDOM FOREST ENGINE (98.86% ACCURACY)</span>
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sprout color="#059669" size={20} /> Agronomic Telemetry Inputs
          </h3>

          <form onSubmit={handlePredict} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="grid-3">
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Nitrogen (N) kg/ha</label>
                <input type="number" name="N" value={inputs.N} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Phosphorus (P) kg/ha</label>
                <input type="number" name="P" value={inputs.P} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Potassium (K) kg/ha</label>
                <input type="number" name="K" value={inputs.K} onChange={handleChange} className="input-field" required />
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Temperature (°C)</label>
                <input type="number" step="0.1" name="temperature" value={inputs.temperature} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Humidity (%)</label>
                <input type="number" step="0.1" name="humidity" value={inputs.humidity} onChange={handleChange} className="input-field" required />
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Soil pH (3.5 - 9.0)</label>
                <input type="number" step="0.1" name="ph" value={inputs.ph} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Annual Rainfall (mm)</label>
                <input type="number" step="0.1" name="rainfall" value={inputs.rainfall} onChange={handleChange} className="input-field" required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
              {loading ? 'Analyzing Agronomic Telemetry...' : 'Predict Recommended Crop'}
            </button>
          </form>
        </div>

        {/* Prediction Results */}
        <div className="glass-card" style={{ background: result ? '#ffffff' : '#f8fafc' }}>
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', padding: '1.25rem', borderRadius: '12px', color: '#047857' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>PRIMARY RECOMMENDATION</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.2rem 0' }}>{result.recommended_crop}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700 }}>
                  <CheckCircle size={18} /> Model Confidence: {result.confidence_percentage}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Top 3 Alternative Recommended Crops</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {result.top_3.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{idx+1}. {item.crop}</span>
                      <span className="badge badge-secondary">{item.percentage}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Explainable Feature Importance Weighting</h4>
                <div style={{ width: '100%', height: '180px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(result.feature_importances).map(([k, v]) => ({ name: k, weight: v }))}>
                      <XAxis dataKey="name" interval={0} fontSize={10} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="weight">
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
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#94a3b8' }}>
              <BarChart2 size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#475569' }}>No Prediction Executed</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>Fill in soil N-P-K & climate parameters and click predict to calculate optimal crop fit.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

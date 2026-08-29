import React, { useState, useEffect, useContext } from 'react';
import { TrendingUp, BarChart2, Sparkles, Sliders } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

export default function YieldPredictor() {
  const { user } = useContext(AuthContext);
  const [inputs, setInputs] = useState({
    crop: user?.primary_crop || "Rice",
    state: user?.state || "Punjab",
    season: "Kharif",
    area_acres: user?.land_acres || 5.0,
    fertilizer_kg_ha: 120.0,
    rainfall_mm: 950.0
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setInputs(prev => ({
        ...prev,
        crop: user.primary_crop || prev.crop,
        state: user.state || prev.state,
        area_acres: user.land_acres || prev.area_acres
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handlePredict = (e) => {
    e.preventDefault();
    setLoading(true);
    api.predictYield({
      ...inputs,
      area_acres: parseFloat(inputs.area_acres),
      fertilizer_kg_ha: parseFloat(inputs.fertilizer_kg_ha),
      rainfall_mm: parseFloat(inputs.rainfall_mm)
    })
      .then(res => setResult(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }} className="animate-fade-in">
      <div>
        <span className="badge badge-secondary">
          <Sparkles size={12} /> GRADIENT BOOSTING REGRESSOR (R² = 0.9870)
        </span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: '#0f172a' }}>
          Agronomic Yield & Harvest Volume Predictor
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Calculate expected harvest yields in Quintals per Acre and Metric Tons per Hectare with min/max confidence bounds.
        </p>
      </div>

      <div className="grid-2" style={{ width: '100%' }}>
        {/* Input Form */}
        <div className="glass-card" style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#0f172a' }}>
            <div style={{ background: '#e0f2fe', padding: '0.4rem', borderRadius: '10px', color: '#0284c7', display: 'flex' }}>
              <TrendingUp size={18} />
            </div>
            Crop & Land Specifications
          </h3>

          <form onSubmit={handlePredict} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="grid-2">
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Crop Commodity</label>
                <select name="crop" value={inputs.crop} onChange={handleChange} className="select-field">
                  {["Rice", "Maize", "Wheat", "Cotton", "Potato", "Tomato", "Apple", "Grapes", "Chickpea", "Banana"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>State Jurisdiction</label>
                <select name="state" value={inputs.state} onChange={handleChange} className="select-field">
                  {["Punjab", "Maharashtra", "Uttar Pradesh", "Madhya Pradesh", "Karnataka", "Gujarat", "Haryana", "Goa"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Harvest Season</label>
                <select name="season" value={inputs.season} onChange={handleChange} className="select-field">
                  <option value="Kharif">Kharif (Monsoon)</option>
                  <option value="Rabi">Rabi (Winter)</option>
                  <option value="Zaid">Zaid (Summer)</option>
                  <option value="Whole Year">Whole Year</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Farm Land Size (Acres)</label>
                <input type="number" step="0.5" name="area_acres" value={inputs.area_acres} onChange={handleChange} className="input-field" required />
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Fertilizer Dosage (kg/ha)</label>
                <input type="number" step="10" name="fertilizer_kg_ha" value={inputs.fertilizer_kg_ha} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Seasonal Rainfall (mm)</label>
                <input type="number" step="50" name="rainfall_mm" value={inputs.rainfall_mm} onChange={handleChange} className="input-field" required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-secondary" style={{ marginTop: '0.5rem', width: '100%', padding: '0.75rem' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="skeleton" style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                  Executing Regressor...
                </span>
              ) : 'Calculate Expected Harvest Yield'}
            </button>
          </form>
        </div>

        {/* Prediction Results */}
        <div className="glass-card" style={{ minWidth: 0 }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
              <div className="skeleton" style={{ height: '100px', borderRadius: '16px' }} />
              <div className="skeleton" style={{ height: '80px', borderRadius: '12px' }} />
            </div>
          ) : result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-scale-in">
              <div style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                padding: '1.5rem',
                borderRadius: '16px',
                color: 'white',
                boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.3)'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bae6fd' }}>
                  PREDICTED YIELD PER ACRE
                </span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.2rem 0', letterSpacing: '-0.02em' }}>
                  {result.predicted_yield_quintals_per_acre} <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Quintals/Acre</span>
                </h2>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e0f2fe' }}>
                  Equivalent to <strong>{result.predicted_yield_tons_per_hectare} Metric Tons / Hectare</strong>
                </div>
              </div>

              <div className="grid-2">
                <div style={{ background: '#f8fafc', padding: '1.1rem', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>TOTAL HARVEST VOLUME</span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                    {result.total_production_quintals} Qtl
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>({result.total_production_tons} Metric Tons)</span>
                </div>

                <div style={{ background: '#ecfdf5', padding: '1.1rem', borderRadius: '14px', border: '1px solid #a7f3d0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>CONFIDENCE RANGE (MIN - MAX)</span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#047857', marginTop: '0.2rem' }}>
                    {result.confidence_range.min} - {result.confidence_range.max} Qtl/Acre
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>Expected harvest variance ±12%</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '4rem 1.5rem', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ background: '#f1f5f9', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <BarChart2 size={32} color="#64748b" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#334155' }}>No Yield Calculation Yet</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '0.4rem', color: '#64748b' }}>Select commodity parameters and click predict to forecast total production tons.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

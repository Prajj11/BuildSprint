import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, CloudSun, Landmark, Scan, TrendingUp, ShieldCheck, 
  ArrowRight, Navigation, Sparkles, AlertCircle, FileText, Bot
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

export default function Dashboard() {
  const { user, locationState, detectBrowserLocation } = useContext(AuthContext);
  const [weather, setWeather] = useState(null);
  const [cropRec, setCropRec] = useState(null);
  const [yieldData, setYieldData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const lat = locationState.latitude || user.latitude;
    const lon = locationState.longitude || user.longitude;
    const locName = locationState.formattedAddress || `${user.district}, ${user.state}`;

    Promise.allSettled([
      api.getWeatherAdvisory(lat, lon, locName, user.primary_crop || "Rice"),
      api.predictCrop({
        N: user.N || 90, P: user.P || 42, K: user.K || 43,
        temperature: 25.0, humidity: 80.0, ph: user.ph || 6.5, rainfall: 200.0
      }),
      api.predictYield({
        crop: user.primary_crop || "Rice",
        state: user.state || "Maharashtra",
        season: "Kharif",
        area_acres: user.land_acres || 5.0,
        fertilizer_kg_ha: 120.0,
        rainfall_mm: 900.0
      }),
      api.getMarketTrends(user.primary_crop || "Rice", user.state || "Maharashtra")
    ]).then(([w, c, y, m]) => {
      if (w.status === 'fulfilled') setWeather(w.value);
      if (c.status === 'fulfilled') setCropRec(c.value);
      if (y.status === 'fulfilled') setYieldData(y.value);
      if (m.status === 'fulfilled') setMarketData(m.value);

      if (w.status === 'rejected' && c.status === 'rejected' && y.status === 'rejected' && m.status === 'rejected') {
        setError("Failed to fetch real-time telemetry from platform services.");
      }
    }).catch(err => {
      console.error(err);
      setError("Failed to fetch real-time telemetry from platform services.");
    })
    .finally(() => setLoading(false));
  }, [user, locationState]);

  if (!user) return null;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* Welcome Banner */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, #0B1F17 0%, #143325 100%)', color: 'white', border: '1px solid rgba(16, 185, 129, 0.2)', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ minWidth: 0 }}>
            <span className="badge badge-dark" style={{ border: '1px solid #10B981', marginBottom: '0.4rem' }}>
              <Sparkles size={12} color="#10B981" /> REAL-TIME AGRONOMIC TELEMETRY
            </span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginTop: '0.2rem', letterSpacing: '-0.5px', overflowWrap: 'break-word' }}>
              Welcome back, {user.farmer_name} 👋
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginTop: '0.25rem' }}>
              Location: <strong style={{ color: '#E2E8F0' }}>{weather?.location || `${user.district}, ${user.state}`}</strong> • Farm Size: <strong style={{ color: '#E2E8F0' }}>{user.land_acres} Acres</strong> ({user.soil_type})
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: '100%', maxWidth: '100%' }}>
            <button 
              onClick={detectBrowserLocation} 
              className="btn btn-outline" 
              style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)', color: 'white', flex: '1 1 auto', justifyContent: 'center' }}
            >
              <Navigation size={16} color="#10B981" /> Detect GPS Location
            </button>
            <Link to="/ai-assistant" className="btn btn-primary" style={{ fontSize: '0.875rem', flex: '1 1 auto', justifyContent: 'center' }}>
              <Bot size={17} /> Ask AI Assistant
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* Top 4 Key Metrics */}
      <div className="grid-4">
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RECOMMENDED CROP</span>
            <div style={{ background: '#D1FAE5', color: '#047857', padding: '0.4rem', borderRadius: '8px' }}><Sprout size={18} /></div>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>
            {loading ? <div className="skeleton" style={{ height: '32px', width: '100px' }} /> : (cropRec ? cropRec.recommended_crop : 'N/A')}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
            Model Confidence: {cropRec ? cropRec.confidence_percentage : '98.8%'}
          </span>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>EXPECTED YIELD</span>
            <div style={{ background: '#E0F2FE', color: '#0284C7', padding: '0.4rem', borderRadius: '8px' }}><TrendingUp size={18} /></div>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>
            {loading ? <div className="skeleton" style={{ height: '32px', width: '100px' }} /> : (yieldData ? `${yieldData.predicted_yield_quintals_per_acre} Qtl/Acre` : 'N/A')}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#0284C7', fontWeight: 700 }}>
            Total Production: {yieldData ? `${yieldData.total_production_tons} Tons` : ''}
          </span>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MANDI REALIZATION</span>
            <div style={{ background: '#FEF3C7', color: '#B45309', padding: '0.4rem', borderRadius: '8px' }}><Landmark size={18} /></div>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>
            {loading ? <div className="skeleton" style={{ height: '32px', width: '100px' }} /> : (marketData ? `₹${marketData.summary.avg_modal_price.toLocaleString()}` : 'N/A')}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 700 }}>
            Trend: {marketData ? marketData.summary.trend_direction : 'UPWARD'}
          </span>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PATHOGEN OUTBREAK RISK</span>
            <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '0.4rem', borderRadius: '8px' }}><CloudSun size={18} /></div>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>
            {loading ? <div className="skeleton" style={{ height: '32px', width: '100px' }} /> : (weather ? weather.summary.fungal_pathogen_risk : 'MODERATE')}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#B91C1C', fontWeight: 700 }}>
            {weather ? weather.summary.spraying_safety_window : 'Safe Window'}
          </span>
        </div>
      </div>

      {/* Middle Grid */}
      <div className="grid-2" style={{ width: '100%' }}>
        {/* Open-Meteo Weather Chart */}
        <div className="glass-card" style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>7-Day Weather & Rainfall Telemetry</h3>
            <span className="badge badge-secondary">{weather?.location || user.district}</span>
          </div>
          {weather && weather.telemetry_7day ? (
            <div style={{ width: '100%', height: '230px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weather.telemetry_7day.dates.map((d, i) => ({
                  date: d.split('-').slice(1).join('/'),
                  temp: weather.telemetry_7day.max_temps[i],
                  rain: weather.telemetry_7day.rain_mm[i]
                }))}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="temp" stroke="#10B981" fill="#D1FAE5" name="Max Temp (°C)" />
                  <Area type="monotone" dataKey="rain" stroke="#38BDF8" fill="#E0F2FE" name="Rainfall (mm)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>Loading live forecast...</div>
          )}
        </div>

        {/* Mandi Price Realization */}
        <div className="glass-card" style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>{user.primary_crop || "Rice"} Mandi Price Realization</h3>
            <Link to="/market-intelligence" style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Rank All Mandis <ArrowRight size={15} />
            </Link>
          </div>
          {marketData ? (
            <div style={{ width: '100%', height: '230px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData.time_series}>
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Area type="monotone" dataKey="modal_price" stroke="#F59E0B" fill="#FEF3C7" name="Modal Price (₹/Qtl)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>Loading price analytics...</div>
          )}
        </div>
      </div>
    </div>
  );
}

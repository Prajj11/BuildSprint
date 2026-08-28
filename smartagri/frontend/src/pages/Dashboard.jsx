import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, CloudSun, Landmark, Scan, TrendingUp, ShieldCheck, ArrowRight, Navigation, RefreshCw } from 'lucide-react';
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

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const lat = locationState.latitude || user.latitude;
    const lon = locationState.longitude || user.longitude;
    const locName = locationState.formattedAddress || `${user.district}, ${user.state}`;

    Promise.all([
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
      setWeather(w);
      setCropRec(c);
      setYieldData(y);
      setMarketData(m);
    }).catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, [user, locationState]);

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* Welcome Banner */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #e0f2fe 100%)', border: '1px solid #a7f3d0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-primary">AUTHENTICATED REAL FARMER TELEMETRY</span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.4rem', color: '#0f172a' }}>
              Welcome back, {user.farmer_name} 👋
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.2rem' }}>
              Location: <strong>{weather?.location || `${user.district}, ${user.state}`}</strong> • Farm Size: <strong>{user.land_acres} Acres</strong> ({user.soil_type})
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={detectBrowserLocation} 
              className="btn btn-outline" 
              style={{ fontSize: '0.85rem', background: 'white', borderColor: '#10b981', color: '#047857' }}
            >
              <Navigation size={16} /> Use GPS Location
            </button>
            <Link to="/ai-assistant" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
              Ask AI Assistant
            </Link>
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid-4">
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>RECOMMENDED CROP</span>
            <Sprout size={20} color="#059669" />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#047857' }}>
            {cropRec ? cropRec.recommended_crop : 'Analyzing...'}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
            Confidence: {cropRec ? cropRec.confidence_percentage : 'High Precision'}
          </span>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>EXPECTED YIELD</span>
            <TrendingUp size={20} color="#0284c7" />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0369a1' }}>
            {yieldData ? `${yieldData.predicted_yield_quintals_per_acre} Qtl/Acre` : 'Calculating...'}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>
            Total Harvest: {yieldData ? `${yieldData.total_production_tons} Metric Tons` : ''}
          </span>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>MANDI REALIZATION</span>
            <Landmark size={20} color="#d97706" />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b45309' }}>
            {marketData ? `₹${marketData.summary.avg_modal_price.toLocaleString()}` : 'Fetching...'}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600 }}>
            Trend: {marketData ? marketData.summary.trend_direction : 'REAL TIME'}
          </span>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>FUNGAL RISK LEVEL</span>
            <CloudSun size={20} color="#dc2626" />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b91c1c' }}>
            {weather ? weather.summary.fungal_pathogen_risk : 'EVALUATING'}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>
            {weather ? weather.summary.spraying_safety_window : 'Spraying Window'}
          </span>
        </div>
      </div>

      {/* Middle Grid */}
      <div className="grid-2">
        {/* Weather Chart */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Open-Meteo Real-Time Forecast</h3>
            <span className="badge badge-secondary">{weather?.location || user.district}</span>
          </div>
          {weather && weather.telemetry_7day ? (
            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weather.telemetry_7day.dates.map((d, i) => ({
                  date: d.split('-').slice(1).join('/'),
                  temp: weather.telemetry_7day.max_temps[i],
                  rain: weather.telemetry_7day.rain_mm[i]
                }))}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="temp" stroke="#059669" fill="#d1fae5" name="Max Temp (°C)" />
                  <Area type="monotone" dataKey="rain" stroke="#0284c7" fill="#e0f2fe" name="Rainfall (mm)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Fetching live forecast...</div>
          )}
        </div>

        {/* Mandi Price Trends */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{user.primary_crop || "Rice"} Mandi Price Realization</h3>
            <Link to="/market-intelligence" style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>
              Rank All Mandis <ArrowRight size={14} />
            </Link>
          </div>
          {marketData ? (
            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData.time_series}>
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Area type="monotone" dataKey="modal_price" stroke="#d97706" fill="#fef3c7" name="Modal Price (₹/Qtl)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Fetching price data...</div>
          )}
        </div>
      </div>
    </div>
  );
}

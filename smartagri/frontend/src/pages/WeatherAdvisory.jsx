import React, { useState, useEffect, useContext } from 'react';
import { CloudSun, Navigation, Sliders, RefreshCw, Sparkles, Thermometer, Droplets, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

export default function WeatherAdvisory() {
  const { user, locationState, detectBrowserLocation } = useContext(AuthContext);
  const [advisory, setAdvisory] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [tempOffset, setTempOffset] = useState(0.0);
  const [rainMultiplier, setRainMultiplier] = useState(1.0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const lat = locationState.latitude || user.latitude;
    const lon = locationState.longitude || user.longitude;
    const locName = locationState.formattedAddress || `${user.district}, ${user.state}`;

    api.getWeatherAdvisory(lat, lon, locName, user.primary_crop || "Rice")
      .then(res => setAdvisory(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user, locationState]);

  useEffect(() => {
    if (!user) return;
    const lat = locationState.latitude || user.latitude;
    const lon = locationState.longitude || user.longitude;

    api.predictWeatherScenario(tempOffset, rainMultiplier, lat, lon)
      .then(res => setScenario(res))
      .catch(err => console.error(err));
  }, [user, tempOffset, rainMultiplier, locationState]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-secondary">
            <Sparkles size={12} /> OPEN-METEO REST API TELEMETRY
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: '#0f172a' }}>
            Live Meteorological Telemetry & Stress Scenario Simulator
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Current weather conditions & 7-day Open-Meteo forecast for {advisory?.location || `${user?.district}, ${user?.state}`}.
          </p>
        </div>

        <button 
          onClick={detectBrowserLocation} 
          className="btn btn-outline" 
          style={{ background: 'white', borderColor: '#0284c7', color: '#0284c7' }}
        >
          <Navigation size={18} /> GPS Location
        </button>
      </div>

      {loading ? (
        <div className="grid-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="glass-card">
              <div className="skeleton" style={{ height: '16px', width: '60%', marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ height: '32px', width: '80%' }} />
            </div>
          ))}
        </div>
      ) : advisory && (
        <div className="grid-4">
          <div className="glass-card glass-card-interactive">
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>CURRENT TEMP & HUMIDITY</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
              {advisory.current_weather.temperature_c || advisory.summary.mean_max_temperature_c}°C
            </h3>
            <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 600 }}>Humidity: {advisory.current_weather.humidity_pct || advisory.summary.mean_humidity_pct}%</span>
          </div>
          <div className="glass-card glass-card-interactive">
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>7-DAY CUMULATIVE RAIN</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284c7', marginTop: '0.2rem' }}>
              {advisory.summary.total_rainfall_mm} mm
            </h3>
            <span style={{ fontSize: '0.775rem', color: '#0284c7', fontWeight: 600 }}>Expected Precipitation</span>
          </div>
          <div className="glass-card glass-card-interactive">
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>FUNGAL PATHOGEN RISK</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e11d48', marginTop: '0.2rem' }}>
              {advisory.summary.fungal_pathogen_risk}
            </h3>
            <span style={{ fontSize: '0.775rem', color: '#e11d48', fontWeight: 600 }}>Micro-Climate Assessment</span>
          </div>
          <div className="glass-card glass-card-interactive">
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>SPRAYING SAFETY WINDOW</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#047857', marginTop: '0.2rem' }}>
              {advisory.summary.spraying_safety_window}
            </h3>
            <span style={{ fontSize: '0.775rem', color: '#047857', fontWeight: 600 }}>Optimal Field Work</span>
          </div>
        </div>
      )}

      {/* Interactive Scenario Simulator */}
      <div className="glass-card" style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <div style={{ background: '#d1fae5', padding: '0.4rem', borderRadius: '10px', color: '#059669', display: 'flex' }}>
            <Sliders size={20} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Real-Time Interactive Stress Scenario Simulator</h3>
        </div>

        <div className="grid-2" style={{ marginBottom: '1.5rem', width: '100%' }}>
          <div style={{ minWidth: 0 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
              Temperature Anomaly Offset: <strong style={{ color: '#059669' }}>{tempOffset > 0 ? `+${tempOffset}` : tempOffset}°C</strong>
            </label>
            <input 
              type="range" min="-3.0" max="5.0" step="0.5" 
              value={tempOffset} 
              onChange={(e) => setTempOffset(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#059669', cursor: 'pointer' }}
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
              Monsoon Surge Multiplier: <strong style={{ color: '#0284c7' }}>{rainMultiplier}x</strong>
            </label>
            <input 
              type="range" min="0.0" max="2.5" step="0.1" 
              value={rainMultiplier} 
              onChange={(e) => setRainMultiplier(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
            />
          </div>
        </div>

        {scenario && (
          <div className="grid-4" style={{ marginBottom: '1.5rem', width: '100%' }}>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'var(--card-shadow-sm)', minWidth: 0 }}>
              <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>EMA PREDICTED TEMP</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669', marginTop: '0.1rem' }}>{scenario.metrics.ema_predicted_temp_c}°C</h4>
            </div>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'var(--card-shadow-sm)', minWidth: 0 }}>
              <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>SIMULATED RAIN</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0284c7', marginTop: '0.1rem' }}>{scenario.metrics.seven_day_cumulative_rain_mm} mm</h4>
            </div>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'var(--card-shadow-sm)', minWidth: 0 }}>
              <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>EVAPOTRANSPIRATION DEFICIT</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#d97706', marginTop: '0.1rem' }}>{scenario.metrics.evapotranspiration_deficit_mm} mm/day</h4>
            </div>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'var(--card-shadow-sm)', minWidth: 0 }}>
              <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>SIMULATED FUNGAL RISK</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#e11d48', marginTop: '0.1rem' }}>{scenario.metrics.fungal_risk_level}</h4>
            </div>
          </div>
        )}

        {scenario && (
          <div style={{ width: '100%', height: '240px', background: 'white', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scenario.simulated_series.dates.map((d, i) => ({
                day: d,
                temp: scenario.simulated_series.simulated_max_temp[i],
                rain: scenario.simulated_series.simulated_rain_mm[i]
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Legend />
                <Line type="monotone" dataKey="temp" stroke="#059669" name="Simulated Max Temp (°C)" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="rain" stroke="#0284c7" name="Simulated Rain (mm)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

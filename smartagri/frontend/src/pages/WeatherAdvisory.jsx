import React, { useState, useEffect, useContext } from 'react';
import { CloudSun, Navigation, Sliders, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-secondary">OPEN-METEO REST API TELEMETRY</span>
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
          <Navigation size={18} /> Use Current GPS Location
        </button>
      </div>

      {advisory && (
        <div className="grid-4">
          <div className="glass-card">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>CURRENT TEMP & HUMIDITY</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
              {advisory.current_weather.temperature_c || advisory.summary.mean_max_temperature_c}°C
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Humidity: {advisory.current_weather.humidity_pct || advisory.summary.mean_humidity_pct}%</span>
          </div>
          <div className="glass-card">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>7-DAY CUMULATIVE RAIN</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7', marginTop: '0.2rem' }}>
              {advisory.summary.total_rainfall_mm} mm
            </h3>
          </div>
          <div className="glass-card">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>FUNGAL PATHOGEN RISK</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626', marginTop: '0.2rem' }}>
              {advisory.summary.fungal_pathogen_risk}
            </h3>
          </div>
          <div className="glass-card">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>SPRAYING SAFETY WINDOW</span>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#047857', marginTop: '0.2rem' }}>
              {advisory.summary.spraying_safety_window}
            </h3>
          </div>
        </div>
      )}

      {/* Interactive Scenario Simulator */}
      <div className="glass-card" style={{ background: '#f8fafc', border: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sliders size={20} color="#059669" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Real-Time Interactive Stress Scenario Simulator</h3>
        </div>

        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              Temperature Anomaly Offset: <strong>{tempOffset > 0 ? `+${tempOffset}` : tempOffset}°C</strong>
            </label>
            <input 
              type="range" min="-3.0" max="5.0" step="0.5" 
              value={tempOffset} 
              onChange={(e) => setTempOffset(parseFloat(e.target.value))}
              style={{ width: '100%', marginTop: '0.5rem', accentColor: '#059669' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
              Monsoon Surge Multiplier: <strong>{rainMultiplier}x</strong>
            </label>
            <input 
              type="range" min="0.0" max="2.5" step="0.1" 
              value={rainMultiplier} 
              onChange={(e) => setRainMultiplier(parseFloat(e.target.value))}
              style={{ width: '100%', marginTop: '0.5rem', accentColor: '#0284c7' }}
            />
          </div>
        </div>

        {scenario && (
          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            <div style={{ background: 'white', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>EMA PREDICTED TEMP</span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>{scenario.metrics.ema_predicted_temp_c}°C</h4>
            </div>
            <div style={{ background: 'white', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>SIMULATED RAIN</span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0284c7' }}>{scenario.metrics.seven_day_cumulative_rain_mm} mm</h4>
            </div>
            <div style={{ background: 'white', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>EVAPOTRANSPIRATION DEFICIT</span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#d97706' }}>{scenario.metrics.evapotranspiration_deficit_mm} mm/day</h4>
            </div>
            <div style={{ background: 'white', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>SIMULATED FUNGAL RISK</span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#dc2626' }}>{scenario.metrics.fungal_risk_level}</h4>
            </div>
          </div>
        )}

        {scenario && (
          <div style={{ width: '100%', height: '220px', background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scenario.simulated_series.dates.map((d, i) => ({
                day: d,
                temp: scenario.simulated_series.simulated_max_temp[i],
                rain: scenario.simulated_series.simulated_rain_mm[i]
              }))}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temp" stroke="#059669" name="Simulated Max Temp (°C)" strokeWidth={2} />
                <Line type="monotone" dataKey="rain" stroke="#0284c7" name="Simulated Rain (mm)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

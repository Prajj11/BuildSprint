import React, { useState, useEffect, useContext } from 'react';
import { Landmark } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

export default function MarketIntelligence() {
  const { user } = useContext(AuthContext);
  const [commodity, setCommodity] = useState(user?.primary_crop || "Rice");
  const [state, setState] = useState(user?.state || "Maharashtra");
  const [trends, setTrends] = useState(null);
  const [whereToSell, setWhereToSell] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      if (!commodity) setCommodity(user.primary_crop || "Rice");
      if (!state) setState(user.state || "Maharashtra");
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getMarketTrends(commodity, state),
      api.getWhereToSell(commodity, state)
    ]).then(([t, w]) => {
      setTrends(t);
      setWhereToSell(w);
    }).catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, [commodity, state]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      <div>
        <span className="badge badge-warning">57,330 AGMARKNET DAILY MANDI RECORDS</span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: '#0f172a' }}>
          Mandi Wholesale Market Intelligence & "Where to Sell" Smart Ranker
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Compare real-time wholesale price trends and discover the highest net profit realization APMC mandis.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem' }}>
        <div className="grid-2">
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Select Commodity</label>
            <select value={commodity} onChange={(e) => setCommodity(e.target.value)} className="input-field">
              {["Rice", "Maize", "Wheat", "Cotton", "Potato", "Tomato", "Apple", "Grapes", "Onion", "Soybean"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Filter State Jurisdiction</label>
            <select value={state} onChange={(e) => setState(e.target.value)} className="input-field">
              {["Maharashtra", "Punjab", "Uttar Pradesh", "Madhya Pradesh", "Karnataka", "Gujarat", "Haryana", "Goa", "All"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Market Trends Chart & Summary */}
      {trends && (
        <div className="grid-3">
          <div className="glass-card" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                Wholesale Price Time-Series ({trends.commodity} - {trends.state})
              </h3>
              <span className="badge badge-primary">{trends.summary.trend_direction}</span>
            </div>
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends.time_series}>
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Area type="monotone" dataKey="modal_price" stroke="#d97706" fill="#fef3c7" name="Modal Price (₹/Qtl)" />
                  <Area type="monotone" dataKey="max_price" stroke="#059669" fill="transparent" name="Max Price (₹/Qtl)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Market Realization Analytics</h3>
            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>AVERAGE MODAL PRICE</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309' }}>₹{trends.summary.avg_modal_price.toLocaleString()} / Qtl</h3>
            </div>
            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>MIN - MAX SPREAD</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>₹{trends.summary.min_price} - ₹{trends.summary.max_price}</h3>
            </div>
            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>VOLATILITY INDEX</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0284c7' }}>{trends.summary.volatility_index}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Where to Sell Smart Ranker */}
      {whereToSell && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Landmark color="#059669" size={22} /> "Where Should I Sell?" Smart Mandi Ranker
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Rank</th>
                  <th style={{ padding: '0.75rem' }}>APMC Mandi Name</th>
                  <th style={{ padding: '0.75rem' }}>Location</th>
                  <th style={{ padding: '0.75rem' }}>Modal Price</th>
                  <th style={{ padding: '0.75rem' }}>Distance & Freight</th>
                  <th style={{ padding: '0.75rem' }}>Net Realization</th>
                  <th style={{ padding: '0.75rem' }}>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {whereToSell.ranked_mandis.map((m) => (
                  <tr key={m.rank} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 800, color: m.rank <= 3 ? '#059669' : '#475569' }}>#{m.rank}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 700 }}>{m.mandi}</td>
                    <td style={{ padding: '0.75rem', color: '#64748b' }}>{m.district}, {m.state}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#b45309' }}>₹{m.avg_modal_price.toLocaleString()}</td>
                    <td style={{ padding: '0.75rem', color: '#64748b' }}>{m.distance_km} km (₹{m.estimated_freight_cost_per_quintal || 30}/Qtl)</td>
                    <td style={{ padding: '0.75rem', fontWeight: 800, color: '#047857' }}>₹{m.net_realization_per_quintal.toLocaleString()} / Qtl</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${m.rank <= 3 ? 'badge-primary' : 'badge-secondary'}`}>
                        {m.recommendation_tier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

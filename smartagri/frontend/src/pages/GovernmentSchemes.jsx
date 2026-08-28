import React, { useState, useEffect, useContext } from 'react';
import { ExternalLink } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

export default function GovernmentSchemes() {
  const { user } = useContext(AuthContext);
  const [schemes, setSchemes] = useState([]);
  const [matched, setMatched] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('matched');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      api.searchSchemes(searchQuery, category),
      api.matchSchemesProfile({ state: user.state || "Maharashtra", land_acres: user.land_acres || 5.0, crop: user.primary_crop || "Rice" })
    ]).then(([sRes, mRes]) => {
      setSchemes(sRes.schemes || []);
      setMatched(mRes.matched_schemes || []);
    }).catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, [searchQuery, category, user]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      <div>
        <span className="badge badge-primary">MYSCHEME GOI & MINISTRY OF AGRICULTURE REGISTRY</span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: '#0f172a' }}>
          Government Subsidies & Financial Assistance Portal
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Automated eligibility matcher linking your state jurisdiction and landholding to direct benefits and subsidies.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0' }}>
        <button 
          onClick={() => setActiveTab('matched')}
          style={{
            padding: '0.65rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'matched' ? '3px solid #059669' : 'none',
            color: activeTab === 'matched' ? '#059669' : '#64748b'
          }}
        >
          Matched for Your Profile ✨ ({matched.length})
        </button>
        <button 
          onClick={() => setActiveTab('all')}
          style={{
            padding: '0.65rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'all' ? '3px solid #059669' : 'none',
            color: activeTab === 'all' ? '#059669' : '#64748b'
          }}
        >
          Search All Schemes ({schemes.length})
        </button>
      </div>

      {activeTab === 'all' && (
        <div className="glass-card" style={{ padding: '1rem' }}>
          <div className="grid-2">
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search scheme name, keyword or subsidy..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field" 
              />
            </div>
            <div>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
                <option value="All">All Categories</option>
                <option value="Direct Benefit Transfer">Direct Benefit Transfer</option>
                <option value="Crop Insurance">Crop Insurance</option>
                <option value="Credit & Subsidy">Credit & Subsidy</option>
                <option value="Equipment Subsidy">Equipment Subsidy</option>
                <option value="Organic Farming">Organic Farming</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Scheme Cards Grid */}
      <div className="grid-2">
        {(activeTab === 'matched' ? matched : schemes).map((s, idx) => (
          <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-primary">{s.category}</span>
                {s.match_score && <span className="badge badge-secondary">{s.match_score}</span>}
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                {s.scheme_name}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                {s.benefits_summary}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', pt: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                Eligible: {s.eligible_states}
              </span>
              <a 
                href={s.portal_url} 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-outline"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                Official Portal <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

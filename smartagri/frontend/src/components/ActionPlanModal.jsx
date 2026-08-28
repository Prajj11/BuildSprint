import React, { useEffect, useState, useContext } from 'react';
import { X, ShieldCheck, Download, CheckCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function ActionPlanModal({ isOpen, onClose }) {
  const { user } = useContext(AuthContext);
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setLoading(true);
      api.generateActionPlan({
        state: user.state,
        district: user.district,
        crop: user.primary_crop || "Rice",
        land_acres: user.land_acres,
        N: user.N, P: user.P, K: user.K, ph: user.ph
      })
      .then(res => setPlanData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '820px', borderRadius: '20px', boxShadow: 'var(--card-shadow-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', padding: '0.6rem', borderRadius: '14px', color: 'white', boxShadow: '0 4px 12px rgba(5,150,105,0.25)' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Consolidated 8-Point Farm Action Plan</h2>
              <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Synthesized AI Agronomic Strategy for {user.farmer_name} ({user.district}, {user.state})</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: '50%' }} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
            <div className="skeleton" style={{ width: '60%', height: '20px' }} />
            <div className="skeleton" style={{ width: '100%', height: '140px', borderRadius: '12px' }} />
          </div>
        ) : planData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-scale-in">
            <div className="grid-2">
              {Object.entries(planData.action_plan_8_points).map(([key, item]) => (
                <div key={key} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.1rem', boxShadow: 'var(--card-shadow-sm)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                    {item.recommendation || item.spraying_window || item.predicted_yield || item.target_mandi || item.recommended_scheme || item.overall_risk_score}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.35rem', fontWeight: 600 }}>
                    {item.rationale || item.action || item.temperature_alert || item.preventative_action || item.total_estimated_harvest || item.net_realization || item.mitigation_plan}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '1px solid #a7f3d0', borderRadius: '16px', padding: '1.35rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#047857', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={20} color="#059669" /> 1-2-3 Execution Checklist
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {planData.execution_checklist.map((task, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#065f46', fontWeight: 600 }}>
                    <span style={{ fontWeight: 800, background: '#059669', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>{i+1}</span>
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button onClick={() => window.print()} className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', borderRadius: '10px' }}>
                <Download size={16} /> Export Action Plan PDF
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

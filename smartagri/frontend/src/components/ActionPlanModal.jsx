import React, { useEffect, useState, useContext } from 'react';
import { X, ShieldCheck, Download, CheckCircle } from 'lucide-react';
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
      <div className="modal-content" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', pb: '1rem', mb: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: '#d1fae5', padding: '0.5rem', borderRadius: '10px', color: '#047857' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Consolidated 8-Point Farm Action Plan</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Synthesized AI Agronomic Strategy for {user.farmer_name} ({user.district}, {user.state})</p>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#059669', fontWeight: 700 }}>
            Synthesizing 8-Point Advisory for {user.farmer_name}...
          </div>
        ) : planData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="grid-2">
              {Object.entries(planData.action_plan_8_points).map(([key, item]) => (
                <div key={key} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#334155' }}>
                    {item.recommendation || item.spraying_window || item.predicted_yield || item.target_mandi || item.recommended_scheme || item.overall_risk_score}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.3rem' }}>
                    {item.rationale || item.action || item.temperature_alert || item.preventative_action || item.total_estimated_harvest || item.net_realization || item.mitigation_plan}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#047857', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} /> 1-2-3 Execution Checklist
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {planData.execution_checklist.map((task, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: '#065f46' }}>
                    <span style={{ fontWeight: 800, background: '#10b981', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>{i+1}</span>
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button onClick={() => window.print()} className="btn btn-primary">
                <Download size={16} /> Export Action Plan PDF
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

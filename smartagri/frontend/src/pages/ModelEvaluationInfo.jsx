import React, { useState, useEffect } from 'react';
import { Info, Database, ShieldCheck, Cpu } from 'lucide-react';
import { api } from '../services/api';

export default function ModelEvaluationInfo() {
  const [summary, setSummary] = useState(null);
  const [registry, setRegistry] = useState(null);

  useEffect(() => {
    Promise.all([
      api.getModelsSummary(),
      api.getDatasetsRegistry()
    ]).then(([s, r]) => {
      setSummary(s);
      setRegistry(r);
    }).catch(err => console.error(err));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      <div>
        <span className="badge badge-primary">18 DATASETS & 220,000+ RECORDS PROVENANCE</span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: '#0f172a' }}>
          Machine Learning Model Architecture & Data Registry
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Transparent validation metrics, algorithm hyperparameters, and dataset provenance.
        </p>
      </div>

      {/* Model Summary Cards */}
      {summary && (
        <div className="grid-3">
          {summary.models.map((m, idx) => (
            <div key={idx} className="glass-card">
              <span className="badge badge-secondary">{m.algorithm}</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0.5rem 0' }}>{m.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.75rem' }}>Dataset: {m.dataset}</p>
              <div style={{ background: '#ecfdf5', color: '#047857', padding: '0.5rem 0.75rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem' }}>
                {m.accuracy || m.performance || m.classes}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Datasets Provenance Registry Table */}
      {registry && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database color="#059669" size={22} /> Data Registry Provenance (18 Ingested Datasets)
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Key</th>
                  <th style={{ padding: '0.75rem' }}>Dataset Title</th>
                  <th style={{ padding: '0.75rem' }}>Records</th>
                  <th style={{ padding: '0.75rem' }}>Source Provenance</th>
                  <th style={{ padding: '0.75rem' }}>Features Ingested</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(registry.registry).map(([key, item]) => (
                  <tr key={key} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#059669' }}>{key}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 700 }}>{item.title}</td>
                    <td style={{ padding: '0.75rem' }}>{item.records.toLocaleString()}</td>
                    <td style={{ padding: '0.75rem', color: '#64748b' }}>{item.source}</td>
                    <td style={{ padding: '0.75rem', color: '#334155', fontSize: '0.8rem' }}>{item.features.join(', ')}</td>
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

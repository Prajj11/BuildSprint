import React, { useState, useEffect } from 'react';
import { Database, ShieldCheck, Cpu, BarChart2 } from 'lucide-react';
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
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      <div>
        <span className="badge badge-dark" style={{ border: '1px solid #10B981', marginBottom: '0.4rem' }}>
          18 DATASETS & 220,000+ RECORDS PROVENANCE
        </span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.2rem', color: '#0F172A', letterSpacing: '-0.5px' }}>
          Machine Learning Model Architecture & Data Registry
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
          Transparent validation metrics, algorithm hyperparameters, and dataset provenance.
        </p>
      </div>

      {/* Model Summary Cards */}
      {summary && (
        <div className="grid-3">
          {summary.models.map((m, idx) => (
            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-secondary" style={{ marginBottom: '0.5rem' }}>{m.algorithm}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0.4rem 0' }}>{m.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.85rem' }}>Dataset: {m.dataset}</p>
              </div>
              <div style={{ background: '#ECFDF5', color: '#047857', padding: '0.6rem 0.85rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.875rem' }}>
                Validation Score: {m.accuracy || m.performance || m.classes}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Datasets Provenance Registry Table */}
      {registry && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database color="#10B981" size={22} /> Ingested Data Registry (18 Datasets)
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F8FAF8', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                  <th style={{ padding: '0.85rem' }}>Key</th>
                  <th style={{ padding: '0.85rem' }}>Dataset Title</th>
                  <th style={{ padding: '0.85rem' }}>Records</th>
                  <th style={{ padding: '0.85rem' }}>Source Provenance</th>
                  <th style={{ padding: '0.85rem' }}>Features Ingested</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(registry.registry).map(([key, item]) => (
                  <tr key={key} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '0.85rem', fontWeight: 800, color: '#10B981' }}>{key}</td>
                    <td style={{ padding: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{item.title}</td>
                    <td style={{ padding: '0.85rem', fontWeight: 700 }}>{item.records.toLocaleString()}</td>
                    <td style={{ padding: '0.85rem', color: '#64748B' }}>{item.source}</td>
                    <td style={{ padding: '0.85rem', color: '#334155', fontSize: '0.8rem' }}>{item.features.join(', ')}</td>
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

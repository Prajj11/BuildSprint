import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Scan, Landmark, ArrowRight, ShieldCheck, Sparkles, Cpu, Layers } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ paddingBottom: '4rem' }} className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #0f172a 100%)',
        color: 'white',
        borderRadius: '28px',
        padding: '4.5rem 2rem',
        marginTop: '1rem',
        boxShadow: '0 25px 50px -12px rgba(5, 150, 105, 0.25)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%', left: '-10%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '0.45rem 1.15rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.75rem' }}>
          <ShieldCheck size={16} color="#34d399" /> Production AI Decision Support Platform for Farmers
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
          Empowering Indian Agriculture with <br/>
          <span style={{ color: '#34d399' }}>Multi-Modal AI & Telemetry</span>
        </h1>

        <p style={{ fontSize: '1.1rem', maxWidth: '750px', margin: '0 auto 2.25rem auto', color: '#e2e8f0', lineHeight: 1.65 }}>
          SmartAgri AI integrates 18 agronomic datasets, PyTorch ResNet-38 Vision pathology, live Open-Meteo telemetry, and 57,000+ Agmarknet Mandi market records into actionable farmer advisories.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {user ? (
            <Link to="/dashboard" className="btn" style={{ background: '#34d399', color: '#064e3b', padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: 800, borderRadius: '12px', boxShadow: '0 4px 15px rgba(52, 211, 153, 0.3)' }}>
              Go to Farmer Dashboard <ArrowRight size={20} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn" style={{ background: '#34d399', color: '#064e3b', padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: 800, borderRadius: '12px', boxShadow: '0 4px 15px rgba(52, 211, 153, 0.3)' }}>
                Get Started & Register <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', padding: '0.85rem 2rem', fontSize: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}>
                Farmer Log In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ marginTop: '4rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem', color: '#0f172a' }}>
          Platform AI Engines & Capabilities
        </h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          Designed for high precision agronomic guidance, pathogen diagnosis, and price optimization.
        </p>

        <div className="grid-3">
          <div className="glass-card glass-card-interactive">
            <div style={{ background: '#d1fae5', color: '#047857', width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Sprout size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>Soil & Climate Crop Advisor</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
              RandomForest Classifier trained on 2,200 soil N-P-K & atmospheric records delivering 98.86% accuracy with explainable feature importances.
            </p>
          </div>

          <div className="glass-card glass-card-interactive">
            <div style={{ background: '#e0f2fe', color: '#0284c7', width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Scan size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>PyTorch Vision Pathology</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
              ResNet-38 Vision CNN combined with Spatial Color Moments to diagnose 27 plant disease classes with strict low-confidence safeguards.
            </p>
          </div>

          <div className="glass-card glass-card-interactive">
            <div style={{ background: '#fef3c7', color: '#d97706', width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Landmark size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>Mandi Wholesale Ranker</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
              Analyzes 57,330 daily wholesale price records to rank regional mandis by highest profit realization minus freight transportation costs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

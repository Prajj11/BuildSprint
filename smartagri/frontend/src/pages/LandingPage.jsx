import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Scan, Landmark, ArrowRight, ShieldCheck, UserCheck, Lock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #0f172a 100%)',
        color: 'white',
        borderRadius: '24px',
        padding: '4rem 2rem',
        marginTop: '1rem',
        boxShadow: '0 20px 40px rgba(5, 150, 105, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          <ShieldCheck size={16} color="#34d399" /> Production AI Decision Support Platform for Farmers
        </div>

        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.25rem', letterSpacing: '-1px' }}>
          Empowering Indian Agriculture with <br/>
          <span style={{ color: '#34d399' }}>Multi-Modal AI & Telemetry</span>
        </h1>

        <p style={{ fontSize: '1.1rem', maxWidth: '750px', margin: '0 auto 2rem auto', color: '#e2e8f0', lineHeight: 1.6 }}>
          SmartAgri AI integrates 18 agronomic datasets, PyTorch ResNet-38 Vision pathology, live Open-Meteo telemetry, and 57,000+ Agmarknet Mandi market records into actionable farmer advisories.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ background: '#34d399', color: '#047857', padding: '0.8rem 1.75rem', fontSize: '1rem', fontWeight: 800 }}>
              Go to Farmer Dashboard <ArrowRight size={20} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ background: '#34d399', color: '#047857', padding: '0.8rem 1.75rem', fontSize: '1rem', fontWeight: 800 }}>
                Get Started & Register <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', padding: '0.8rem 1.75rem', fontSize: '1rem' }}>
                Farmer Log In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ marginTop: '3.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem' }}>
          Platform AI Engines & Capabilities
        </h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem' }}>
          Designed for high precision agronomic guidance, pathogen diagnosis, and price optimization.
        </p>

        <div className="grid-3">
          <div className="glass-card">
            <div style={{ background: '#d1fae5', color: '#047857', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Sprout size={26} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Soil & Climate Crop Advisor</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
              RandomForest Classifier trained on 2,200 soil N-P-K & atmospheric records delivering 98.86% accuracy with explainable feature importances.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ background: '#e0f2fe', color: '#0284c7', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Scan size={26} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>PyTorch Vision Pathology</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
              ResNet-38 Vision CNN combined with Spatial Color Moments to diagnose 27 plant disease classes with strict low-confidence safeguards.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ background: '#fef3c7', color: '#d97706', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Landmark size={26} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Mandi Wholesale Ranker</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
              Analyzes 57,330 daily wholesale price records to rank regional mandis by highest profit realization minus freight transportation costs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

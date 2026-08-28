import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, UserPlus, AlertCircle, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    farmer_name: '',
    state: 'Maharashtra',
    district: 'Nashik',
    land_acres: 5.0,
    soil_type: 'Black Cotton Soil',
    N: 90.0,
    P: 42.0,
    K: 43.0,
    ph: 6.5,
    primary_crop: 'Rice'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const val = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div className="glass-card fade-in" style={{ maxWidth: '680px', width: '100%', padding: '2.5rem', borderRadius: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
            color: 'white',
            padding: '0.85rem',
            borderRadius: '16px',
            marginBottom: '1rem',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
          }}>
            <Sprout size={36} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>Register Farmer Account</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '0.4rem' }}>
            Set up your farm profile for AI Decision Support
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-2">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem', display: 'block' }}>Full Name *</label>
              <input type="text" name="farmer_name" required value={form.farmer_name} onChange={handleChange} className="input-field" placeholder="Ramesh Patil" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem', display: 'block' }}>Email Address *</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} className="input-field" placeholder="farmer@smartagri.in" />
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem', display: 'block' }}>Password * (Min 6 chars)</label>
              <input type="password" name="password" required value={form.password} onChange={handleChange} className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem', display: 'block' }}>Primary Crop Commodity</label>
              <input type="text" name="primary_crop" required value={form.primary_crop} onChange={handleChange} className="input-field" placeholder="Rice" />
            </div>
          </div>

          <div className="grid-3">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem', display: 'block' }}>State *</label>
              <input type="text" name="state" required value={form.state} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem', display: 'block' }}>District *</label>
              <input type="text" name="district" required value={form.district} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem', display: 'block' }}>Land Size (Acres)</label>
              <input type="number" step="0.5" name="land_acres" required value={form.land_acres} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <div className="grid-4">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem', display: 'block' }}>Nitrogen (N)</label>
              <input type="number" name="N" value={form.N} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem', display: 'block' }}>Phosphorus (P)</label>
              <input type="number" name="P" value={form.P} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem', display: 'block' }}>Potassium (K)</label>
              <input type="number" name="K" value={form.K} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem', display: 'block' }}>Soil pH</label>
              <input type="number" step="0.1" name="ph" value={form.ph} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}>
            <UserPlus size={20} /> {loading ? 'Creating Account...' : 'Register Account & Launch Dashboard'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748B' }}>Already registered? </span>
          <Link to="/login" style={{ fontSize: '0.875rem', fontWeight: 800, color: '#10B981' }}>
            Log In Here
          </Link>
        </div>
      </div>
    </div>
  );
}

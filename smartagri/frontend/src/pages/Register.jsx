import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, UserPlus, AlertCircle } from 'lucide-react';
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
      <div className="glass-card" style={{ maxWidth: '650px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '14px',
            marginBottom: '1rem'
          }}>
            <Sprout size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Register Farmer Account</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.3rem' }}>
            Set up your farm profile for AI Decision Support
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-2">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Full Name *</label>
              <input type="text" name="farmer_name" required value={form.farmer_name} onChange={handleChange} className="input-field" placeholder="Ramesh Patil" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Email Address *</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} className="input-field" placeholder="farmer@smartagri.in" />
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Password * (Min 6 chars)</label>
              <input type="password" name="password" required value={form.password} onChange={handleChange} className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Primary Crop Commodity</label>
              <input type="text" name="primary_crop" required value={form.primary_crop} onChange={handleChange} className="input-field" placeholder="Rice" />
            </div>
          </div>

          <div className="grid-3">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>State *</label>
              <input type="text" name="state" required value={form.state} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>District *</label>
              <input type="text" name="district" required value={form.district} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Land Size (Acres)</label>
              <input type="number" step="0.5" name="land_acres" required value={form.land_acres} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <div className="grid-4">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Nitrogen (N)</label>
              <input type="number" name="N" value={form.N} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Phosphorus (P)</label>
              <input type="number" name="P" value={form.P} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Potassium (K)</label>
              <input type="number" name="K" value={form.K} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Soil pH</label>
              <input type="number" step="0.1" name="ph" value={form.ph} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}>
            <UserPlus size={20} /> {loading ? 'Creating Account...' : 'Register Account & Launch Dashboard'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', pt: '1rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Already have an account? </span>
          <Link to="/login" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#059669' }}>
            Log In Here
          </Link>
        </div>
      </div>
    </div>
  );
}

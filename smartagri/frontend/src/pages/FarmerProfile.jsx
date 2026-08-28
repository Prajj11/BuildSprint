import React, { useState, useEffect, useContext } from 'react';
import { User, Save, MapPin, Navigation } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

export default function FarmerProfile() {
  const { user, updateProfileState, locationState, detectBrowserLocation } = useContext(AuthContext);
  const [form, setForm] = useState(user || {});
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const val = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.updateProfile(form);
      if (res.profile) {
        updateProfileState(res.profile);
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      <div>
        <span className="badge badge-primary">AUTHENTICATED USER PROFILE</span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.4rem', color: '#0f172a' }}>
          Farmer Account & Soil Test Defaults
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Manage your real farm details, soil test parameters, and location.
        </p>
      </div>

      {/* GPS Location Box */}
      <div className="glass-card" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>GPS LOCATION TRACKING</span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
            {locationState.formattedAddress || `${user.district}, ${user.state}`}
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#047857' }}>
            Coordinates: {user.latitude || 19.99}°N, {user.longitude || 73.78}°E
          </span>
        </div>

        <button onClick={detectBrowserLocation} className="btn btn-primary" style={{ background: '#059669' }}>
          <Navigation size={18} /> Update Current Location via GPS
        </button>
      </div>

      {/* Profile Form */}
      <div className="glass-card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-2">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Account Email</label>
              <input type="email" disabled value={user.email} className="input-field" style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Farmer Full Name</label>
              <input type="text" name="farmer_name" value={form.farmer_name || ''} onChange={handleChange} className="input-field" required />
            </div>
          </div>

          <div className="grid-3">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>State Jurisdiction</label>
              <input type="text" name="state" value={form.state || ''} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>District</label>
              <input type="text" name="district" value={form.district || ''} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Primary Crop Commodity</label>
              <input type="text" name="primary_crop" value={form.primary_crop || ''} onChange={handleChange} className="input-field" required />
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Land Size (Acres)</label>
              <input type="number" step="0.5" name="land_acres" value={form.land_acres || 5.0} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Soil Classification</label>
              <input type="text" name="soil_type" value={form.soil_type || ''} onChange={handleChange} className="input-field" required />
            </div>
          </div>

          <div className="grid-4">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Nitrogen (N)</label>
              <input type="number" name="N" value={form.N || 90} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Phosphorus (P)</label>
              <input type="number" name="P" value={form.P || 42} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Potassium (K)</label>
              <input type="number" name="K" value={form.K || 43} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Soil pH</label>
              <input type="number" step="0.1" name="ph" value={form.ph || 6.5} onChange={handleChange} className="input-field" required />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Save size={18} /> {loading ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
            {savedSuccess && (
              <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>
                Account profile updated successfully! ✨
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

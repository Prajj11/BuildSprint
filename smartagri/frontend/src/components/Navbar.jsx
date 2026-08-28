import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, Navigation, User, Menu, ShieldCheck, LogOut, 
  LogIn, Bell, CloudSun, ChevronDown, Sparkles
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar({ onOpenMobileDrawer, onOpenActionPlan }) {
  const { user, logout, locationState, detectBrowserLocation } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      height: '70px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #E2E8F0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.75rem',
      boxShadow: '0 1px 3px rgba(11, 31, 23, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {user && (
          <button 
            onClick={onOpenMobileDrawer} 
            className="btn btn-outline"
            style={{ padding: '0.45rem', borderRadius: '8px', display: 'none' }}
            id="mobile-menu-btn"
          >
            <Menu size={20} />
          </button>
        )}

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
            color: 'white',
            padding: '0.55rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            <Sprout size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
              SmartAgri <span style={{ color: '#10B981' }}>AI</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748B', fontWeight: 700, letterSpacing: '0.02em' }}>
              AGRITECH DECISION PLATFORM
            </span>
          </div>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <button 
              onClick={onOpenActionPlan}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            >
              <ShieldCheck size={17} /> 8-Point Plan
            </button>

            {/* GPS Location Pill */}
            <div 
              onClick={detectBrowserLocation} 
              title="Click to detect browser GPS location"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: locationState.isGpsActive ? '#D1FAE5' : '#F1F5F9',
                border: locationState.isGpsActive ? '1px solid #10B981' : '1px solid #CBD5E1',
                padding: '0.45rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: locationState.isGpsActive ? '#047857' : '#334155',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Navigation size={15} color={locationState.isGpsActive ? '#10B981' : '#0284C7'} />
              <span>{locationState.formattedAddress || `${user.district}, ${user.state}`}</span>
            </div>

            {/* User Dropdown */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#F8FAF8',
                  border: '1px solid #E2E8F0',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ background: '#10B981', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                  {user.farmer_name ? user.farmer_name.charAt(0) : 'F'}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>{user.farmer_name}</span>
                <ChevronDown size={15} color="#64748B" />
              </div>

              {dropdownOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '120%', right: 0,
                    width: '200px',
                    background: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    zIndex: 200,
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}
                >
                  <Link 
                    to="/profile" 
                    onClick={() => setDropdownOpen(false)}
                    style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <User size={16} /> Farmer Profile
                  </Link>
                  <button 
                    onClick={() => { setDropdownOpen(false); handleLogout(); }}
                    style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Link to="/login" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              <LogIn size={16} /> Log In
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

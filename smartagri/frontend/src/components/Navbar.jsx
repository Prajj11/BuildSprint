import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, MapPin, User, Menu, ShieldCheck, LogOut, LogIn, Navigation } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar({ onOpenMobileDrawer, onOpenActionPlan }) {
  const { user, logout, locationState, detectBrowserLocation } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      height: '70px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user && (
          <button 
            onClick={onOpenMobileDrawer} 
            className="btn btn-outline"
            style={{ padding: '0.4rem', borderRadius: '8px' }}
            id="mobile-menu-btn"
          >
            <Menu size={20} />
          </button>
        )}

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: 'white',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sprout size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
              SmartAgri <span style={{ color: '#059669' }}>AI</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
              Decision Support Platform
            </span>
          </div>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {user ? (
          <>
            <button 
              onClick={onOpenActionPlan}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem', background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)' }}
            >
              <ShieldCheck size={16} /> 8-Point Plan
            </button>

            <div 
              onClick={detectBrowserLocation} 
              title="Click to fetch browser GPS location"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: locationState.isGpsActive ? '#d1fae5' : '#f1f5f9',
                border: locationState.isGpsActive ? '1px solid #10b981' : '1px solid #cbd5e1',
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: locationState.isGpsActive ? '#047857' : '#334155',
                cursor: 'pointer'
              }}
            >
              <Navigation size={14} color={locationState.isGpsActive ? '#059669' : '#0284c7'} />
              <span>{locationState.formattedAddress || `${user.district}, ${user.state}`}</span>
            </div>

            <Link 
              to="/profile" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#e0f2fe',
                color: '#0284c7',
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              <User size={15} />
              <span>{user.farmer_name}</span>
            </Link>

            <button 
              onClick={handleLogout}
              className="btn btn-outline"
              title="Log Out"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', color: '#dc2626', borderColor: '#fca5a5' }}
            >
              <LogOut size={16} /> Log Out
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}>
              <LogIn size={16} /> Log In
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}>
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

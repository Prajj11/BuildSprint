import React, { useContext } from 'react';
import { X, Sprout, LayoutDashboard, Scan, TrendingUp, CloudSun, Landmark, FileText, Bot, Info, User, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function MobileDrawer({ isOpen, onClose }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Crop Advisor', path: '/crop-advisor', icon: Sprout },
    { label: 'Disease Pathology', path: '/disease-detection', icon: Scan },
    { label: 'Yield Predictor', path: '/yield-predictor', icon: TrendingUp },
    { label: 'Weather Telemetry', path: '/weather-advisory', icon: CloudSun },
    { label: 'Market Intelligence', path: '/market-intelligence', icon: Landmark },
    { label: 'Government Schemes', path: '/government-schemes', icon: FileText },
    { label: 'AI Farmer Assistant', path: '/ai-assistant', icon: Bot },
    { label: 'Model Provenance', path: '/model-evaluation', icon: Info },
    { label: 'Farmer Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          width: '280px',
          background: 'white',
          zIndex: 1100,
          padding: '1.5rem',
          boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', pb: '1rem', mb: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sprout color="#059669" size={24} />
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>SmartAgri Menu</span>
            </div>
            <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#059669' : '#475569',
                    background: isActive ? '#d1fae5' : 'transparent'
                  })}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="btn btn-outline"
          style={{ width: '100%', color: '#dc2626', borderColor: '#fca5a5' }}
        >
          <LogOut size={16} /> Log Out ({user.farmer_name})
        </button>
      </div>
    </div>
  );
}

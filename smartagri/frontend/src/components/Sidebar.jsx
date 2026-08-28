import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Sprout, Scan, TrendingUp, CloudSun, 
  Landmark, FileText, Bot, Info, User
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

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
    <aside style={{
      width: '260px',
      background: 'white',
      borderRight: '1px solid #e2e8f0',
      minHeight: 'calc(100vh - 70px)',
      padding: '1.25rem 0.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.35rem'
    }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '0 0.75rem 0.5rem 0.75rem', letterSpacing: '0.05em' }}>
        Decision Modules
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#059669' : '#475569',
              background: isActive ? '#d1fae5' : 'transparent',
              transition: 'all 0.15s ease'
            })}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
}

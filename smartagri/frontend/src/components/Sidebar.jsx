import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Sprout, Scan, TrendingUp, CloudSun, 
  Landmark, FileText, Bot, Info, User, Sparkles
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
      background: '#0B1F17',
      color: 'white',
      minHeight: 'calc(100vh - 70px)',
      padding: '1.5rem 0.85rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{ padding: '0 0.75rem 1rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={14} /> AI Decisions. Better Farming.
          </div>
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
                gap: '0.85rem',
                padding: '0.7rem 0.9rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#FFFFFF' : '#94A3B8',
                background: isActive ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(4, 120, 87, 0.2) 100%)' : 'transparent',
                borderLeft: isActive ? '3px solid #10B981' : '3px solid transparent',
                boxShadow: isActive ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              })}
            >
              <Icon size={19} color={undefined} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Branding Badge */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '0.85rem',
        marginTop: '1.5rem',
        fontSize: '0.75rem',
        color: '#94A3B8'
      }}>
        <span style={{ color: '#10B981', fontWeight: 700, display: 'block' }}>SmartAgri AI v2.0</span>
        Production Decision Support
      </div>
    </aside>
  );
}

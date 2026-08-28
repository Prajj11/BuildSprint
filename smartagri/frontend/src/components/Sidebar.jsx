import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Sprout, Scan, TrendingUp, CloudSun, 
  Landmark, FileText, Bot, Info, User, ArrowRight
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
    <aside 
      className="desktop-sidebar"
      style={{
        width: '280px',
        background: '#041711',
        color: 'white',
        position: 'sticky',
        top: '70px',
        height: 'calc(100vh - 70px)',
        overflowY: 'auto',
        padding: '1.25rem 1rem 1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        flexShrink: 0
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Top Header / Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: 'white',
            padding: '0.55rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
          }}>
            <Sprout size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              SmartAgri <span style={{ color: '#10B981' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 500 }}>
              AI Decisions. Better Farming.
            </div>
          </div>
        </div>

        {/* Category Header */}
        <div>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            color: '#10B981',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.6rem',
            paddingLeft: '0.5rem'
          }}>
            DECISION MODULES
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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
                    padding: '0.65rem 0.85rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(5, 150, 105, 0.25) 100%)' 
                      : 'transparent',
                    border: isActive ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                    boxShadow: isActive ? '0 4px 14px rgba(16, 185, 129, 0.2)' : 'none',
                    transition: 'all 0.2s ease'
                  })}
                >
                  <Icon size={18} color={undefined} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom AI Help Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(4, 120, 87, 0.25) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '16px',
        padding: '1.1rem',
        marginTop: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34D399', marginBottom: '0.25rem' }}>
          Need help deciding?
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.85rem', lineHeight: 1.3 }}>
          Ask SmartAgri Assistant
        </div>
        <Link 
          to="/ai-assistant"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#10B981',
            color: 'white',
            padding: '0.5rem',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowRight size={18} />
        </Link>

        {/* Subtle decorative leaf watermark */}
        <div style={{
          position: 'absolute',
          bottom: '-10px',
          right: '-10px',
          opacity: 0.15,
          pointerEvents: 'none'
        }}>
          <Sprout size={70} color="#10B981" />
        </div>
      </div>
    </aside>
  );
}

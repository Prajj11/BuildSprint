import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sprout, Scan, Landmark, Bot } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function BottomNav() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const items = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Crops', path: '/crop-advisor', icon: Sprout },
    { label: 'Scanner', path: '/disease-detection', icon: Scan },
    { label: 'Market', path: '/market-intelligence', icon: Landmark },
    { label: 'Assistant', path: '/ai-assistant', icon: Bot },
  ];

  return (
    <nav 
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        height: '64px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(226, 232, 240, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 90,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)'
      }}
    >
      {items.map(item => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.725rem',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#059669' : '#64748b',
              padding: '0.3rem 0.6rem',
              borderRadius: '10px',
              transition: 'all 0.2s ease'
            })}
          >
            {({ isActive }) => (
              <>
                <div style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  background: isActive ? '#d1fae5' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={18} color={isActive ? '#059669' : '#64748b'} />
                </div>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

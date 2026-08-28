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
    <nav style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      height: '60px',
      background: 'white',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 90
    }}>
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
              fontSize: '0.7rem',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#059669' : '#64748b'
            })}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

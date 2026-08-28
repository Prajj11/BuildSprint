import React, { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('smartagri_token') || null);
  const [loading, setLoading] = useState(true);
  
  // GPS & Weather location state
  const [locationState, setLocationState] = useState({
    latitude: null,
    longitude: null,
    formattedAddress: 'Detecting location...',
    district: '',
    state: '',
    isGpsActive: false,
    error: null
  });

  // Verify stored token on app boot
  useEffect(() => {
    if (token) {
      api.getMe()
        .then((userData) => {
          setUser(userData);
          if (userData.latitude && userData.longitude) {
            setLocationState(prev => ({
              ...prev,
              latitude: userData.latitude,
              longitude: userData.longitude,
              district: userData.district || '',
              state: userData.state || '',
              formattedAddress: `${userData.district || ''}, ${userData.state || ''}`.trim().replace(/^,/, '') || 'Saved Location'
            }));
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const loginUser = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('smartagri_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    if (data.user.latitude && data.user.longitude) {
      setLocationState(prev => ({
        ...prev,
        latitude: data.user.latitude,
        longitude: data.user.longitude,
        district: data.user.district,
        state: data.user.state,
        formattedAddress: `${data.user.district}, ${data.user.state}`
      }));
    }
    return data;
  };

  const registerUser = async (payload) => {
    const data = await api.register(payload);
    localStorage.setItem('smartagri_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('smartagri_token');
    setToken(null);
    setUser(null);
  };

  const updateProfileState = (updatedProfile) => {
    setUser(prev => ({ ...prev, ...updatedProfile }));
  };

  // Browser GPS detection
  const detectBrowserLocation = () => {
    if (!navigator.geolocation) {
      setLocationState(prev => ({ ...prev, error: 'Geolocation is not supported by your browser.' }));
      return;
    }

    setLocationState(prev => ({ ...prev, formattedAddress: 'Detecting GPS...' }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        try {
          let res = await api.updateLocation(lat, lon);
          setLocationState({
            latitude: lat,
            longitude: lon,
            formattedAddress: res.formatted_address || `${res.district}, ${res.state}`,
            district: res.district,
            state: res.state,
            isGpsActive: true,
            error: null
          });
          setUser(prev => prev ? { ...prev, latitude: lat, longitude: lon, district: res.district, state: res.state } : prev);
        } catch (err) {
          setLocationState(prev => ({
            ...prev,
            latitude: lat,
            longitude: lon,
            formattedAddress: `${round(lat, 2)}°N, ${round(lon, 2)}°E`,
            isGpsActive: true,
            error: null
          }));
        }
      },
      (err) => {
        console.warn('GPS location error:', err);
        setLocationState(prev => ({
          ...prev,
          error: 'GPS permission denied or unavailable. Using saved profile location.',
          formattedAddress: user ? `${user.district}, ${user.state}` : 'Location Unavailable'
        }));
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      loginUser,
      registerUser,
      logout,
      updateProfileState,
      locationState,
      detectBrowserLocation
    }}>
      {children}
    </AuthContext.Provider>
  );
};

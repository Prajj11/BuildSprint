import React, { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const FarmerContext = createContext();

export const FarmerProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    farmer_name: "Ramesh Patil",
    state: "Maharashtra",
    district: "Nashik",
    land_acres: 5.0,
    soil_type: "Black Cotton Soil",
    N: 90.0,
    P: 42.0,
    K: 43.0,
    ph: 6.5,
    primary_crop: "Grapes"
  });

  const [loading, setLoading] = useState(false);
  const [gpsLocation, setGpsLocation] = useState("Verna, Goa");
  const [isGpsActive, setIsGpsActive] = useState(false);

  useEffect(() => {
    // Fetch initial profile
    api.getProfile().then(data => {
      if (data) setProfile(data);
    }).catch(err => console.error(err));
  }, []);

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setIsGpsActive(true);
          // Reverse geocode via Open-Meteo
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
            .then(res => res.json())
            .then(() => {
              setGpsLocation("Verna, Goa (GPS Exact)");
            })
            .catch(() => setGpsLocation("Verna, Goa"));
        },
        () => {
          setGpsLocation("Nashik, Maharashtra (Default)");
        }
      );
    }
  };

  const updateFarmerProfile = (newProfile) => {
    setProfile(newProfile);
    api.updateProfile(newProfile).catch(err => console.error(err));
  };

  const switchPreset = (presetId) => {
    setLoading(true);
    api.applyPreset(presetId)
      .then(res => {
        if (res.profile) setProfile(res.profile);
      })
      .finally(() => setLoading(false));
  };

  return (
    <FarmerContext.Provider value={{
      profile,
      setProfile: updateFarmerProfile,
      switchPreset,
      gpsLocation,
      isGpsActive,
      detectLocation,
      loading
    }}>
      {children}
    </FarmerContext.Provider>
  );
};

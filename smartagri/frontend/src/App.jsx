import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import MobileDrawer from './components/MobileDrawer';
import ActionPlanModal from './components/ActionPlanModal';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CropAdvisor from './pages/CropAdvisor';
import DiseaseDetection from './pages/DiseaseDetection';
import YieldPredictor from './pages/YieldPredictor';
import WeatherAdvisory from './pages/WeatherAdvisory';
import MarketIntelligence from './pages/MarketIntelligence';
import GovernmentSchemes from './pages/GovernmentSchemes';
import AIAssistant from './pages/AIAssistant';
import ModelEvaluationInfo from './pages/ModelEvaluationInfo';
import FarmerProfile from './pages/FarmerProfile';

export default function App() {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isActionPlanOpen, setIsActionPlanOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="app-bg-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar 
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
          onOpenActionPlan={() => setIsActionPlanOpen(true)}
        />

        <div style={{ display: 'flex', flex: 1, position: 'relative', zIndex: 1, marginTop: '64px' }}>
          <Sidebar />

          <main className="app-main-content" style={{
            flex: 1,
            padding: '1.75rem 2rem 5rem 2rem',
            maxWidth: '1440px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
            minWidth: 0
          }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/crop-advisor" element={<ProtectedRoute><CropAdvisor /></ProtectedRoute>} />
              <Route path="/disease-detection" element={<ProtectedRoute><DiseaseDetection /></ProtectedRoute>} />
              <Route path="/yield-predictor" element={<ProtectedRoute><YieldPredictor /></ProtectedRoute>} />
              <Route path="/weather-advisory" element={<ProtectedRoute><WeatherAdvisory /></ProtectedRoute>} />
              <Route path="/market-intelligence" element={<ProtectedRoute><MarketIntelligence /></ProtectedRoute>} />
              <Route path="/government-schemes" element={<ProtectedRoute><GovernmentSchemes /></ProtectedRoute>} />
              <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
              <Route path="/model-evaluation" element={<ProtectedRoute><ModelEvaluationInfo /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><FarmerProfile /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        <BottomNav />

        <MobileDrawer 
          isOpen={isMobileDrawerOpen} 
          onClose={() => setIsMobileDrawerOpen(false)} 
        />

        <ActionPlanModal 
          isOpen={isActionPlanOpen}
          onClose={() => setIsActionPlanOpen(false)}
        />
      </div>
    </AuthProvider>
  );
}

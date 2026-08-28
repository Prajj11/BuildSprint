import axios from 'axios';

const API_BASE = '/api';

// Create an Axios instance to attach Bearer token automatically
export const apiClient = axios.create({
  baseURL: API_BASE,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartagri_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const api = {
  // Auth
  register: (payload) => apiClient.post(`/auth/register`, payload).then(res => res.data),
  login: (payload) => apiClient.post(`/auth/login`, payload).then(res => res.data),
  getMe: () => apiClient.get(`/auth/me`).then(res => res.data),

  // Crop Recommendation
  predictCrop: (payload) => apiClient.post(`/crop-recommendation/predict`, payload).then(res => res.data),

  // Disease Pathology
  diagnoseDiseaseUpload: (formData) => apiClient.post(`/disease-detection/diagnose`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data),
  diagnoseDiseaseSample: (filename) => apiClient.post(`/disease-detection/diagnose-sample?filename=${filename}`).then(res => res.data),
  getDiseaseSamples: () => apiClient.get(`/disease-detection/samples`).then(res => res.data),

  // Yield Prediction
  predictYield: (payload) => apiClient.post(`/yield-prediction/predict`, payload).then(res => res.data),

  // Weather Advisory
  getWeatherAdvisory: (lat, lon, location, crop) => apiClient.get(`/weather/advisory`, {
    params: { lat, lon, location, crop }
  }).then(res => res.data),
  predictWeatherScenario: (tempOffset, rainMultiplier, lat, lon) => apiClient.get(`/weather/predict-from-history`, {
    params: { temp_offset: tempOffset, rain_multiplier: rainMultiplier, lat, lon }
  }).then(res => res.data),

  // Market Intelligence
  getMarketTrends: (commodity, state) => apiClient.get(`/market/trends`, { params: { commodity, state } }).then(res => res.data),
  getWhereToSell: (commodity, state) => apiClient.get(`/market/where-to-sell`, { params: { commodity, state } }).then(res => res.data),

  // Government Schemes
  searchSchemes: (query, category) => apiClient.get(`/schemes/search`, { params: { query, category } }).then(res => res.data),
  matchSchemesProfile: (payload) => apiClient.post(`/schemes/match-profile`, payload).then(res => res.data),

  // AI Assistant & Action Plan
  chatAssistant: (message, history = []) => apiClient.post(`/assistant/chat`, { message, history }).then(res => res.data),
  generateActionPlan: (payload) => apiClient.post(`/action-plan/generate`, payload).then(res => res.data),

  // Profile & Location
  getProfile: () => apiClient.get(`/profile`).then(res => res.data),
  updateProfile: (payload) => apiClient.post(`/profile`, payload).then(res => res.data),
  updateLocation: (latitude, longitude) => apiClient.post(`/profile/location`, { latitude, longitude }).then(res => res.data),

  // Models Info
  getModelsSummary: () => apiClient.get(`/models-info/summary`).then(res => res.data),
  getDatasetsRegistry: () => apiClient.get(`/models-info/registry`).then(res => res.data),
};

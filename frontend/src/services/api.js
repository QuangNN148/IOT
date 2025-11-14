// API service sử dụng Axios
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// API functions

// Lấy dữ liệu cảm biến mới nhất
export const getLatestSensor = async () => {
  try {
    const response = await api.get('/sensors/latest');
    return response.data;
  } catch (error) {
    console.error('Error fetching latest sensor:', error);
    throw error;
  }
};

// Lấy lịch sử dữ liệu cảm biến
export const getSensorHistory = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    if (filters.search) params.append('search', filters.search);
    if (filters.dataType) params.append('dataType', filters.dataType);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/sensors/history?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sensor history:', error);
    throw error;
  }
};

// Lấy lịch sử hành động
export const getActionHistory = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    if (filters.search) params.append('search', filters.search);
    if (filters.dataType) params.append('dataType', filters.dataType);
    if (filters.deviceFilter && filters.deviceFilter !== 'all') params.append('deviceFilter', filters.deviceFilter);
    if (filters.actionFilter && filters.actionFilter !== 'all') params.append('actionFilter', filters.actionFilter);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/actions/history?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching action history:', error);
    throw error;
  }
};

// Lấy hành động mới nhất
export const getLatestActions = async () => {
  try {
    const response = await api.get('/actions/latest');
    return response.data;
  } catch (error) {
    console.error('Error fetching latest actions:', error);
    throw error;
  }
};

// Lấy trạng thái cuối cùng của một thiết bị
export const getDeviceState = async (device) => {
  try {
    const response = await api.get(`/actions/state/${device}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching device state:', error);
    throw error;
  }
};

// Điều khiển thiết bị
export const controlDevice = async (device, action) => {
  try {
    const response = await api.post('/control', { device, action });
    return response.data;
  } catch (error) {
    console.error('Error controlling device:', error);
    throw error;
  }
};

// Lấy thông tin profile
export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Dashboard APIs

// Lấy thống kê vượt ngưỡng của cảm biến
export const getSensorThresholdStats = async (thresholds = {}) => {
  try {
    const params = new URLSearchParams();
    if (thresholds.temperature) params.append('tempThreshold', thresholds.temperature);
    if (thresholds.humidity) params.append('humidityThreshold', thresholds.humidity);
    if (thresholds.light) params.append('lightThreshold', thresholds.light);

    const response = await api.get(`/dashboard/sensor-threshold-stats?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sensor threshold stats:', error);
    throw error;
  }
};

// Lấy thống kê bật/tắt thiết bị theo ngày
export const getDeviceToggleStats = async (date) => {
  try {
    const params = new URLSearchParams();
    if (date) params.append('date', date);

    const response = await api.get(`/dashboard/device-toggle-stats?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching device toggle stats:', error);
    throw error;
  }
};

export default api;

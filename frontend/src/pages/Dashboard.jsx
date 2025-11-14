// Dashboard Page - Thống kê và phân tích dữ liệu
import React, { useState, useEffect } from 'react';
import { getSensorThresholdStats, getDeviceToggleStats } from '../services/api';

const Dashboard = () => {
  // Load thresholds from localStorage or use defaults
  const getInitialThresholds = () => {
    const saved = localStorage.getItem('sensorThresholds');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved thresholds:', e);
      }
    }
    return {
      temperature: 30,
      humidity: 80,
      light: 700
    };
  };

  // State cho sensor threshold statistics
  const [sensorStats, setSensorStats] = useState(null);
  const [thresholds, setThresholds] = useState(getInitialThresholds());
  const [isEditingThresholds, setIsEditingThresholds] = useState(false);
  const [tempThresholds, setTempThresholds] = useState(getInitialThresholds());

  // State cho device toggle statistics
  const [deviceStats, setDeviceStats] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // State cho loading
  const [loadingSensor, setLoadingSensor] = useState(true);
  const [loadingDevice, setLoadingDevice] = useState(true);

  // Load sensor threshold stats
  const loadSensorStats = async () => {
    try {
      setLoadingSensor(true);
      const response = await getSensorThresholdStats(thresholds);
      if (response.success) {
        setSensorStats(response.data);
      }
    } catch (error) {
      console.error('Error loading sensor stats:', error);
    } finally {
      setLoadingSensor(false);
    }
  };

  // Load device toggle stats
  const loadDeviceStats = async () => {
    try {
      setLoadingDevice(true);
      const response = await getDeviceToggleStats(selectedDate);
      if (response.success) {
        setDeviceStats(response.data);
      }
    } catch (error) {
      console.error('Error loading device stats:', error);
    } finally {
      setLoadingDevice(false);
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    loadSensorStats();
  }, [thresholds]);

  useEffect(() => {
    loadDeviceStats();
  }, [selectedDate]);

  // Handle threshold save
  const handleSaveThresholds = () => {
    setThresholds({ ...tempThresholds });
    // Save to localStorage
    localStorage.setItem('sensorThresholds', JSON.stringify(tempThresholds));
    setIsEditingThresholds(false);
  };

  // Handle threshold cancel
  const handleCancelThresholds = () => {
    setTempThresholds({ ...thresholds });
    setIsEditingThresholds(false);
  };

  // Get device icon
  const getDeviceIcon = (device) => {
    switch(device) {
      case 'Light': return '💡';
      case 'Fan': return '🌀';
      case 'Air condition': return '❄️';
      default: return '📱';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard - Thống Kê</h1>
        <p className="text-sm text-gray-500">Phân tích và thống kê dữ liệu hệ thống</p>
      </div>

      {/* Sensor Threshold Statistics Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            📊 Thống kê vượt ngưỡng cảm biến
          </h2>
          {!isEditingThresholds ? (
            <button
              onClick={() => setIsEditingThresholds(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              ⚙️ Cài đặt ngưỡng
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveThresholds}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                ✅ Lưu
              </button>
              <button
                onClick={handleCancelThresholds}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ❌ Hủy
              </button>
            </div>
          )}
        </div>

        {/* Threshold Settings Panel */}
        {isEditingThresholds && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cài đặt ngưỡng cảm biến</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🌡️ Nhiệt độ (°C)
                </label>
                <input
                  type="number"
                  value={tempThresholds.temperature}
                  onChange={(e) => setTempThresholds({ ...tempThresholds, temperature: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💧 Độ ẩm (%)
                </label>
                <input
                  type="number"
                  value={tempThresholds.humidity}
                  onChange={(e) => setTempThresholds({ ...tempThresholds, humidity: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💡 Ánh sáng (lux)
                </label>
                <input
                  type="number"
                  value={tempThresholds.light}
                  onChange={(e) => setTempThresholds({ ...tempThresholds, light: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Sensor Threshold Stats Table */}
        {loadingSensor ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : sensorStats ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Loại cảm biến
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                      Ngưỡng cài đặt
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                      Số lần vượt ngưỡng
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Temperature Row */}
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">🌡️</span>
                        <div>
                          <div className="text-sm font-bold text-gray-900">Nhiệt độ</div>
                          <div className="text-xs text-gray-500">Temperature</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-lg font-semibold text-gray-700">
                        {sensorStats.temperature.threshold}°C
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {sensorStats.temperature.exceeded_count}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">lần</span>
                    </td>
                  </tr>

                  {/* Humidity Row */}
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">💧</span>
                        <div>
                          <div className="text-sm font-bold text-gray-900">Độ ẩm</div>
                          <div className="text-xs text-gray-500">Humidity</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-lg font-semibold text-gray-700">
                        {sensorStats.humidity.threshold}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {sensorStats.humidity.exceeded_count}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">lần</span>
                    </td>
                  </tr>

                  {/* Light Row */}
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">💡</span>
                        <div>
                          <div className="text-sm font-bold text-gray-900">Ánh sáng</div>
                          <div className="text-xs text-gray-500">Light</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-lg font-semibold text-gray-700">
                        {sensorStats.light.threshold} lux
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {sensorStats.light.exceeded_count}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">lần</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500 text-lg">📭 Không có dữ liệu</p>
          </div>
        )}
      </div>

      {/* Device Toggle Statistics Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            🔄 Thống kê bật/tắt thiết bị
          </h2>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Chọn ngày:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Device Stats Table */}
        {loadingDevice ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : deviceStats.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Thiết bị
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                      Tổng số lượt
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                      Lượt BẬT
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                      Lượt TẮT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Lần cuối
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deviceStats.map((stat, index) => (
                    <tr 
                      key={stat.device} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getDeviceIcon(stat.device)}</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {stat.device}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-lg font-bold text-blue-600">
                          {stat.toggle_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                          {stat.on_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                          {stat.off_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(stat.last_action_time).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500 text-lg">
              📭 Không có dữ liệu cho ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

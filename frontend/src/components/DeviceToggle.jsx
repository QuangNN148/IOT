// DeviceToggle Component - Toggle switch điều khiển thiết bị
import React, { useState } from 'react';
import { controlDevice } from '../services/api';

const DeviceToggle = ({ device, name, icon, initialState = false }) => {
  const [isOn, setIsOn] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const action = isOn ? 'off' : 'on';
      const response = await controlDevice(device, action);
      
      if (response.success) {
        setIsOn(!isOn);
        console.log(`✅ ${name} ${action.toUpperCase()} thành công`);
      }
    } catch (error) {
      console.error(`❌ Lỗi điều khiển ${name}:`, error);
      alert(`Không thể điều khiển ${name}. Vui lòng thử lại!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <p className={`text-sm ${isOn ? 'text-green-600' : 'text-gray-500'}`}>
              {isOn ? 'Đang bật' : 'Đang tắt'}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isOn ? 'bg-blue-500' : 'bg-gray-300'
          } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
              isOn ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default DeviceToggle;

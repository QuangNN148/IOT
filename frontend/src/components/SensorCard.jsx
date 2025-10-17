// SensorCard Component - Hiển thị dữ liệu cảm biến
import React from 'react';

const SensorCard = ({ title, value, unit, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            <span className={`text-3xl font-bold ${color}`}>{value}</span>
            <span className="text-gray-500 text-lg">{unit}</span>
          </div>
        </div>
        <div className={`text-5xl ${color}`}>{icon}</div>
      </div>
    </div>
  );
};

export default SensorCard;

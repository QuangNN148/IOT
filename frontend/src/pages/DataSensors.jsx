// Data Sensors Page - Lịch sử dữ liệu cảm biến
import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { getSensorHistory } from '../services/api';

const DataSensors = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dataType: 'all',
    search: ''
  });

  // Cột hiển thị - Luôn hiển thị đầy đủ tất cả các cột
  const getColumns = () => {
    return [
      { key: 'id', label: 'ID' },
      { key: 'temperature', label: '🌡️ Nhiệt độ (°C)' },
      { key: 'humidity', label: '💧 Độ ẩm (%)' },
      { key: 'light', label: '☀️ Ánh sáng (Lux)' },
      { key: 'created_at', label: '⏰ Thời gian' }
    ];
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Gửi tất cả tham số lọc và tìm kiếm đến backend
      const response = await getSensorHistory({ 
        search: filters.search,
        dataType: filters.dataType,
        limit: 1000
      });
      
      if (response.success) {
        // Backend đã xử lý tất cả logic lọc và tìm kiếm
        setData(response.data);
      }
    } catch (error) {
      console.error('Error loading sensor history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    loadData();
  };

  const handleReset = () => {
    setFilters({
      dataType: 'all',
      search: ''
    });
    setTimeout(() => loadData(), 100);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">DATA SENSORS</h1>
        <p className="text-sm text-gray-500">Lịch sử dữ liệu cảm biến</p>
      </div>

      {/* Filters - Smart Search */}
      <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Data Type Select - Bao gồm cả Thời gian */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              <span className="flex items-center">
                � Lọc theo
              </span>
            </label>
            <select
              name="dataType"
              value={filters.dataType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
            >
              <option value="all">🌐 Tất cả dữ liệu</option>
              <option value="temperature">🌡️ Nhiệt độ</option>
              <option value="humidity">💧 Độ ẩm</option>
              <option value="light">☀️ Ánh sáng</option>
              <option value="time">⏰ Thời gian</option>
            </select>
          </div>

          {/* Smart Search Input */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              <span className="flex items-center">
                🔍 Tìm kiếm nâng cao
              </span>
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Tìm theo số, thời gian, từ khóa..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-end space-x-2">
            <button
              onClick={handleSearch}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              🔍 Tìm
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              title="Reset bộ lọc"
            >
              ↻
            </button>
          </div>
        </div>

        {/* Filter Summary Badges */}
        {(filters.dataType !== 'all' || filters.search) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-600 font-semibold">Đang lọc:</span>
            
            {filters.dataType !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {filters.dataType === 'temperature' && '🌡️ Nhiệt độ'}
                {filters.dataType === 'humidity' && '💧 Độ ẩm'}
                {filters.dataType === 'light' && '☀️ Ánh sáng'}
                {filters.dataType === 'time' && '⏰ Thời gian'}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, dataType: 'all' }))}
                  className="ml-2 hover:text-blue-900 font-bold"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                🔍 "{filters.search}"
                <button
                  onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                  className="ml-2 hover:text-green-900 font-bold"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <DataTable columns={getColumns()} data={data} />
      )}
    </div>
  );
};

export default DataSensors;

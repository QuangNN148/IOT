// Action History Page - Lịch sử hành động
import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { getActionHistory } from '../services/api';
import { connectSocket, onActionUpdate, offActionUpdate } from '../services/socket';

const ActionHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dataType: 'all',
    search: '',
    deviceFilter: 'all',
    actionFilter: 'all'
  });

  // Cột hiển thị - Luôn hiển thị đầy đủ tất cả các cột
  const getColumns = () => {
    return [
      { key: 'id', label: 'ID' },
      { key: 'device', label: '🔌 Thiết bị' },
      { key: 'action', label: '⚡ Trạng thái' },
      { key: 'created_at', label: '⏰ Thời gian' }
    ];
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Gửi tất cả tham số lọc và tìm kiếm đến backend
      const response = await getActionHistory({ 
        search: filters.search,
        dataType: filters.dataType,
        deviceFilter: filters.deviceFilter,
        actionFilter: filters.actionFilter,
        limit: 1000
      });
      
      if (response.success) {
        // Backend đã xử lý tất cả logic lọc và tìm kiếm
        setData(response.data);
      }
    } catch (error) {
      console.error('Error loading action history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Kết nối Socket.IO để cập nhật realtime
    const socket = connectSocket();
    onActionUpdate((newAction) => {
      console.log('💡 New action received:', newAction);
      // Reload data để cập nhật bảng
      loadData();
    });

    return () => {
      offActionUpdate();
    };
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



  return (

    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">ACTION HISTORY</h1>
        <p className="text-sm text-gray-500">Lịch sử điều khiển thiết bị</p>
      </div>

      {/* Filters - Smart Search & Dropdowns */}
      <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
          {/* Search box riêng 1 bên */}
          <div className="md:w-1/2">
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              <span className="flex items-center">
                🔍 Tìm kiếm
              </span>
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Tìm theo từ khóa..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 whitespace-nowrap"
              >
                🔍 Tìm kiếm
              </button>
            </div>
          </div>

          {/* Dropdown filter riêng 1 bên */}
          <div className="md:w-1/2 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Data Type Select */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                <span className="flex items-center">
                  🎯 Lọc theo
                </span>
              </label>
              <select
                name="dataType"
                value={filters.dataType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
              >
                <option value="all">🌐 Tất cả dữ liệu</option>
                <option value="device">� Thiết bị</option>
                <option value="action">⚡ Trạng thái</option>
                <option value="time">⏰ Thời gian</option>
              </select>
            </div>

            {/* Device Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                <span className="flex items-center">
                  🔌 Thiết bị
                </span>
              </label>
              <select
                name="deviceFilter"
                value={filters.deviceFilter}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white"
              >
                <option value="all">Tất cả thiết bị</option>
                <option value="Light">💡 Đèn (Light)</option>
                <option value="Fan">🌀 Quạt (Fan)</option>
                <option value="Air condition">❄️ Điều hòa (AC)</option>
              </select>
            </div>

            {/* Action Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                <span className="flex items-center">
                  ⚡ Trạng thái
                </span>
              </label>
              <select
                name="actionFilter"
                value={filters.actionFilter}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="ON">✅ Bật (ON)</option>
                <option value="OFF">⛔ Tắt (OFF)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Summary Badges */}
        {(filters.dataType !== 'all' || filters.deviceFilter !== 'all' || filters.actionFilter !== 'all' || filters.search) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-600 font-semibold">Đang lọc:</span>
            {filters.dataType !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {filters.dataType === 'device' && '🔌 Thiết bị'}
                {filters.dataType === 'action' && '⚡ Trạng thái'}
                {filters.dataType === 'time' && '⏰ Thời gian'}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, dataType: 'all' }))}
                  className="ml-2 hover:text-blue-900 font-bold"
                >
                  ×
                </button>
              </span>
            )}
            {filters.deviceFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                🔌 {filters.deviceFilter}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, deviceFilter: 'all' }))}
                  className="ml-2 hover:text-yellow-900 font-bold"
                >
                  ×
                </button>
              </span>
            )}
            {filters.actionFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                ⚡ {filters.actionFilter}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, actionFilter: 'all' }))}
                  className="ml-2 hover:text-green-900 font-bold"
                >
                  ×
                </button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                🔍 "{filters.search}"
                <button
                  onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                  className="ml-2 hover:text-purple-900 font-bold"
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

export default ActionHistory;

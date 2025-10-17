// DataTable Component - Bảng dữ liệu với phân trang, sorting và rows per page
import React, { useState, useMemo } from 'react';

const DataTable = ({ columns, data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Sorting logic
  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Xử lý date/time
        if (sortConfig.key === 'created_at' || sortConfig.key === 'timestamp') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }
        
        // Xử lý number
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        // Xử lý string
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  // Tính toán phân trang
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset về trang 1
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(column.key)}
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-200 transition-colors select-none"
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {sortConfig.key === column.key && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                    {sortConfig.key !== column.key && (
                      <span className="text-gray-400 opacity-50">↕</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentData.length > 0 ? (
              currentData.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {column.key === 'created_at' || column.key === 'timestamp'
                        ? formatDate(row[column.key])
                        : column.key === 'action'
                        ? <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row[column.key] === 'on' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {row[column.key].toUpperCase()}
                          </span>
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-4xl mb-3">📊</span>
                    <p className="text-lg font-medium">Không có dữ liệu</p>
                    <p className="text-sm text-gray-400 mt-1">Dữ liệu sẽ xuất hiện khi có bản ghi mới</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Controls */}
      {sortedData.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          {/* Rows per page selector */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <label className="text-sm text-gray-700 font-medium">Số bản ghi mỗi trang:</label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="text-sm text-gray-700 font-medium">
              Hiển thị <span className="font-bold text-blue-600">{startIndex + 1}</span> - <span className="font-bold text-blue-600">{Math.min(endIndex, sortedData.length)}</span> trong tổng số <span className="font-bold text-blue-600">{sortedData.length}</span> bản ghi
            </div>
          </div>
          
          {/* Pagination buttons */}
          {totalPages > 1 && (
            <div className="flex space-x-1 justify-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
              }`}
            >
              ← Trước
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, index) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = index + 1;
              } else if (currentPage <= 3) {
                pageNum = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + index;
              } else {
                pageNum = currentPage - 2 + index;
              }
              
              return (
                <button
                  key={index}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
              }`}
            >
              Sau →
            </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;

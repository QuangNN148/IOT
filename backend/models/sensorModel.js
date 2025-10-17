// Model xử lý queries cho sensors_data
const { pool } = require('../config/db');

// Thêm dữ liệu cảm biến mới
const insertSensorData = async (temperature, humidity, light) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO sensors_data (temperature, humidity, light) VALUES (?, ?, ?)',
      [temperature, humidity, light]
    );
    return result.insertId;
  } catch (error) {
    console.error('❌ Lỗi insert sensor data:', error.message);
    throw error;
  }
};

// Lấy dữ liệu cảm biến mới nhất
const getLatestSensorData = async () => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM sensors_data ORDER BY created_at DESC LIMIT 1'
    );
    return rows[0] || null;
  } catch (error) {
    console.error('❌ Lỗi get latest sensor:', error.message);
    throw error;
  }
};

// Lấy lịch sử dữ liệu cảm biến với filter
const getSensorHistory = async (filters = {}) => {
  try {
    let query = 'SELECT * FROM sensors_data WHERE 1=1';
    const params = [];

    // Filter theo ngày bắt đầu
    if (filters.from) {
      query += ' AND created_at >= ?';
      params.push(filters.from);
    }

    // Filter theo ngày kết thúc
    if (filters.to) {
      query += ' AND created_at <= ?';
      params.push(filters.to + ' 23:59:59');
    }

    // Tìm kiếm nâng cao dựa theo dataType
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.trim();
      const dataType = filters.dataType || 'all';
      
      // Xây dựng điều kiện WHERE phức tạp cho tìm kiếm
      const searchConditions = [];
      
      // Tìm kiếm theo ID (luôn luôn)
      searchConditions.push(`id LIKE ?`);
      params.push(`%${searchTerm}%`);
      
      if (dataType === 'all' || dataType === 'temperature') {
        // Tìm kiếm trong temperature
        searchConditions.push(`temperature LIKE ?`);
        params.push(`%${searchTerm}%`);
        
        // Tìm kiếm theo từ khóa nhiệt độ
        const tempKeywords = ['nhiệt', 'nóng', 'lạnh', 'cao', 'thấp'];
        if (tempKeywords.some(kw => searchTerm.toLowerCase().includes(kw))) {
          if (searchTerm.toLowerCase().includes('nóng') || searchTerm.toLowerCase().includes('cao')) {
            searchConditions.push(`temperature > 30`);
          }
          if (searchTerm.toLowerCase().includes('lạnh') || searchTerm.toLowerCase().includes('thấp')) {
            searchConditions.push(`temperature < 20`);
          }
        }
      }
      
      if (dataType === 'all' || dataType === 'humidity') {
        // Tìm kiếm trong humidity
        searchConditions.push(`humidity LIKE ?`);
        params.push(`%${searchTerm}%`);
        
        // Tìm kiếm theo từ khóa độ ẩm
        if (searchTerm.toLowerCase().includes('ẩm') || searchTerm.toLowerCase().includes('khô')) {
          if (searchTerm.toLowerCase().includes('cao') || searchTerm.toLowerCase().includes('ẩm')) {
            searchConditions.push(`humidity > 70`);
          }
          if (searchTerm.toLowerCase().includes('thấp') || searchTerm.toLowerCase().includes('khô')) {
            searchConditions.push(`humidity < 40`);
          }
        }
      }
      
      if (dataType === 'all' || dataType === 'light') {
        // Tìm kiếm trong light
        searchConditions.push(`light LIKE ?`);
        params.push(`%${searchTerm}%`);
        
        // Tìm kiếm theo từ khóa ánh sáng
        if (searchTerm.toLowerCase().includes('sáng') || searchTerm.toLowerCase().includes('tối')) {
          if (searchTerm.toLowerCase().includes('sáng') || searchTerm.toLowerCase().includes('cao')) {
            searchConditions.push(`light > 600`);
          }
          if (searchTerm.toLowerCase().includes('tối') || searchTerm.toLowerCase().includes('thấp')) {
            searchConditions.push(`light < 400`);
          }
        }
      }
      
      if (dataType === 'all' || dataType === 'time') {
        // Tìm kiếm theo thời gian (DATE_FORMAT)
        // Format: HH:MM:SS DD/MM/YYYY
        searchConditions.push(`DATE_FORMAT(created_at, '%H:%i:%s %d/%m/%Y') LIKE ?`);
        params.push(`%${searchTerm}%`);
        
        // Format: HH:MM:SS
        searchConditions.push(`DATE_FORMAT(created_at, '%H:%i:%s') LIKE ?`);
        params.push(`%${searchTerm}%`);
        
        // Format: HH:MM
        searchConditions.push(`DATE_FORMAT(created_at, '%H:%i') LIKE ?`);
        params.push(`%${searchTerm}%`);
        
        // Format: DD/MM/YYYY
        searchConditions.push(`DATE_FORMAT(created_at, '%d/%m/%Y') LIKE ?`);
        params.push(`%${searchTerm}%`);
        
        // Format: DD/MM
        searchConditions.push(`DATE_FORMAT(created_at, '%d/%m') LIKE ?`);
        params.push(`%${searchTerm}%`);
        
        // Format: DD
        searchConditions.push(`DATE_FORMAT(created_at, '%d') LIKE ?`);
        params.push(`%${searchTerm}%`);
        
        // Tìm theo từ khóa thời gian tiếng Việt
        const lowerSearch = searchTerm.toLowerCase();
        if (lowerSearch.includes('sáng') || lowerSearch.includes('sang') || lowerSearch.includes('morning')) {
          searchConditions.push(`HOUR(created_at) >= 6 AND HOUR(created_at) < 12`);
        }
        if (lowerSearch.includes('chiều') || lowerSearch.includes('chieu') || lowerSearch.includes('afternoon')) {
          searchConditions.push(`HOUR(created_at) >= 12 AND HOUR(created_at) < 18`);
        }
        if (lowerSearch.includes('tối') || lowerSearch.includes('evening')) {
          searchConditions.push(`HOUR(created_at) >= 18 AND HOUR(created_at) < 22`);
        }
        if (lowerSearch.includes('đêm') || lowerSearch.includes('dem') || lowerSearch.includes('night')) {
          searchConditions.push(`(HOUR(created_at) >= 22 OR HOUR(created_at) < 6)`);
        }
      }
      
      // Chỉ lọc theo dataType cụ thể nếu không phải 'all'
      if (dataType !== 'all' && searchConditions.length > 1) {
        // Loại bỏ điều kiện ID search đầu tiên và thêm lại cuối cùng để nó luôn được OR
        searchConditions.shift();
        params.shift();
      }
      
      if (searchConditions.length > 0) {
        query += ' AND (' + searchConditions.join(' OR ') + ')';
      }
    }

    // Sort theo thời gian mới nhất
    query += ' ORDER BY created_at DESC';

    // Limit số lượng kết quả
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error('❌ Lỗi get sensor history:', error.message);
    throw error;
  }
};

module.exports = {
  insertSensorData,
  getLatestSensorData,
  getSensorHistory
};

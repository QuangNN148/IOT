// Model xử lý queries cho action_history
const { pool } = require('../config/db');

// Thêm lịch sử hành động
const insertAction = async (device, action) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO action_history (device, action) VALUES (?, ?)',
      [device, action]
    );
    return result.insertId;
  } catch (error) {
    console.error('❌ Lỗi insert action:', error.message);
    throw error;
  }
};

// Lấy lịch sử hành động với filter
const getActionHistory = async (filters = {}) => {
  try {
    let query = 'SELECT * FROM action_history WHERE 1=1';
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

    // Filter theo thiết bị cụ thể
    if (filters.deviceFilter && filters.deviceFilter !== 'all') {
      query += ' AND device = ?';
      params.push(filters.deviceFilter);
    }

    // Filter theo trạng thái cụ thể
    if (filters.actionFilter && filters.actionFilter !== 'all') {
      query += ' AND action = ?';
      params.push(filters.actionFilter);
    }

    // Tìm kiếm nâng cao dựa theo dataType
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.trim();
      const lowerSearch = searchTerm.toLowerCase();
      const dataType = filters.dataType || 'all';
      
      // Xây dựng điều kiện WHERE phức tạp cho tìm kiếm
      const searchConditions = [];
      
      // Tìm kiếm theo ID (luôn luôn)
      searchConditions.push(`id LIKE ?`);
      params.push(`%${searchTerm}%`);
      
      if (dataType === 'all' || dataType === 'device') {
        // Kiểm tra từ khóa thiết bị TRƯỚC khi dùng LIKE
        const isDeviceKeyword = 
          lowerSearch.includes('light') || lowerSearch.includes('đèn') || lowerSearch.includes('den') ||
          lowerSearch.includes('fan') || lowerSearch.includes('quạt') || lowerSearch.includes('quat') ||
          lowerSearch.includes('air') || lowerSearch.includes('điều hòa') || lowerSearch.includes('dieu hoa') || 
          lowerSearch.includes('máy lạnh') || lowerSearch.includes('may lanh');
        
        if (isDeviceKeyword) {
          // Nếu là từ khóa thiết bị, chỉ tìm chính xác
          if (lowerSearch.includes('light') || lowerSearch.includes('đèn') || lowerSearch.includes('den')) {
            searchConditions.push(`device = 'Light'`);
          }
          if (lowerSearch.includes('fan') || lowerSearch.includes('quạt') || lowerSearch.includes('quat')) {
            searchConditions.push(`device = 'Fan'`);
          }
          if (lowerSearch.includes('air') || lowerSearch.includes('điều hòa') || lowerSearch.includes('dieu hoa') || lowerSearch.includes('máy lạnh') || lowerSearch.includes('may lanh')) {
            searchConditions.push(`device = 'Air condition'`);
          }
        } else {
          // Nếu không phải từ khóa, dùng LIKE để tìm kiếm tự do
          searchConditions.push(`device LIKE ?`);
          params.push(`%${searchTerm}%`);
        }
      }
      
      if (dataType === 'all' || dataType === 'action') {
        // Kiểm tra từ khóa hành động TRƯỚC
        const isActionKeyword = 
          lowerSearch === 'on' || lowerSearch === 'off' ||
          lowerSearch.includes('bật') || lowerSearch.includes('bat') || 
          lowerSearch.includes('tắt') || lowerSearch.includes('tat') ||
          lowerSearch.includes('mở') || lowerSearch.includes('mo') ||
          lowerSearch.includes('đóng') || lowerSearch.includes('dong');
        
        if (isActionKeyword) {
          // Nếu là từ khóa hành động, chỉ tìm chính xác
          if (lowerSearch === 'on' || lowerSearch.includes('bật') || lowerSearch.includes('bat') || lowerSearch.includes('mở') || lowerSearch.includes('mo')) {
            searchConditions.push(`action = 'ON'`);
          }
          if (lowerSearch === 'off' || lowerSearch.includes('tắt') || lowerSearch.includes('tat') || lowerSearch.includes('đóng') || lowerSearch.includes('dong')) {
            searchConditions.push(`action = 'OFF'`);
          }
        } else {
          // Nếu không phải từ khóa, dùng LIKE để tìm kiếm tự do
          searchConditions.push(`action LIKE ?`);
          params.push(`%${searchTerm}%`);
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
    console.error('❌ Lỗi get action history:', error.message);
    throw error;
  }
};

// Lấy hành động mới nhất của từng thiết bị
const getLatestActions = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM action_history 
      WHERE id IN (
        SELECT MAX(id) FROM action_history GROUP BY device
      )
      ORDER BY created_at DESC
    `);
    return rows;
  } catch (error) {
    console.error('❌ Lỗi get latest actions:', error.message);
    throw error;
  }
};

// Lấy trạng thái cuối cùng của một thiết bị cụ thể
const getDeviceState = async (device) => {
  try {
    const [rows] = await pool.query(
      'SELECT action FROM action_history WHERE device = ? ORDER BY created_at DESC LIMIT 1',
      [device]
    );
    return rows[0] ? rows[0].action : null;
  } catch (error) {
    console.error('❌ Lỗi get device state:', error.message);
    throw error;
  }
};

module.exports = {
  insertAction,
  getActionHistory,
  getLatestActions,
  getDeviceState
};

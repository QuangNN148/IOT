// Controller xử lý API liên quan đến dashboard statistics
const { pool } = require('../config/db');

// GET /api/dashboard/sensor-threshold-stats
// Thống kê số lần vượt ngưỡng của mỗi cảm biến
const getSensorThresholdStats = async (req, res) => {
  try {
    const { 
      tempThreshold = 30, 
      humidityThreshold = 80, 
      lightThreshold = 700 
    } = req.query;

    const query = `
      SELECT 
        COUNT(CASE WHEN temperature > ? THEN 1 END) as temp_exceeded_count,
        COUNT(CASE WHEN humidity > ? THEN 1 END) as humidity_exceeded_count,
        COUNT(CASE WHEN light > ? THEN 1 END) as light_exceeded_count
      FROM sensors_data
    `;

    const [rows] = await pool.query(query, [
      parseFloat(tempThreshold),
      parseFloat(humidityThreshold),
      parseFloat(lightThreshold)
    ]);

    const stats = {
      temperature: {
        threshold: parseFloat(tempThreshold),
        exceeded_count: rows[0].temp_exceeded_count || 0
      },
      humidity: {
        threshold: parseFloat(humidityThreshold),
        exceeded_count: rows[0].humidity_exceeded_count || 0
      },
      light: {
        threshold: parseFloat(lightThreshold),
        exceeded_count: rows[0].light_exceeded_count || 0
      }
    };

    res.json({ 
      success: true, 
      data: stats 
    });
  } catch (error) {
    console.error('❌ Lỗi getSensorThresholdStats:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// GET /api/dashboard/device-toggle-stats
// Thống kê số lượt bật/tắt của mỗi thiết bị theo ngày
const getDeviceToggleStats = async (req, res) => {
  try {
    const { date } = req.query;
    
    let dateFilter = '';
    let params = [];
    
    if (date) {
      // Filter by specific date
      dateFilter = 'WHERE DATE(created_at) = ?';
      params.push(date);
    } else {
      // Default to today
      dateFilter = 'WHERE DATE(created_at) = CURDATE()';
    }

    const query = `
      SELECT 
        device,
        COUNT(*) as toggle_count,
        SUM(CASE WHEN action = 'on' THEN 1 ELSE 0 END) as on_count,
        SUM(CASE WHEN action = 'off' THEN 1 ELSE 0 END) as off_count,
        MAX(created_at) as last_action_time
      FROM action_history
      ${dateFilter}
      GROUP BY device
      ORDER BY toggle_count DESC
    `;

    const [rows] = await pool.query(query, params);

    res.json({ 
      success: true, 
      data: rows,
      date: date || new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('❌ Lỗi getDeviceToggleStats:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

module.exports = {
  getSensorThresholdStats,
  getDeviceToggleStats
};

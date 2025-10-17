// Controller xử lý API liên quan đến sensor data
const sensorModel = require('../models/sensorModel');

// GET /api/sensors/latest - Lấy dữ liệu cảm biến mới nhất
const getLatestSensor = async (req, res) => {
  try {
    const data = await sensorModel.getLatestSensorData();
    if (!data) {
      return res.status(404).json({ 
        success: false, 
        message: 'Chưa có dữ liệu cảm biến' 
      });
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Lỗi getLatestSensor:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// GET /api/sensors/history - Lấy lịch sử dữ liệu cảm biến với filter
const getSensorHistory = async (req, res) => {
  try {
    const { from, to, search, limit, dataType } = req.query;
    
    const filters = {
      from: from || null,
      to: to || null,
      search: search || null,
      dataType: dataType || 'all', // all, temperature, humidity, light, time
      limit: limit || 1000
    };

    const data = await sensorModel.getSensorHistory(filters);
    res.json({ 
      success: true, 
      data,
      count: data.length 
    });
  } catch (error) {
    console.error('❌ Lỗi getSensorHistory:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

module.exports = {
  getLatestSensor,
  getSensorHistory
};

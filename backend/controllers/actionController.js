// Controller xử lý API liên quan đến action history
const actionModel = require('../models/actionModel');

// GET /api/actions/history - Lấy lịch sử hành động với filter
const getActionHistory = async (req, res) => {
  try {
    const { from, to, search, limit, dataType, deviceFilter, actionFilter } = req.query;
    
    const filters = {
      from: from || null,
      to: to || null,
      search: search || null,
      dataType: dataType || 'all', // all, device, action, time
      deviceFilter: deviceFilter || 'all', // all, Light, Fan, Air condition
      actionFilter: actionFilter || 'all', // all, ON, OFF
      limit: limit || 1000
    };

    const data = await actionModel.getActionHistory(filters);
    res.json({ 
      success: true, 
      data,
      count: data.length 
    });
  } catch (error) {
    console.error('❌ Lỗi getActionHistory:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// GET /api/actions/latest - Lấy hành động mới nhất của từng thiết bị
const getLatestActions = async (req, res) => {
  try {
    const data = await actionModel.getLatestActions();
    res.json({ 
      success: true, 
      data 
    });
  } catch (error) {
    console.error('❌ Lỗi getLatestActions:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// GET /api/actions/state/:device - Lấy trạng thái cuối cùng của thiết bị
const getDeviceState = async (req, res) => {
  try {
    const { device } = req.params;
    const state = await actionModel.getDeviceState(device);
    
    res.json({ 
      success: true, 
      device,
      state: state || 'OFF' // Mặc định OFF nếu chưa có lịch sử
    });
  } catch (error) {
    console.error('❌ Lỗi getDeviceState:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

module.exports = {
  getActionHistory,
  getLatestActions,
  getDeviceState
};

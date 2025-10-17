// Controller xử lý điều khiển thiết bị
const { controlDevice } = require('../services/mqttService');

// POST /api/control - Điều khiển thiết bị (LED)
const controlDeviceHandler = async (req, res) => {
  try {
    const { device, action } = req.body;

    // Validate input
    if (!device || !action) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin device hoặc action'
      });
    }

    // Validate device (led1, led2, led3)
    if (!['led1', 'led2', 'led3'].includes(device)) {
      return res.status(400).json({
        success: false,
        message: 'Device không hợp lệ. Chỉ chấp nhận: led1, led2, led3'
      });
    }

    // Validate action (on, off)
    if (!['on', 'off'].includes(action.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Action không hợp lệ. Chỉ chấp nhận: on, off'
      });
    }

    // Gửi lệnh điều khiển và chờ xác nhận từ ESP32
    const result = await controlDevice(device, action.toLowerCase());

    res.json({
      success: true,
      message: 'Điều khiển thành công',
      data: result
    });

  } catch (error) {
    console.error('❌ Lỗi controlDevice:', error.message);
    
    // Xử lý lỗi timeout
    if (error.message.includes('Timeout')) {
      return res.status(408).json({
        success: false,
        message: 'Timeout: Không nhận được phản hồi từ ESP32',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi điều khiển thiết bị',
      error: error.message
    });
  }
};

module.exports = {
  controlDeviceHandler
};

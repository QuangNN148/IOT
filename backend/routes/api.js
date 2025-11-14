// Routes cho tất cả API endpoints
const express = require('express');
const router = express.Router();

const sensorController = require('../controllers/sensorController');
const actionController = require('../controllers/actionController');
const controlController = require('../controllers/controlController');
const dashboardController = require('../controllers/dashboardController');

// Sensor routes
router.get('/sensors/latest', sensorController.getLatestSensor);
router.get('/sensors/history', sensorController.getSensorHistory);

// Action routes
router.get('/actions/history', actionController.getActionHistory);
router.get('/actions/latest', actionController.getLatestActions);
router.get('/actions/state/:device', actionController.getDeviceState);

// Control routes
router.post('/control', controlController.controlDeviceHandler);

// Dashboard routes
router.get('/dashboard/sensor-threshold-stats', dashboardController.getSensorThresholdStats);
router.get('/dashboard/device-toggle-stats', dashboardController.getDeviceToggleStats);

// Profile route - thông tin cố định
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Nguyễn Nhật Quang',
      msv: 'B22DCCN645',
      class: 'D22HTT05',
      phone: '0936201378',
      email: 'nnq148@gmail.com',
      links: {
        docs: 'https://drive.google.com/file/d/1se5VtjO6zC8kc6FALnsh5eztUxH8fYfB/view?usp=sharing',
        github: 'https://github.com/QuangNN148/IOT',
        figma: 'https://www.figma.com/design/Sm76XtgKfl2NPkhor7BguA/Untitled?node-id=0-1&p=f&t=lseJS3F2wu79SmOl-0',
        api: 'http://localhost:5000/docs'
      }
    }
  });
});

module.exports = router;

// Routes cho tất cả API endpoints
const express = require('express');
const router = express.Router();

const sensorController = require('../controllers/sensorController');
const actionController = require('../controllers/actionController');
const controlController = require('../controllers/controlController');

// Sensor routes
router.get('/sensors/latest', sensorController.getLatestSensor);
router.get('/sensors/history', sensorController.getSensorHistory);

// Action routes
router.get('/actions/history', actionController.getActionHistory);
router.get('/actions/latest', actionController.getLatestActions);
router.get('/actions/state/:device', actionController.getDeviceState);

// Control routes
router.post('/control', controlController.controlDeviceHandler);

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
        docs: 'https://docs.google.com/your-docs-link',
        github: 'https://github.com/nnq148',
        figma: 'https://www.figma.com/design/Sm76XtgKfl2NPkhor7BguA/Untitled?node-id=0-1&p=f&t=lseJS3F2wu79SmOl-0',
        postman: 'https://postman.com/your-collection-link',
        diagram: 'https://draw.io/your-diagram-link'
      }
    }
  });
});

module.exports = router;

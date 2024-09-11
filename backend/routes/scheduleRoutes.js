const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.post('/', scheduleController.createSchedule);
router.get('/', scheduleController.get);
// router.get('/:id', scheduleController.);
// router.put('/:id', scheduleController.);
// router.delete('/:id', scheduleController.);

module.exports = router;
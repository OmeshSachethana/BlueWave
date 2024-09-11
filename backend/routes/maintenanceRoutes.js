const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

router.post('/', maintenanceController.createMaintenance);
router.get('/', maintenanceController.getAllMaintenanceRecords);
// router.get('/:id', maintenanceController.getEmployeeById);
// router.put('/:id', maintenanceController.updateEmployee);
// router.delete('/:id', maintenanceController.deleteEmployee);

module.exports = router;
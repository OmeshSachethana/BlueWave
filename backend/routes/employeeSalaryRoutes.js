const express = require('express');
const router = express.Router();
const employeeSalaryController = require('../controllers/employeeSalaryController');

router.post('/', employeeSalaryController.createEmployeeSalary);
// router.get('/', employeeSalaryController.getAllEmployees);
// router.get('/:id', employeeSalaryController.getEmployeeById);
// router.put('/:id', employeeSalaryController.updateEmployee);
// router.delete('/:id', employeeSalaryController.deleteEmployee);

module.exports = router;
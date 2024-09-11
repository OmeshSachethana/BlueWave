const express = require('express');
const router = express.Router();
const employeeSalaryController = require('../controllers/employeeSalaryController');

router.post('/', employeeSalaryController.createEmployeeSalary);
router.get('/:employeeID', employeeSalaryController.getEmployeeSalary);
router.put('/:employeeID', employeeSalaryController.updateEmployeeSalary);
router.delete('/:employeeID', employeeSalaryController.deleteEmployeeSalary);

module.exports = router;
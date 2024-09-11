const express = require('express');
const router = express.Router();
const employeeSalaryController = require('../controllers/employeeSalaryController');

router.post('/', employeeSalaryController.createEmployeeSalary);
router.get('/:id', employeeSalaryController.getEmployeeSalary);
router.put('/:id', employeeSalaryController.updateEmployeeSalary);
router.delete('/:id', employeeSalaryController.deleteEmployeeSalary);

module.exports = router;
const Employee = require('../models/employee');  // Import the Employee model
const EmployeeSalary = require('../models/employeeSalary');  // Import the EmployeeSalary model

// Create a new employee salary entry
exports.createEmployeeSalary = async (req, res) => {
  try {
    // Check if the employee exists
    const employee = await Employee.findOne({ employeeID: req.body.employeeID });
    if (!employee) {
      return res.status(400).json({ message: `Employee with ID ${req.body.employeeID} does not exist.` });
    }

    // If employee exists, create a new salary entry
    const newSalary = new EmployeeSalary(req.body);
    const savedSalary = await newSalary.save();

    res.status(201).json({
      message: 'Salary record created successfully',
      salary: savedSalary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







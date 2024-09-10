const Employee = require('../models/employee');

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save();
    res.status(201).json({
      message: 'Employee created successfully',
      employee: savedEmployee,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating employee',
      error: error.message,
    });
  }
};


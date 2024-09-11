const Maintenance = require('../models/maintenance'); // Adjust the path as necessary

// Create a new maintenance record
exports.createMaintenance = async (req, res) => {
  try {
    const maintenance = new Maintenance(req.body);
    await maintenance.save();
    res.status(201).json({
      message: 'Maintenance record created successfully',
      data: maintenance
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating maintenance record',
      error: error.message
    });
  }
};







const mongoose = require('mongoose');

// Define the Maintenance schema
const maintenanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],  // Restricted to these 3 statuses
    required: true
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],  // Restricted to these 3 priority levels
    required: true
  },
  technician: {
    type: String,
    required: true  // Technician's name (can also be an ObjectId if linked to another collection)
  }
}, { timestamps: true });

// Create the Maintenance model
const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

module.exports = Maintenance;

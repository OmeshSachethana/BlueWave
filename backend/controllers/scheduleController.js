const Schedule = require('../models/schedule'); // Adjust the path as necessary

// Create a new schedule
exports.createSchedule = async (req, res) => {
  try {
    const schedule = new Schedule(req.body);
    await schedule.save();
    res.status(201).json({
      message: 'Schedule created successfully',
      data: schedule
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating schedule',
      error: error.message
    });
  }
};

// Get all schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.status(200).json({
      message: 'Schedules fetched successfully',
      data: schedules
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching schedules',
      error: error.message
    });
  }
};




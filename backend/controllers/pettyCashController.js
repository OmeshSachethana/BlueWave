const PettyCash = require('../models/pettyCash');

// Create a new petty cash entry
const createEntry = async (req, res) => {
  try {
    const newEntry = new PettyCash(req.body);
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all petty cash entries
const getEntries = async (req, res) => {
  try {
    const entries = await PettyCash.find();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single petty cash entry by ID
const getEntryById = async (req, res) => {
  try {
    const entry = await PettyCash.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a petty cash entry by ID
const updateEntry = async (req, res) => {
  try {
    const updatedEntry = await PettyCash.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a petty cash entry by ID
const deleteEntry = async (req, res) => {
  try {
    const deletedEntry = await PettyCash.findByIdAndDelete(req.params.id);
    if (!deletedEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
};

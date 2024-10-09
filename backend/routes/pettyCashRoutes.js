const express = require('express');
const {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
} = require('../controllers/pettyCashController');

const router = express.Router();

// POST: Create a new petty cash entry
router.post('/', createEntry);

// GET: Retrieve all petty cash entries
router.get('/', getEntries);

// GET: Retrieve a petty cash entry by ID
router.get('/:id', getEntryById);

// PUT: Update a petty cash entry by ID
router.put('/:id', updateEntry);

// DELETE: Delete a petty cash entry by ID
router.delete('/:id', deleteEntry);

module.exports = router;

const express = require('express');
const router = express.Router();
const itemController = require('../controllers/employeeController');

router.post('/employees', itemController.createItem);
router.get('/employees', itemController.getItems);
router.get('/employees/:id', itemController.getItem);
router.put('/employees/:id', itemController.updateItem);
router.delete('/employees/:id', itemController.deleteItem);

module.exports = router;
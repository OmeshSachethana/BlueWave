const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// CRUD routes for product catalog
router.post('/', productController.createProduct);       // Create
router.get('/', productController.getAllProducts);       // Read all
router.get('/:id', productController.getProductById);    // Read single
router.put('/:id', productController.updateProduct);     // Update
router.delete('/:id', productController.deleteProduct);  // Delete

module.exports = router;

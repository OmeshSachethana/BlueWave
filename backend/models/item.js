const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String, // URL for product images
        required: false
    },
    size: {
        type: String, // For bottles, e.g., "20 Liters", "5 Liters"
        required: false
    },
    type: {
        type: String,
        enum: ['bottle', 'dispenser', 'combo'], // Differentiates between types of products
        required: true
    },
    isSpecial: {
        type: Boolean, // To mark special promotions (e.g., "Golden Combo")
        default: false
    },
    quantity: {
        type: Number, // Optional field for combos (e.g., 5 bottles in Silver Combo)
        required: false
    }
});

module.exports = mongoose.model('Item', itemSchema);

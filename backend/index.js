const express = require('express');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/itemRoutes.js');
const employeeRoutes = require('./routes/employeeRoutes.js');
const employeeSalaryRoutes = require('./routes/employeeSalaryRoutes.js');
const scheduleRoutes = require('./routes/scheduleRoutes.js');
const maintenanceRoutes = require('./routes/maintenanceRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const promotionRoutes = require('./routes/promotionRoutes.js');
const subscriptionPlanRoutes = require('./routes/subscriptionPlanRoutes.js');
const discountRoutes = require('./routes/discountRoutes.js');
const packageRoutes = require('./routes/packageRoutes.js');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.get('/', (req, res) => res.status(200).json({ message: 'Server Up and Running' }))
app.use('/api/items', itemRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/employeesSalary', employeeSalaryRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/subscriptionPlans', subscriptionPlanRoutes); 
app.use('/api/discounts', discountRoutes); 
app.use('/api/packages', packageRoutes);


const PORT = process.env.PORT || 5002;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
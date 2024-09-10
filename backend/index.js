const express = require('express');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/itemRoutes.js');
const employeeRoutes = require('./routes/employeeRoutes.js');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.get('/', (req, res) => res.status(200).json({ message: 'Server Up and Running' }))
app.use('/api/items', itemRoutes);
app.use('/api/employees', employeeRoutes);



const PORT = process.env.PORT || 3000;
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
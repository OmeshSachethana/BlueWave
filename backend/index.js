const express = require('express');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/itemRoutes');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', itemRoutes);

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
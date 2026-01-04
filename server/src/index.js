const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('Expiry Date Waste Analyzer API');
});

// Import Routes (to be created)
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
// const statsRoutes = require('./routes/stats');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// app.use('/api/stats', statsRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

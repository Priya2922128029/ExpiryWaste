const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Middleware to verify token (mock for now or implement properly)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_change_me';

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// GET all products for user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { userId: req.user.id }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADD product
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, category, quantity, startDate, expiryDate, price, notes } = req.body;

        // Status Logic
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let status = "Safe";
        if (diffDays < 0) status = "Expired";
        else if (diffDays <= 7) status = "Expiring Soon";

        const product = await prisma.product.create({
            data: {
                userId: req.user.id,
                name,
                category,
                quantity: parseInt(quantity),
                startDate: new Date(startDate),
                expiryDate: expiry,
                price: parseFloat(price) || 0,
                notes,
                status
            }
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

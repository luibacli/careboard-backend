const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const User = require('../models/User');
const router = express.Router();

// Ensure to set a strong JWT secret in production via environment variables.

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (
        typeof username !== 'string' ||
        typeof email !== 'string' ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !password ||
        typeof password !== 'string' ||
        password.length < 6
    ) {
        return res.status(400).json({ message: 'Invalid input. Please provide a valid username, email, and password (min 6 characters).' });
    }

    try {
        // Check if user already exists by email or username
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // Use a logging library in production and avoid logging sensitive data
        if (process.env.NODE_ENV !== 'production') {
            // For development, log the error (without sensitive data)
            // You can replace this with a logger like 'winston' or 'morgan'
            console.error('Registration error:', error.message);
        }
        return res.status(500).json({ message: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (
        typeof email !== 'string' ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !password ||
        typeof password !== 'string'
    ) {
        return res.status(400).json({ message: 'Invalid input. Please provide a valid email and password.' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // You can generate a JWT token here if needed
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('Login error:', error.message);
        }
        return res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;

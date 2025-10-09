const express = require('express');
const app = express();
const PORT = 3000;

// Secret token for authentication
const SECRET_TOKEN = 'mysecrettoken';

/**
 * Logging Middleware
 * Logs HTTP method, URL, and timestamp for every request
 */
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next(); // Pass control to the next middleware or route
};

/**
 * Authentication Middleware
 * Checks for Bearer token in Authorization header
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"

    if (token !== SECRET_TOKEN) {
        return res.status(403).json({ error: 'Invalid or missing token' });
    }

    next(); // Token is valid, proceed to the route
};

// Apply logging middleware globally
app.use(requestLogger);

// Public Route
app.get('/public', (req, res) => {
    res.send('This is a public route, accessible without authentication.');
});

// Example protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route, accessible only with a valid token.');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
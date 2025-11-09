const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

// Secret key for JWT signing
const JWT_SECRET = 'your_secret_key';

// Sample user (hardcoded)
const user = {
  id: 1,
  username: 'admin',
  password: 'password123'
};

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check credentials
  if (username === user.username && password === user.password) {
    // User authenticated, generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

// JWT verification middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    
    req.user = decoded; // Save decoded info for route use
    next();
  });
}

// Protected route
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Welcome to the protected route!', user: req.user });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

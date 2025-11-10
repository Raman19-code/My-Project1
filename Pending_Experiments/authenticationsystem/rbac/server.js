const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

// JWT Secret
const JWT_SECRET = 'your_secret_key';

// Sample users (hardcoded)
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'Admin' },
  { id: 2, username: 'mod', password: 'mod123', role: 'Moderator' },
  { id: 3, username: 'user', password: 'user123', role: 'User' }
];

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // Create JWT with role
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// JWT verification middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = decoded; // Save decoded token info
    next();
  });
}

// Role-based access middleware
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'User not authenticated' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied for role: ${req.user.role}` });
    }
    next();
  };
}

// Protected routes for different roles
app.get('/admin-dashboard', verifyToken, authorizeRoles('Admin'), (req, res) => {
  res.json({ message: 'Welcome Admin! This is your dashboard.' });
});

app.get('/moderator-tools', verifyToken, authorizeRoles('Moderator'), (req, res) => {
  res.json({ message: 'Welcome Moderator! Manage users here.' });
});

app.get('/user-profile', verifyToken, authorizeRoles('User', 'Admin', 'Moderator'), (req, res) => {
  res.json({ message: `Welcome ${req.user.username}! This is your profile.` });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

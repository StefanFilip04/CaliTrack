const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// UPDATE THIS CORS CONFIGURATION
app.use(cors({
    origin: ['https://calitrack.pages.dev', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../public/html')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/workouts', require('./routes/workouts'));

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        message: '✅ API is working!', 
        timestamp: new Date().toISOString(),
        status: 'online'
    });
});

// HTML Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/dashboard.html'));
});

app.get('/workouts.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/workouts.html'));
});

app.get('/skills.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/skills.html'));
});

app.get('/nutrition.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/nutrition.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/login.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/register.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`🔧 Test API: http://localhost:${PORT}/api/test`);
    console.log(`🌐 Web app: http://localhost:${PORT}`);
});
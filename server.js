const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');  // Import HTTP module
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile'); // Ensure this exists

dotenv.config();
const app = express();
const server = http.createServer(app);  // Use Express app with HTTP server

// Initialize Socket.io with CORS settings
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  // Allow your React app
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS for all routes

// Serve static files (for uploaded images)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection (this is optional if you use a separate db.js file)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed: ' + err.message);
    } else {
        console.log('✅ Connected to MySQL Database');
    }
});

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/profile', profileRoutes);

// SOCKET.IO HANDLING
io.on('connection', (socket) => {
    console.log('⚡ A user connected');

    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', msg); // Broadcast message to all clients
    });

    socket.on('disconnect', () => {
        console.log('❌ A user disconnected');
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

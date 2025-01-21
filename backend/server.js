const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const DB_URI = process.env.MONGO_URI;

mongoose.connect(DB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('DB connection error:', err));

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use('/api/auth', authRoutes);

// Routes
const emailRoutes = require('./routes/email');
app.use('/api', emailRoutes);
app.use('/uploads', express.static('uploads'));


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve data files
app.use('/data', express.static(path.join(__dirname, 'public/data')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/compsec_compliance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/risks', require('./routes/risks'));
app.use('/api/compliance', require('./routes/compliance'));
app.use('/api/frameworks', require('./routes/frameworks'));
app.use('/api/assessments', require('./routes/assessments'));

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`CompSec - Security Compliance Management System running on port ${PORT}`);
  console.log(`Access the application at: http://localhost:${PORT}`);
});

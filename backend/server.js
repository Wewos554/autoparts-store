require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Статические файлы (фронтенд) – из папки frontend/public
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Роуты API
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// Отдельные маршруты для HTML страниц (чтобы были красивые URL)
app.get('/auth/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/login.html'));
});
app.get('/auth/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/register.html'));
});
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/profile.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
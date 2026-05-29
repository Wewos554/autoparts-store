const express = require('express');
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

const router = express.Router();
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Получить все товары (публично)
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить один товар
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Товар не найден' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создать товар (только авторизованные)
router.post('/', auth, [
  body('name').notEmpty(),
  body('brand').notEmpty(),
  body('category').notEmpty(),
  body('price').isNumeric(),
  body('stock').optional().isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить товар (только авторизованные)
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Товар не найден' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить товар (только авторизованные)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Товар не найден' });
    res.json({ message: 'Товар удалён' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
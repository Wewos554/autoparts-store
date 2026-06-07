const express = require('express');
const auth = require('../middleware/auth');
const Favorite = require('../models/Favorite');
const Item = require('../models/Item');

const router = express.Router();

// Получить избранное пользователя
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.userId }).populate('itemId');
    const items = favorites.map(f => f.itemId).filter(i => i !== null);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Добавить в избранное
router.post('/', auth, async (req, res) => {
  try {
    const { itemId } = req.body;
    
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    
    const existing = await Favorite.findOne({ userId: req.userId, itemId });
    if (existing) {
      return res.status(400).json({ message: 'Товар уже в избранном' });
    }
    
    const favorite = new Favorite({ userId: req.userId, itemId });
    await favorite.save();
    res.json({ message: 'Добавлено в избранное' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить из избранного
router.delete('/:itemId', auth, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ userId: req.userId, itemId: req.params.itemId });
    res.json({ message: 'Удалено из избранного' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;

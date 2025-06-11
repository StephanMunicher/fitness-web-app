const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Отримати дані користувача
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.getById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Повертаємо тільки потрібні поля
    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      goal: user.goal,
      weight_history: user.weightHistory
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
});

// Оновити мету тренувань
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { goal } = req.body;
    const updated = await User.updateGoal(req.user.id, goal);
    res.json({
      id: updated.id,
      email: updated.email,
      username: updated.username,
      goal: updated.goal,
      weight_history: updated.weightHistory
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update goal', error: error.message });
  }
});

// Додати нову вагу
router.post('/me/weight', authMiddleware, async (req, res) => {
  try {
    const { weight } = req.body;
    if (!weight) return res.status(400).json({ message: 'Weight is required' });

    const updated = await User.addWeight(req.user.id, weight);
    res.json({
      id: updated.id,
      email: updated.email,
      username: updated.username,
      goal: updated.goal,
      weight_history: updated.weightHistory
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add weight', error: error.message });
  }
});

// Змінити пароль
router.put('/me/password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and new password are required' });
    }
    const result = await User.changePassword(req.user.id, oldPassword, newPassword);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password', error: error.message });
  }
});

module.exports = router;
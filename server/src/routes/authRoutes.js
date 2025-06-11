const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Реєстрація
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Перевірка, чи існує користувач з таким email
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Хешування пароля
    const passwordHash = await bcrypt.hash(password, 10);

    // Створення користувача
    const newUser = await User.create(email, passwordHash, username);

    // Створення JWT токена
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Повертаємо токен і профіль користувача
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        goal: newUser.goal,
        weight_history: newUser.weightHistory
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Вхід
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Перевірка, чи існує користувач з таким email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Перевірка пароля
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Створення JWT токена
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Повертаємо токен і профіль користувача
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        goal: user.goal,
        weight_history: user.weightHistory
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
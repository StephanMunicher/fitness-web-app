const express = require('express');
const router = express.Router();
const workoutLogController = require('../controllers/workoutLogController');
const authMiddleware = require('../middleware/authMiddleware');

// Всі роути захищені middleware перевірки авторизації
router.use(authMiddleware); // Прибрали .verifyToken

// Додати запис про виконане тренування
router.post('/', workoutLogController.logWorkout);

// Отримати статистику
router.get('/stats', workoutLogController.getStats);

// Отримати всі записи користувача
router.get('/', workoutLogController.getUserLogs);

module.exports = router;
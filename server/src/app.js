const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Додати статичний роут для доступу до зображень
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Інші роути залишаються без змін
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/exercises', require('./routes/exerciseRoutes'));
app.use('/api/plans', require('./routes/workoutPlanRoutes'));
app.use('/api/workout-exercises', require('./routes/workoutExerciseRoutes'));
app.use('/api/workout-logs', require('./routes/workoutLogRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// Обробка помилок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
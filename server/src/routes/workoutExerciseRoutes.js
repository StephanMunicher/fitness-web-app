const express = require('express');
const WorkoutExercise = require('../models/WorkoutExercise');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Отримати всі вправи у плані
router.get('/:workoutPlanId', authMiddleware, async (req, res) => {
  try {
    const { workoutPlanId } = req.params;
    const exercises = await WorkoutExercise.getAll(workoutPlanId);
    res.json(exercises);
  } catch (error) {
    console.error(error);
    if (error.message === 'Workout plan not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ 
      message: 'Failed to get workout exercises',
      error: error.message 
    });
  }
});

// Створити вправу у плані
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { workoutPlanId, exerciseId, sets, reps, weight, orderNumber } = req.body;

    if (!workoutPlanId || !exerciseId || !sets || !reps || !orderNumber) {
      return res.status(400).json({ message: 'All fields except weight are required' });
    }

    const newExercise = await WorkoutExercise.create(
      workoutPlanId,
      exerciseId,
      sets,
      reps,
      weight,
      orderNumber
    );
    res.status(201).json(newExercise);
  } catch (error) {
    console.error('Error adding exercise to plan:', error);
    if (error.message === 'Workout plan not found' || error.message === 'Exercise not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ 
      message: 'Failed to create workout exercise',
      error: error.message 
    });
  }
});

// Оновити вправу в плані
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { sets, reps, weight, orderNumber } = req.body;

    if (!sets || !reps || !orderNumber) {
      return res.status(400).json({ message: 'Sets, reps, and order number are required' });
    }

    const updatedExercise = await WorkoutExercise.update(id, sets, reps, weight, orderNumber);
    res.json(updatedExercise);
  } catch (error) {
    console.error('Error updating workout exercise:', error);
    if (error.message === 'Workout exercise not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ 
      message: 'Failed to update workout exercise',
      error: error.message 
    });
  }
});

// Видалити вправу з плану
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await WorkoutExercise.delete(id);
    res.json({ message: 'Workout exercise deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout exercise:', error);
    if (error.message === 'Workout exercise not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ 
      message: 'Failed to delete workout exercise',
      error: error.message 
    });
  }
});

module.exports = router;


/*Валідація при додаванні вправи до плану
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { workoutPlanId, exerciseId, sets, reps, weight, orderNumber } = req.body;
    if (!workoutPlanId || !exerciseId || !sets || !reps || !orderNumber) {
      return res.status(400).json({ message: 'All fields except weight are required' });
    }
    const newExercise = await WorkoutExercise.create(workoutPlanId, exerciseId, sets, reps, weight, orderNumber);
    res.status(201).json(newExercise);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create workout exercise' });
  }
});

//валідація при оновленні вправи у плані
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { sets, reps, weight, orderNumber } = req.body;
    if (!sets || !reps || !orderNumber) {
      return res.status(400).json({ message: 'Sets, reps, and order number are required' });
    }
    const { id } = req.params;
    const updatedExercise = await WorkoutExercise.update(id, sets, reps, weight, orderNumber);
    res.json(updatedExercise);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update workout exercise' });
  }
});*/


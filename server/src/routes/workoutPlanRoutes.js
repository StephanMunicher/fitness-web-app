const express = require('express');
const WorkoutPlan = require('../models/WorkoutPlan');
const WorkoutExercise = require('../models/WorkoutExercise');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Отримати всі плани користувача з сортуванням та фільтрацією
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      sortBy = 'name',
      sortOrder = 'ASC',
      name,
      description
    } = req.query;

    const filters = {};
    if (name) filters.name = name;
    if (description) filters.description = description;

    const plans = await WorkoutPlan.getAll(userId, sortBy, sortOrder, filters);
    res.json(plans);
  } catch (error) {
    console.error('Error getting workout plans:', error);
    res.status(500).json({ 
      message: 'Failed to get workout plans',
      error: error.message 
    });
  }
});

// Створити план
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, exercises } = req.body;

    // Валідація
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    // Створюємо план
    const newPlan = await WorkoutPlan.create(userId, name, description);

    // Якщо є вправи, додаємо їх до плану
    if (exercises && exercises.length > 0) {
      for (let i = 0; i < exercises.length; i++) {
        const exercise = exercises[i];
        await WorkoutExercise.create(
          newPlan.id,
          exercise.exerciseId,
          exercise.sets,
          exercise.reps,
          exercise.weight,
          i + 1 // orderNumber
        );
      }
    }

    // Отримуємо оновлений план з вправами
    const planWithExercises = await WorkoutPlan.getById(newPlan.id);
    res.status(201).json(planWithExercises);
  } catch (error) {
    console.error('Error creating workout plan:', error);
    if (error.message === 'Workout plan with this name already exists') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ 
      message: 'Failed to create workout plan',
      error: error.message 
    });
  }
});

// Отримати план по id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await WorkoutPlan.getById(id);
    res.json(plan);
  } catch (error) {
    console.error('Error getting workout plan:', error);
    if (error.message === 'Workout plan not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ 
      message: 'Failed to get workout plan',
      error: error.message 
    });
  }
});

// Оновити план
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Валідація
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const updatedPlan = await WorkoutPlan.update(id, name, description);
    res.json(updatedPlan);
  } catch (error) {
    console.error('Error updating workout plan:', error);
    if (error.message === 'Workout plan not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ 
      message: 'Failed to update workout plan',
      error: error.message 
    });
  }
});

// Видалити план
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await WorkoutPlan.delete(id);
    res.json({ message: 'Workout plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout plan:', error);
    if (error.message === 'Workout plan not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ 
      message: 'Failed to delete workout plan',
      error: error.message 
    });
  }
});

// Отримати вправи плану
router.get('/:planId/exercises', authMiddleware, async (req, res) => {
  try {
    const { planId } = req.params;
    const exercises = await WorkoutExercise.getAll(planId);
    res.json(exercises);
  } catch (error) {
    console.error('Error getting plan exercises:', error);
    res.status(500).json({ 
      message: 'Failed to get plan exercises',
      error: error.message 
    });
  }
});

// Додати вправу до плану
router.post('/:planId/exercises', authMiddleware, async (req, res) => {
  try {
    const { planId } = req.params;
    const { exerciseId, sets, reps, weight } = req.body;

    // Валідація
    if (!exerciseId) {
      return res.status(400).json({ message: 'Exercise ID is required' });
    }

    // Отримуємо всі вправи для визначення порядкового номера
    const allExercises = await WorkoutExercise.getAll(planId);
    const orderNumber = allExercises.length + 1;

    const newExercise = await WorkoutExercise.create(
      planId,
      exerciseId,
      sets || 3,
      reps || 12,
      weight || 0,
      orderNumber
    );

    res.status(201).json(newExercise);
  } catch (error) {
    console.error('Error adding exercise to plan:', error);
    res.status(500).json({ 
      message: 'Failed to add exercise to plan',
      error: error.message 
    });
  }
});

// Оновити вправу в плані
router.put('/:planId/exercises/:exerciseId', authMiddleware, async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const { sets, reps, weight, orderNumber } = req.body;

    const updatedExercise = await WorkoutExercise.update(
      exerciseId,
      sets,
      reps,
      weight,
      orderNumber
    );

    res.json(updatedExercise);
  } catch (error) {
    console.error('Error updating plan exercise:', error);
    res.status(500).json({ 
      message: 'Failed to update plan exercise',
      error: error.message 
    });
  }
});

// Видалити вправу з плану
router.delete('/:planId/exercises/:exerciseId', authMiddleware, async (req, res) => {
  try {
    const { exerciseId } = req.params;
    await WorkoutExercise.delete(exerciseId);
    res.json({ message: 'Exercise removed from plan successfully' });
  } catch (error) {
    console.error('Error removing exercise from plan:', error);
    res.status(500).json({ 
      message: 'Failed to remove exercise from plan',
      error: error.message 
    });
  }
});

module.exports = router;

//const WorkoutExercise = require('../models/WorkoutExercise');
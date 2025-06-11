const express = require('express');
const Exercise = require('../models/Exercise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Створюємо папку для завантажень, якщо її немає
const uploadDir = path.join(__dirname, '../../uploads/exercises');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Налаштування multer для завантаження зображень
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/exercises/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'exercise-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Отримання списку вправ з сортуванням та фільтрацією
router.get('/', async (req, res) => {
  try {
    const { 
      sortBy = 'name',
      sortOrder = 'ASC',
      name,
      category,
      difficultyLevel
    } = req.query;

    const filters = {};
    if (name) filters.name = name;
    if (category) filters.category = category;
    if (difficultyLevel) filters.difficultyLevel = difficultyLevel;

    const exercises = await Exercise.getAll(sortBy, sortOrder, filters);
    res.json(exercises);
  } catch (error) {
    console.error('Error getting exercises:', error);
    res.status(500).json({ 
      message: 'Failed to get exercises',
      error: error.message 
    });
  }
});

// Створення вправи з можливістю завантаження зображення
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, difficultyLevel, targetMuscles } = req.body;
    
    // Валідація
    if (!name || !description || !category || !difficultyLevel || !targetMuscles) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Перетворення targetMuscles в масив
    const targetMusclesArray = Array.isArray(targetMuscles) 
      ? targetMuscles 
      : targetMuscles.split(',').map(muscle => muscle.trim());

    // Отримуємо URL зображення, якщо воно було завантажено
    const imageUrl = req.file ? `/uploads/exercises/${req.file.filename}` : null;

    const newExercise = await Exercise.create(
      name, 
      description, 
      category, 
      difficultyLevel, 
      targetMusclesArray,
      imageUrl
    );
    
    res.status(201).json(newExercise);
  } catch (error) {
    console.error('Error creating exercise:', error);
    if (error.message === 'Exercise with this name already exists') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ 
      message: 'Failed to create exercise',
      error: error.message 
    });
  }
});

// Оновлення вправи з можливістю оновлення зображення
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, difficultyLevel, targetMuscles } = req.body;
    
    // Валідація
    if (!name || !description || !category || !difficultyLevel || !targetMuscles) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Перетворення targetMuscles в масив
    const targetMusclesArray = Array.isArray(targetMuscles) 
      ? targetMuscles 
      : targetMuscles.split(',').map(muscle => muscle.trim());

    // Отримуємо URL зображення, якщо воно було завантажено
    const imageUrl = req.file ? `/uploads/exercises/${req.file.filename}` : null;

    const updatedExercise = await Exercise.update(
      id, 
      name, 
      description, 
      category, 
      difficultyLevel, 
      targetMusclesArray,
      imageUrl
    );
    
    res.json(updatedExercise);
  } catch (error) {
    console.error('Error updating exercise:', error);
    if (error.message === 'Exercise not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ 
      message: 'Failed to update exercise',
      error: error.message 
    });
  }
});

// Оновлення тільки зображення вправи
router.put('/:id/image', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const imageUrl = `/uploads/exercises/${req.file.filename}`;
    const updatedExercise = await Exercise.updateImage(id, imageUrl);
    
    res.json(updatedExercise);
  } catch (error) {
    console.error('Error updating exercise image:', error);
    if (error.message === 'Exercise not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ 
      message: 'Failed to update exercise image',
      error: error.message 
    });
  }
});

// Видалення вправи
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Отримуємо інформацію про вправу перед видаленням
    const exercise = await Exercise.findById(id);
    
    if (exercise && exercise.imageUrl) {
      // Видаляємо файл зображення
      const imagePath = path.join(__dirname, '../../', exercise.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Exercise.delete(id);
    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Error deleting exercise:', error);
    if (error.message === 'Exercise not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ 
      message: 'Failed to delete exercise',
      error: error.message 
    });
  }
});

// Додаємо статичний роут для доступу до зображень
router.use('/uploads', express.static('uploads'));

module.exports = router;


/*// Перевірка, що всі обов’язкові поля присутні
router.post('/', async (req, res) => {
  try {
    const { name, description, category, difficultyLevel, targetMuscles } = req.body;
    if (!name || !description || !category || !difficultyLevel || !targetMuscles) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newExercise = await Exercise.create(name, description, category, difficultyLevel, targetMuscles);
    res.status(201).json(newExercise);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create exercise' });
  }
}); */
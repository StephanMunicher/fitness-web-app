// server/src/models/WorkoutExercise.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class WorkoutExercise {
  constructor(id, workoutPlanId, exerciseId, sets, reps, weight, orderNumber) {
    this.id = id;
    this.workoutPlanId = workoutPlanId;
    this.exerciseId = exerciseId;
    this.sets = sets;
    this.reps = reps;
    this.weight = weight;
    this.orderNumber = orderNumber;
  }

  static async getAll(workoutPlanId) {
    try {
      // Перевірка існування плану
      const planCheck = await pool.query('SELECT * FROM workout_plans WHERE id = $1', [workoutPlanId]);
      if (planCheck.rows.length === 0) {
        throw new Error('Workout plan not found');
      }

      const query = 'SELECT * FROM workout_exercises WHERE workout_plan_id = $1 ORDER BY order_number';
      const { rows } = await pool.query(query, [workoutPlanId]);

      return rows.map(exercise => new WorkoutExercise(
        exercise.id,
        exercise.workout_plan_id,
        exercise.exercise_id,
        exercise.sets,
        exercise.reps,
        exercise.weight,
        exercise.order_number
      ));
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  }

  static async create(workoutPlanId, exerciseId, sets, reps, weight, orderNumber) {
    try {
      // Перевірка існування плану
      const planCheck = await pool.query('SELECT * FROM workout_plans WHERE id = $1', [workoutPlanId]);
      if (planCheck.rows.length === 0) {
        throw new Error('Workout plan not found');
      }

      // Перевірка існування вправи
      const exerciseCheck = await pool.query('SELECT * FROM exercises WHERE id = $1', [exerciseId]);
      if (exerciseCheck.rows.length === 0) {
        throw new Error('Exercise not found');
      }

      const query = `
        INSERT INTO workout_exercises (workout_plan_id, exercise_id, sets, reps, weight, order_number)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const { rows } = await pool.query(query, [workoutPlanId, exerciseId, sets, reps, weight, orderNumber]);

      const exercise = rows[0];
      return new WorkoutExercise(
        exercise.id,
        exercise.workout_plan_id,
        exercise.exercise_id,
        exercise.sets,
        exercise.reps,
        exercise.weight,
        exercise.order_number
      );
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  static async update(id, sets, reps, weight, orderNumber) {
    try {
      // Перевірка існування запису
      const checkQuery = 'SELECT * FROM workout_exercises WHERE id = $1';
      const checkResult = await pool.query(checkQuery, [id]);
      
      if (checkResult.rows.length === 0) {
        throw new Error('Workout exercise not found');
      }

      const query = `
        UPDATE workout_exercises
        SET sets = $2, reps = $3, weight = $4, order_number = $5
        WHERE id = $1
        RETURNING *
      `;
      const { rows } = await pool.query(query, [id, sets, reps, weight, orderNumber]);

      const exercise = rows[0];
      return new WorkoutExercise(
        exercise.id,
        exercise.workout_plan_id,
        exercise.exercise_id,
        exercise.sets,
        exercise.reps,
        exercise.weight,
        exercise.order_number
      );
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Перевірка існування запису
      const checkQuery = 'SELECT * FROM workout_exercises WHERE id = $1';
      const checkResult = await pool.query(checkQuery, [id]);
      
      if (checkResult.rows.length === 0) {
        throw new Error('Workout exercise not found');
      }

      const query = 'DELETE FROM workout_exercises WHERE id = $1';
      await pool.query(query, [id]);
      return { success: true };
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }
}

module.exports = WorkoutExercise;
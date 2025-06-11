// server/src/models/WorkoutPlan.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class WorkoutPlan {
  constructor(id, userId, name, description, createdAt, updatedAt) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async getAll(userId, sortBy = 'name', sortOrder = 'ASC', filters = {}) {
    try {
      let query = 'SELECT * FROM workout_plans WHERE user_id = $1';
      const values = [userId];
      let paramCount = 2;

      // Додаємо фільтри
      if (filters.name) {
        query += ` AND name ILIKE $${paramCount}`;
        values.push(`%${filters.name}%`);
        paramCount++;
      }

      if (filters.description) {
        query += ` AND description ILIKE $${paramCount}`;
        values.push(`%${filters.description}%`);
        paramCount++;
      }

      // Додаємо сортування
      const allowedSortFields = ['name', 'created_at', 'updated_at'];
      const allowedSortOrders = ['ASC', 'DESC'];
      
      const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'name';
      const finalSortOrder = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

      query += ` ORDER BY ${finalSortBy} ${finalSortOrder}`;

      const { rows } = await pool.query(query, values);
      
      return rows.map(plan => new WorkoutPlan(
        plan.id,
        plan.user_id,
        plan.name,
        plan.description,
        plan.created_at,
        plan.updated_at
      ));
    } catch (error) {
      console.error('Error in getAll:', error);
      throw new Error('Failed to fetch workout plans');
    }
  }

  static async create(userId, name, description) {
    try {
      // Перевірка на існування плану з таким ім'ям для цього користувача
      const checkQuery = 'SELECT * FROM workout_plans WHERE user_id = $1 AND name = $2';
      const checkResult = await pool.query(checkQuery, [userId, name]);
      
      if (checkResult.rows.length > 0) {
        throw new Error('Workout plan with this name already exists');
      }

      const query = `
        INSERT INTO workout_plans (user_id, name, description)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      
      const { rows } = await pool.query(query, [userId, name, description]);
      const plan = rows[0];
      
      return new WorkoutPlan(
        plan.id,
        plan.user_id,
        plan.name,
        plan.description,
        plan.created_at,
        plan.updated_at
      );
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const query = 'SELECT * FROM workout_plans WHERE id = $1';
      const { rows } = await pool.query(query, [id]);

      if (rows.length === 0) {
        throw new Error('Workout plan not found');
      }

      const plan = rows[0];
      return new WorkoutPlan(
        plan.id,
        plan.user_id,
        plan.name,
        plan.description,
        plan.created_at,
        plan.updated_at
      );
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  }

  static async update(id, name, description) {
    try {
      // Перевірка існування плану
      const checkQuery = 'SELECT * FROM workout_plans WHERE id = $1';
      const checkResult = await pool.query(checkQuery, [id]);
      
      if (checkResult.rows.length === 0) {
        throw new Error('Workout plan not found');
      }

      const query = `
        UPDATE workout_plans
        SET name = $2, description = $3
        WHERE id = $1
        RETURNING *
      `;
      
      const { rows } = await pool.query(query, [id, name, description]);
      const plan = rows[0];
      
      return new WorkoutPlan(
        plan.id,
        plan.user_id,
        plan.name,
        plan.description,
        plan.created_at,
        plan.updated_at
      );
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Перевірка існування плану
      const checkQuery = 'SELECT * FROM workout_plans WHERE id = $1';
      const checkResult = await pool.query(checkQuery, [id]);
      
      if (checkResult.rows.length === 0) {
        throw new Error('Workout plan not found');
      }

      // Спочатку видаляємо всі пов'язані вправи
      await pool.query('DELETE FROM workout_exercises WHERE workout_plan_id = $1', [id]);
      
      // Потім видаляємо сам план
      const query = 'DELETE FROM workout_plans WHERE id = $1';
      await pool.query(query, [id]);
      return { success: true };
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }
}

module.exports = WorkoutPlan;
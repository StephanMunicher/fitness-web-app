const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class Exercise {
  constructor(id, name, description, category, difficultyLevel, targetMuscles, imageUrl, createdAt, updatedAt) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.difficultyLevel = difficultyLevel;
    this.targetMuscles = targetMuscles;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async findById(id) {
    try {
      const query = 'SELECT * FROM exercises WHERE id = $1';
      const { rows } = await pool.query(query, [id]);
      
      if (rows.length === 0) {
        throw new Error('Exercise not found');
      }
      
      const exercise = rows[0];
      return new Exercise(
        exercise.id,
        exercise.name,
        exercise.description,
        exercise.category,
        exercise.difficulty_level,
        exercise.target_muscles,
        exercise.image_url,
        exercise.created_at,
        exercise.updated_at
      );
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  static async getAll(sortBy = 'name', sortOrder = 'ASC', filters = {}) {
    try {
      let query = 'SELECT * FROM exercises WHERE 1=1';
      const values = [];
      let paramCount = 1;

      if (filters.name) {
        query += ` AND name ILIKE $${paramCount}`;
        values.push(`%${filters.name}%`);
        paramCount++;
      }

      if (filters.category) {
        query += ` AND category = $${paramCount}`;
        values.push(filters.category);
        paramCount++;
      }

      if (filters.difficultyLevel) {
        query += ` AND difficulty_level = $${paramCount}`;
        values.push(filters.difficultyLevel);
        paramCount++;
      }

      const allowedSortFields = ['name', 'category', 'difficulty_level', 'created_at'];
      const allowedSortOrders = ['ASC', 'DESC'];
      
      const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'name';
      const finalSortOrder = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

      query += ` ORDER BY ${finalSortBy} ${finalSortOrder}`;

      const { rows } = await pool.query(query, values);
      
      return rows.map(exercise => new Exercise(
        exercise.id,
        exercise.name,
        exercise.description,
        exercise.category,
        exercise.difficulty_level,
        exercise.target_muscles,
        exercise.image_url,
        exercise.created_at,
        exercise.updated_at
      ));
    } catch (error) {
      console.error('Error in getAll:', error);
      throw new Error('Failed to fetch exercises');
    }
  }

  static async create(name, description, category, difficultyLevel, targetMuscles, imageUrl = null) {
    try {
      const checkQuery = 'SELECT * FROM exercises WHERE name = $1';
      const checkResult = await pool.query(checkQuery, [name]);
      
      if (checkResult.rows.length > 0) {
        throw new Error('Exercise with this name already exists');
      }

      const query = `
        INSERT INTO exercises (name, description, category, difficulty_level, target_muscles, image_url)
        VALUES ($1, $2, $3, $4, $5::text[], $6)
        RETURNING *
      `;
      
      const { rows } = await pool.query(query, [
        name, 
        description, 
        category, 
        difficultyLevel, 
        Array.isArray(targetMuscles) ? targetMuscles : [targetMuscles],
        imageUrl
      ]);
      
      const exercise = rows[0];
      return new Exercise(
        exercise.id,
        exercise.name,
        exercise.description,
        exercise.category,
        exercise.difficulty_level,
        exercise.target_muscles,
        exercise.image_url,
        exercise.created_at,
        exercise.updated_at
      );
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  static async update(id, name, description, category, difficultyLevel, targetMuscles, imageUrl = null) {
    try {
      const checkQuery = 'SELECT * FROM exercises WHERE id = $1';
      const checkResult = await pool.query(checkQuery, [id]);
      
      if (checkResult.rows.length === 0) {
        throw new Error('Exercise not found');
      }

      const query = `
        UPDATE exercises
        SET name = $2, 
            description = $3, 
            category = $4, 
            difficulty_level = $5, 
            target_muscles = $6::text[], 
            image_url = COALESCE($7, image_url)
        WHERE id = $1
        RETURNING *
      `;
      
      const { rows } = await pool.query(query, [
        id, 
        name, 
        description, 
        category, 
        difficultyLevel, 
        Array.isArray(targetMuscles) ? targetMuscles : [targetMuscles],
        imageUrl
      ]);
      
      const exercise = rows[0];
      return new Exercise(
        exercise.id,
        exercise.name,
        exercise.description,
        exercise.category,
        exercise.difficulty_level,
        exercise.target_muscles,
        exercise.image_url,
        exercise.created_at,
        exercise.updated_at
      );
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  static async updateImage(id, imageUrl) {
    try {
      const query = `
        UPDATE exercises
        SET image_url = $2
        WHERE id = $1
        RETURNING *
      `;
      const { rows } = await pool.query(query, [id, imageUrl]);
      
      if (rows.length === 0) {
        throw new Error('Exercise not found');
      }
      
      const exercise = rows[0];
      return new Exercise(
        exercise.id,
        exercise.name,
        exercise.description,
        exercise.category,
        exercise.difficulty_level,
        exercise.target_muscles,
        exercise.image_url,
        exercise.created_at,
        exercise.updated_at
      );
    } catch (error) {
      console.error('Error in updateImage:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const exercise = await this.findById(id);
      
      const query = 'DELETE FROM exercises WHERE id = $1';
      await pool.query(query, [id]);
      
      return { success: true, deletedExercise: exercise };
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }
}

module.exports = Exercise;
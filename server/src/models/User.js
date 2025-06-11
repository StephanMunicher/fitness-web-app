const { Pool } = require('pg');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class User {
  constructor(id, email, passwordHash, username, createdAt, updatedAt, goal, weightHistory) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.username = username;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.goal = goal;
    this.weightHistory = weightHistory;
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];
    return new User(
      user.id,
      user.email,
      user.password_hash,
      user.username,
      user.created_at,
      user.updated_at,
      user.goal,
      user.weight_history
    );
  }

  static async create(email, passwordHash, username) {
    const query = `
      INSERT INTO users (email, password_hash, username)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [email, passwordHash, username]);

    const user = rows[0];
    return new User(
      user.id,
      user.email,
      user.password_hash,
      user.username,
      user.created_at,
      user.updated_at,
      user.goal,
      user.weight_history
    );
  }

  // Отримати користувача за ID
  static async getById(id) {
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await pool.query(query, [id]);

      if (rows.length === 0) {
        return null;
      }

      const user = rows[0];
      return new User(
        user.id,
        user.email,
        user.password_hash,
        user.username,
        user.created_at,
        user.updated_at,
        user.goal,
        user.weight_history
      );
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  }

  // Оновити мету тренувань
  static async updateGoal(userId, goal) {
    try {
      const query = `
        UPDATE users 
        SET goal = $2, 
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *
      `;
      const { rows } = await pool.query(query, [userId, goal]);

      if (rows.length === 0) {
        throw new Error('User not found');
      }

      const user = rows[0];
      return new User(
        user.id,
        user.email,
        user.password_hash,
        user.username,
        user.created_at,
        user.updated_at,
        user.goal,
        user.weight_history
      );
    } catch (error) {
      console.error('Error in updateGoal:', error);
      throw error;
    }
  }

  // Додати нову вагу
  static async addWeight(userId, weight) {
    try {
      // Отримуємо поточну історію ваги
      const selectQuery = 'SELECT weight_history FROM users WHERE id = $1';
      const { rows } = await pool.query(selectQuery, [userId]);

      if (rows.length === 0) {
        throw new Error('User not found');
      }

      // Створюємо новий запис ваги
      const newWeightEntry = {
        date: new Date().toISOString().slice(0, 10),
        weight: Number(weight)
      };

      // Перевіряємо, чи поточна історія є масивом, і парсимо якщо треба
      let currentHistory = rows[0].weight_history;
      if (!Array.isArray(currentHistory)) {
        try {
          if (typeof currentHistory === 'string') {
            currentHistory = JSON.parse(currentHistory);
          } else if (currentHistory === null || currentHistory === undefined) {
            currentHistory = [];
          }
        } catch (e) {
          currentHistory = [];
        }
      }

      const updatedHistory = [...currentHistory, newWeightEntry];

      // Оновлюємо запис у базі даних, явно приводячи до JSONB
      const updateQuery = `
        UPDATE users 
        SET weight_history = $2::jsonb, 
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *
      `;
      const result = await pool.query(updateQuery, [userId, JSON.stringify(updatedHistory)]);

      const user = result.rows[0];
      return new User(
        user.id,
        user.email,
        user.password_hash,
        user.username,
        user.created_at,
        user.updated_at,
        user.goal,
        user.weight_history
      );
    } catch (error) {
      console.error('Error in addWeight:', error);
      throw error;
    }
  }

  // Змінити пароль
  static async changePassword(userId, oldPassword, newPassword) {
    try {
      // Перевіряємо старий пароль
      const selectQuery = 'SELECT password_hash FROM users WHERE id = $1';
      const { rows } = await pool.query(selectQuery, [userId]);

      if (rows.length === 0) {
        return { success: false, message: 'User not found' };
      }

      const isMatch = await bcrypt.compare(oldPassword, rows[0].password_hash);
      if (!isMatch) {
        return { success: false, message: 'Old password is incorrect' };
      }

      // Хешуємо новий пароль
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // Оновлюємо пароль
      const updateQuery = `
        UPDATE users 
        SET password_hash = $2, 
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1
      `;
      await pool.query(updateQuery, [userId, newPasswordHash]);

      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error in changePassword:', error);
      throw error;
    }
  }
}

module.exports = User;
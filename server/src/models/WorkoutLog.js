const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class WorkoutLog {
  constructor(id, userId, workoutPlanId, completedAt, notes, createdAt, updatedAt) {
    this.id = id;
    this.userId = userId;
    this.workoutPlanId = workoutPlanId;
    this.completedAt = completedAt;
    this.notes = notes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Створити новий запис про виконане тренування
  static async create(userId, workoutPlanId, notes = null) {
    const query = `
      INSERT INTO workout_logs (user_id, workout_plan_id, notes)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [userId, workoutPlanId, notes]);
    
    const log = rows[0];
    return new WorkoutLog(
      log.id,
      log.user_id,
      log.workout_plan_id,
      log.completed_at,
      log.notes,
      log.created_at,
      log.updated_at
    );
  }

  // Отримати всі записи користувача
  static async findByUserId(userId) {
    const query = `
      SELECT wl.*, wp.name as plan_name 
      FROM workout_logs wl
      JOIN workout_plans wp ON wp.id = wl.workout_plan_id
      WHERE wl.user_id = $1
      ORDER BY wl.completed_at DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    
    return rows.map(log => new WorkoutLog(
      log.id,
      log.user_id,
      log.workout_plan_id,
      log.completed_at,
      log.notes,
      log.created_at,
      log.updated_at
    ));
  }

  // Отримати статистику за період
  static async getStatsByPeriod(userId, period) {
    let dateCondition;
    
    switch(period) {
      case 'week':
        dateCondition = "completed_at >= NOW() - INTERVAL '7 days'";
        break;
      case 'month':
        dateCondition = "completed_at >= NOW() - INTERVAL '30 days'";
        break;
      default:
        dateCondition = "TRUE";
    }

    const query = `
      SELECT 
        DATE(completed_at) as date,
        COUNT(*) as count
      FROM workout_logs
      WHERE user_id = $1 AND ${dateCondition}
      GROUP BY DATE(completed_at)
      ORDER BY date DESC
    `;

    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  // Отримати загальну статистику
  static async getTotalStats(userId) {
    const query = `
      SELECT 
        COUNT(*) as total_workouts,
        COUNT(DISTINCT workout_plan_id) as unique_plans,
        MAX(completed_at) as last_workout
      FROM workout_logs
      WHERE user_id = $1
    `;

    const { rows } = await pool.query(query, [userId]);
    return rows[0];
  }
}

module.exports = WorkoutLog;
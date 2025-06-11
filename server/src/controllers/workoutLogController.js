const WorkoutLog = require('../models/WorkoutLog');

exports.logWorkout = async (req, res) => {
  try {
    const { workoutPlanId, notes } = req.body;
    const userId = req.user.id; // ID користувача з JWT токена

    const log = await WorkoutLog.create(userId, workoutPlanId, notes);
    
    res.status(201).json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error('Error logging workout:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log workout'
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period } = req.query; // 'week' або 'month'

    const stats = await WorkoutLog.getStatsByPeriod(userId, period);
    const totalStats = await WorkoutLog.getTotalStats(userId);
    
    res.json({
      success: true,
      data: {
        periodStats: stats,
        totalStats
      }
    });
  } catch (error) {
    console.error('Error getting workout stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get workout statistics'
    });
  }
};

exports.getUserLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const logs = await WorkoutLog.findByUserId(userId);
    
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Error getting user logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get workout logs'
    });
  }
};
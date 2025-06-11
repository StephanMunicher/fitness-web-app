import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import WorkoutPlanList from '../components/WorkoutPlanList';

const WorkoutPlansPage = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchWorkoutPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/plans');
      setWorkoutPlans(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to load workout plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout plan?')) return;
    try {
      await api.delete(`/plans/${id}`);
      setSuccess('Workout plan deleted successfully!');
      fetchWorkoutPlans();
      setTimeout(() => setSuccess(null), 2000);
    } catch (error) {
      setError('Error deleting workout plan. Please try again.');
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">
              <i className="bi bi-list-check me-2 text-primary"></i>
              Workout Plans
            </h2>
            <Link to="/workout-plans/new" className="btn btn-primary">
              <i className="bi bi-plus-lg me-2"></i>
              Create New Workout Plan
            </Link>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}

          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
            </div>
          )}

          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : workoutPlans.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-0">No workout plans found. Create your first plan!</p>
            </div>
          ) : (
            <WorkoutPlanList
              workoutPlans={workoutPlans}
              onDeletePlan={handleDeletePlan}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlansPage;
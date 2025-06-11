import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AddExerciseToPlan from './AddExerciseToPlan';
import EditWorkoutExercise from './EditWorkoutExercise';
import './WorkoutPlanDetails.css';

const WorkoutPlanDetails = ({ workoutPlanId }) => {
  const [exercises, setExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [editingExercise, setEditingExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchAllExercises = async () => {
      try {
        const response = await api.get('/exercises');
        setAllExercises(response.data);
      } catch (error) {
        console.error(error);
        setMessage({ text: 'Failed to load exercises', type: 'danger' });
      }
    };
    fetchAllExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await api.get(`/workout-exercises/${workoutPlanId}`);
      setExercises(response.data);
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Failed to load workout exercises', type: 'danger' });
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [workoutPlanId]);

  const handleExerciseAdded = () => {
    fetchExercises();
    setShowAddForm(false);
    setMessage({ text: 'Exercise added successfully!', type: 'success' });
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
  };

  const handleCancelEdit = () => {
    setEditingExercise(null);
  };

  const handleExerciseUpdated = () => {
    fetchExercises();
    setEditingExercise(null);
    setMessage({ text: 'Exercise updated successfully!', type: 'success' });
  };

  const handleDeleteExercise = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) return;
    
    try {
      await api.delete(`/workout-exercises/${id}`);
      fetchExercises();
      setMessage({ text: 'Exercise deleted successfully!', type: 'success' });
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Failed to delete exercise', type: 'danger' });
    }
  };

  const handleMarkAsCompleted = async () => {
    setLoading(true);
    try {
      await api.post('/workout-logs', {
        workoutPlanId,
        notes: 'Workout completed!'
      });
      setMessage({ text: 'Workout marked as completed! 💪', type: 'success' });
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Failed to mark workout as completed', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const getExerciseName = (exerciseId) => {
    const exercise = allExercises.find((ex) => ex.id === exerciseId);
    return exercise ? exercise.name : `Exercise #${exerciseId}`;
  };

  return (
    <div className="workout-plan-details">
      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show mb-4`} role="alert">
          <i className={`bi bi-${message.type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ text: '', type: '' })}></button>
        </div>
      )}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="card-title mb-0">
              <i className="bi bi-list-check text-primary me-2"></i>
              Exercises in this plan
            </h3>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Add Exercise
              </button>
              <button 
                className="btn btn-success"
                onClick={handleMarkAsCompleted}
                disabled={loading || exercises.length === 0}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Marking...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle me-2"></i>
                    Complete Workout
                  </>
                )}
              </button>
            </div>
          </div>

          {exercises.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-activity text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-3 mb-0">No exercises in this plan yet. Add your first exercise!</p>
            </div>
          ) : (
            <div className="exercise-list">
              {exercises.map((exercise, index) => (
                <div key={exercise.id} className="exercise-item card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <span className="exercise-number">{index + 1}</span>
                        <h5 className="exercise-name">{getExerciseName(exercise.exerciseId)}</h5>
                        <div className="exercise-details">
                          <span className="badge bg-primary me-2">
                            <i className="bi bi-repeat me-1"></i>
                            {exercise.sets} sets
                          </span>
                          <span className="badge bg-info me-2">
                            <i className="bi bi-arrow-repeat me-1"></i>
                            {exercise.reps} reps
                          </span>
                          <span className="badge bg-secondary">
                            <i className="bi bi-weight me-1"></i>
                            {exercise.weight}kg
                          </span>
                        </div>
                      </div>
                      <div className="exercise-actions">
                        <button 
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => handleEditExercise(exercise)}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Edit
                        </button>
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteExercise(exercise.id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="card-title mb-0">
                <i className="bi bi-plus-circle text-primary me-2"></i>
                Add New Exercise
              </h5>
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setShowAddForm(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <AddExerciseToPlan workoutPlanId={workoutPlanId} onExerciseAdded={handleExerciseAdded} />
          </div>
        </div>
      )}

      {editingExercise && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square text-primary me-2"></i>
                  Edit Exercise
                </h5>
                <button type="button" className="btn-close" onClick={handleCancelEdit}></button>
              </div>
              <div className="modal-body">
                <EditWorkoutExercise
                  exercise={editingExercise}
                  onExerciseUpdated={handleExerciseUpdated}
                  onCancel={handleCancelEdit}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanDetails;
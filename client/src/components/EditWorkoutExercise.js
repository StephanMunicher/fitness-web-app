import React, { useState } from 'react';
import api from '../services/api';
import './EditWorkoutExercise.css';

const EditWorkoutExercise = ({ exercise, onExerciseUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    sets: exercise.sets,
    reps: exercise.reps,
    weight: exercise.weight,
    orderNumber: exercise.orderNumber,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.put(`/workout-exercises/${exercise.id}`, formData);
      onExerciseUpdated();
      onCancel();
    } catch (error) {
      console.error(error);
      setError('Failed to update exercise. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-workout-exercise">
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-4">
            <i className="bi bi-pencil-square text-primary me-2"></i>
            Edit Exercise
          </h4>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="sets" className="form-label">
                  Sets <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-repeat"></i>
                  </span>
                  <input
                    type="number"
                    className="form-control"
                    id="sets"
                    value={formData.sets}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="reps" className="form-label">
                  Reps <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-arrow-repeat"></i>
                  </span>
                  <input
                    type="number"
                    className="form-control"
                    id="reps"
                    value={formData.reps}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="weight" className="form-label">
                  Weight (kg)
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-weight"></i>
                  </span>
                  <input
                    type="number"
                    className="form-control"
                    id="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                  />
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="orderNumber" className="form-label">
                  Order Number <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-sort-numeric-down"></i>
                  </span>
                  <input
                    type="number"
                    className="form-control"
                    id="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Update Exercise
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditWorkoutExercise;
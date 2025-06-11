import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import EditExercise from '../components/EditExercise';
import ExerciseList from '../components/ExerciseList';

const ExercisePage = () => {
  const [exercises, setExercises] = useState([]);
  const [editingExercise, setEditingExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await api.get('/exercises');
      setExercises(response.data);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Failed to load exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleDeleteExercise = async (id) => {
    try {
      await api.delete(`/exercises/${id}`);
      setExercises(exercises.filter(exercise => exercise.id !== id));
    } catch (error) {
      console.error(error);
      setError('Failed to delete exercise. Please try again.');
    }
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setEditingExercise(null);
    setShowModal(false);
  };

  const handleExerciseUpdated = () => {
    fetchExercises();
    setEditingExercise(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="card-title mb-0">Exercises</h2>
            <Link to="/exercises/new" className="btn btn-primary">
              <i className="bi bi-plus-lg me-2"></i>
              Create New Exercise
            </Link>
          </div>
          
          {exercises.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-0">No exercises found. Create your first exercise!</p>
            </div>
          ) : (
            <ExerciseList
              exercises={exercises}
              onDeleteExercise={handleDeleteExercise}
              onEditExercise={handleEditExercise}
            />
          )}
        </div>
      </div>

      {/* Модальне вікно для редагування */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Exercise</h5>
                <button type="button" className="btn-close" onClick={handleCancelEdit}></button>
              </div>
              <div className="modal-body">
                <EditExercise
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

export default ExercisePage;
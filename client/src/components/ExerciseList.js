import React from 'react';
import './ExerciseList.css'; // Створимо окремий файл для стилів

const ExerciseList = ({ exercises, onDeleteExercise, onEditExercise }) => {
  return (
    <div className="row">
      {exercises.map((exercise) => (
        <div key={exercise.id} className="col-md-4 mb-4">
          <div className="card exercise-card h-100 shadow-sm">
            {exercise.imageUrl ? (
              <div className="card-img-wrapper">
                <img
                  src={`http://localhost:5000${exercise.imageUrl}`}
                  className="card-img-top"
                  alt={exercise.name}
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="card-img-placeholder">
                <i className="bi bi-image text-muted"></i>
                <span className="text-muted">No Image</span>
              </div>
            )}
            <div className="card-body d-flex flex-column">
              <h5 className="card-title text-primary mb-3">{exercise.name}</h5>
              <p className="card-text text-muted mb-3">{exercise.description}</p>
              
              <div className="exercise-details mb-3">
                <div className="detail-item">
                  <i className="bi bi-tag-fill me-2"></i>
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{exercise.category}</span>
                </div>
                
                <div className="detail-item">
                  <i className="bi bi-lightning-fill me-2"></i>
                  <span className="detail-label">Difficulty:</span>
                  <span className={`detail-value difficulty-${exercise.difficultyLevel.toLowerCase()}`}>
                    {exercise.difficultyLevel}
                  </span>
                </div>
                
                <div className="detail-item">
                  <i className="bi bi-bullseye me-2"></i>
                  <span className="detail-label">Muscles:</span>
                  <span className="detail-value">{exercise.targetMuscles}</span>
                </div>
              </div>

              <div className="card-actions mt-auto">
                <button
                  className="btn btn-outline-danger me-2 btn-action"
                  onClick={() => onDeleteExercise(exercise.id)}
                >
                  <i className="bi bi-trash me-1"></i>
                  Delete
                </button>
                <button
                  className="btn btn-outline-primary btn-action"
                  onClick={() => onEditExercise(exercise)}
                >
                  <i className="bi bi-pencil me-1"></i>
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExerciseList;
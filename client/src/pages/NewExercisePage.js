import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateExercise from '../components/CreateExercise';

const NewExercisePage = () => {
  const navigate = useNavigate();

  const handleExerciseCreated = () => {
    // Після успішного створення вправи перенаправляємо на сторінку списку вправ
    navigate('/exercises');
  };

  return (
    <div>
      <div style={{ padding: '20px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Create New Exercise</h2>
          <button 
            onClick={() => navigate('/exercises')} 
            className="btn btn-secondary"
          >
            Back to Exercises
          </button>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <CreateExercise onExerciseCreated={handleExerciseCreated} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewExercisePage;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Logout from '../components/Logout';
import CreateWorkoutPlan from '../components/CreateWorkoutPlan';

const NewWorkoutPlanPage = () => {
  const navigate = useNavigate();

  const handlePlanCreated = () => {
    // Після успішного створення плану перенаправляємо на сторінку списку планів
    navigate('/workout-plans');
  };

  return (
    <div>
      <div style={{ padding: '20px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Create New Workout Plan</h2>
          <button 
            onClick={() => navigate('/workout-plans')} 
            className="btn btn-secondary"
          >
            Back to Workout Plans
          </button>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <CreateWorkoutPlan onPlanCreated={handlePlanCreated} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewWorkoutPlanPage;
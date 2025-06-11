import React, { useState } from 'react';
import WorkoutPlanDetails from './WorkoutPlanDetails';
import './WorkoutPlanList.css';

const WorkoutPlanList = ({ workoutPlans, onDeletePlan }) => {
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const handlePlanClick = (planId) => {
    setSelectedPlanId(planId === selectedPlanId ? null : planId);
  };

  if (workoutPlans.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-clipboard-x text-muted" style={{ fontSize: '3rem' }}></i>
        <p className="text-muted mt-3 mb-0">No workout plans yet. Create your first plan!</p>
      </div>
    );
  }

  return (
    <div className="workout-plans-container">
      <div className="row">
        {workoutPlans.map((plan) => (
          <div key={plan.id} className="col-md-6 col-lg-4 mb-4">
            <div className={`card h-100 workout-plan-card ${selectedPlanId === plan.id ? 'selected' : ''}`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h4 
                    className="card-title mb-0"
                    onClick={() => handlePlanClick(plan.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="bi bi-calendar-check me-2 text-primary"></i>
                    {plan.name}
                  </h4>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePlan(plan.id);
                    }}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>

                <p className="card-text text-muted mb-3">{plan.description}</p>

                <div className="d-flex align-items-center">
                  <button
                    className={`btn ${selectedPlanId === plan.id ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                    onClick={() => handlePlanClick(plan.id)}
                  >
                    {selectedPlanId === plan.id ? (
                      <>
                        <i className="bi bi-eye-slash me-2"></i>
                        Hide Details
                      </>
                    ) : (
                      <>
                        <i className="bi bi-eye me-2"></i>
                        View Details
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPlanId && (
        <div className="selected-plan-details mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">
                <i className="bi bi-list-check me-2 text-primary"></i>
                Plan Details
              </h5>
              <WorkoutPlanDetails workoutPlanId={selectedPlanId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanList;
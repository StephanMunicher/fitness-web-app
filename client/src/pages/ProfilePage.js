import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goal, setGoal] = useState('');
  const [weight, setWeight] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(response.data);
        setGoal(response.data.goal || '');
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleGoalUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/user/me', 
        { goal },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setUser(response.data);
      showMessage('Goal updated successfully!', 'success');
    } catch (err) {
      showMessage('Failed to update goal', 'error');
      console.error('Error:', err);
    }
  };

  const handleWeightSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/user/me/weight',
        { weight: parseFloat(weight) },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setUser(response.data);
      setWeight('');
      showMessage('Weight added successfully!', 'success');
    } catch (err) {
      showMessage('Failed to add weight', 'error');
      console.error('Error:', err);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/user/me/password',
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setOldPassword('');
      setNewPassword('');
      showMessage('Password changed successfully!', 'success');
    } catch (err) {
      showMessage('Failed to change password', 'error');
      console.error('Error:', err);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return <div className="container mt-4">No user data available</div>;

  return (
    <div className="container py-4">
      <div className="profile-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">
            <i className="bi bi-person-circle text-primary me-2"></i>
            Profile
          </h2>
          <button 
            className="btn btn-outline-danger"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
          <i className={`bi bi-${message.type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="card-title">
                <i className="bi bi-person text-primary me-2"></i>
                Basic Information
              </h3>
              <div className="info-item">
                <i className="bi bi-person-badge me-2"></i>
                <strong>Username:</strong> {user.username}
              </div>
              <div className="info-item">
                <i className="bi bi-envelope me-2"></i>
                <strong>Email:</strong> {user.email}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="card-title">
                <i className="bi bi-trophy text-primary me-2"></i>
                Training Goal
              </h3>
              <form onSubmit={handleGoalUpdate}>
                <div className="mb-3">
                  <select 
                    className="form-select"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  >
                    <option value="">Select your goal</option>
                    <option value="gain">Gain Muscle Mass</option>
                    <option value="lose">Lose Weight</option>
                    <option value="maintain">Maintain Current Form</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-check2 me-2"></i>
                  Update Goal
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="card-title">
                <i className="bi bi-graph-up text-primary me-2"></i>
                Weight Tracking
              </h3>
              <form onSubmit={handleWeightSubmit}>
                <div className="mb-3">
                  <label className="form-label">Add New Weight (kg)</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      step="0.1"
                      min="0"
                      required
                    />
                    <span className="input-group-text">kg</span>
                  </div>
                </div>
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-plus-lg me-2"></i>
                  Add Weight
                </button>
              </form>

              {user.weight_history && user.weight_history.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-3">Weight History</h4>
                  <div className="weight-history">
                    {user.weight_history.map((entry, index) => (
                      <div key={index} className="weight-entry">
                        <span className="date">{new Date(entry.date).toLocaleDateString()}</span>
                        <span className="weight">{entry.weight} kg</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="card-title">
                <i className="bi bi-shield-lock text-primary me-2"></i>
                Change Password
              </h3>
              <form onSubmit={handlePasswordChange}>
                <div className="mb-3">
                  <label className="form-label">Old Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-warning">
                  <i className="bi bi-key me-2"></i>
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
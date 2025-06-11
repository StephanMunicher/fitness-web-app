import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ExercisePage from './pages/ExercisePage';
import NewExercisePage from './pages/NewExercisePage';
import WorkoutPlansPage from './pages/WorkoutPlansPage';
import NewWorkoutPlanPage from './pages/NewWorkoutPlanPage';
import StatsPage from './pages/StatsPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Створюємо окремий компонент для основного лейауту
const AppLayout = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div className="d-flex flex-column min-vh-100">
      {!isAuthPage && isAuthenticated && <Navbar />}
      
      <div className={`flex-grow-1 ${!isAuthPage ? 'container' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/workout-plans" replace />} />
          
          {/* Публічні роути */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Захищені роути */}
          <Route
            path="/exercises"
            element={
              <PrivateRoute>
                <ExercisePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/exercises/new"
            element={
              <PrivateRoute>
                <NewExercisePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/workout-plans"
            element={
              <PrivateRoute>
                <WorkoutPlansPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/workout-plans/new"
            element={
              <PrivateRoute>
                <NewWorkoutPlanPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <PrivateRoute>
                <StatsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/workout-plans" replace />} />
        </Routes>
      </div>
      
      {!isAuthPage && isAuthenticated && <Footer />}
    </div>
  );
};

// Головний компонент App
const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;

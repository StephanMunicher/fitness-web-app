import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand" to="/workout-plans">
          Fitness App
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                className={`nav-link${location.pathname === '/exercises' ? ' active' : ''}`}
                to="/exercises"
              >
                Exercises
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={`nav-link${location.pathname === '/exercises/new' ? ' active' : ''}`}
                to="/exercises/new"
              >
                New Exercise
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={`nav-link${location.pathname === '/workout-plans' ? ' active' : ''}`}
                to="/workout-plans"
              >
                Workout Plans
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={`nav-link${location.pathname === '/workout-plans/new' ? ' active' : ''}`}
                to="/workout-plans/new"
              >
                New Workout Plan
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={`nav-link${location.pathname === '/stats' ? ' active' : ''}`}
                to="/stats"
              >
                Stats
              </NavLink>
            </li>
            {/* Додаємо профіль */}
            <li className="nav-item">
              <NavLink
                className={`nav-link${location.pathname === '/profile' ? ' active' : ''}`}
                to="/profile"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <span className="me-1">
                  <i className="bi bi-person-circle"></i>
                </span>
                Profile
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
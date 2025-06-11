import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const navStyle = {
    backgroundColor: '#f8f9fa',
    padding: '10px',
    marginBottom: '20px'
  };

  const ulStyle = {
    listStyle: 'none',
    display: 'flex',
    gap: '20px',
    margin: 0,
    padding: 0
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold'
  };

  return (
    <nav style={navStyle}>
      <ul style={ulStyle}>
        <li>
          <Link to="/exercises" style={linkStyle}>Exercises</Link>
        </li>
        <li>
          <Link to="/workout-plans" style={linkStyle}>Workout Plans</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
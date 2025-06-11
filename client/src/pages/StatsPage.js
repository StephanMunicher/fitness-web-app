import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/workout-logs/stats?period=${period}`);
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError(error.response?.data?.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const chartData = {
    labels: stats?.periodStats.map(item => formatDate(item.date)) || [],
    datasets: [
      {
        label: 'Workouts Completed',
        data: stats?.periodStats.map(item => item.count) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Workouts',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return (
    <div className="container mt-4">
      <h2>My Workout Statistics</h2>

      <div className="mb-3">
        <label htmlFor="periodSelect" className="form-label">Select Period:</label>
        <select
          className="form-select"
          id="periodSelect"
          value={period}
          onChange={(e) => handlePeriodChange(e.target.value)}
          disabled={loading}
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      {loading && <div className="spinner-border" role="status"></div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {stats && (
        <div>
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Total Stats</h5>
              <p>Total Workouts: {stats.totalStats?.total_workouts || 0}</p>
              <p>Unique Plans: {stats.totalStats?.unique_plans || 0}</p>
              <p>Last Workout: {stats.totalStats?.last_workout ? formatDate(stats.totalStats.last_workout) : 'N/A'}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Workouts per Day</h5>
              {stats.periodStats.length > 0 ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <div className="alert alert-info">No data for the selected period.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;
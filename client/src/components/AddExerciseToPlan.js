import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AddExerciseToPlan = ({ workoutPlanId, onExerciseAdded }) => {
  const [exercises, setExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await api.get('/exercises');
        setExercises(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExercises();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/workout-exercises', {
        workoutPlanId,
        exerciseId: selectedExerciseId,
        sets,
        reps,
        weight,
        orderNumber,
      });
      onExerciseAdded(); // Оновити список вправ у плані
      setSelectedExerciseId('');
      setSets('');
      setReps('');
      setWeight('');
      setOrderNumber('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h4>Add Exercise to Plan</h4>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="exerciseId">Exercise:</label>
          <select
            id="exerciseId"
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
            required
          >
            <option value="">Select an exercise</option>
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sets">Sets:</label>
          <input
            type="number"
            id="sets"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="reps">Reps:</label>
          <input
            type="number"
            id="reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="weight">Weight:</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="orderNumber">Order Number:</label>
          <input
            type="number"
            id="orderNumber"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Exercise</button>
      </form>
    </div>
  );
};

export default AddExerciseToPlan;
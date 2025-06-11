import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';

const CreateWorkoutPlan = ({ onPlanCreated }) => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  // Завантаження списку вправ
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await api.get('/exercises');
        setExercises(response.data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };
    fetchExercises();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name must be at least 3 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Створюємо план
        const planResponse = await api.post('/plans', values);
        
        // Додаємо вправи до плану
        if (selectedExercises.length > 0) {
          await Promise.all(selectedExercises.map(exercise =>
            api.post(`/plans/${planResponse.data.id}/exercises`, {
              exerciseId: exercise.exerciseId,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight
            })
          ));
        }

        onPlanCreated();
        formik.resetForm();
        setSelectedExercises([]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  // Додавання вправи до плану
  const handleAddExercise = (exerciseId) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setSelectedExercises([...selectedExercises, {
        exerciseId: exercise.id,
        name: exercise.name,
        sets: 3,
        reps: 12,
        weight: 0
      }]);
    }
  };

  // Видалення вправи з плану
  const handleRemoveExercise = (index) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  // Оновлення параметрів вправи
  const handleExerciseParamChange = (index, param, value) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [param]: Number(value)
    };
    setSelectedExercises(updatedExercises);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title mb-4">Create New Workout Plan</h3>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Plan Name:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-danger">{formik.errors.name}</div>
            ) : null}
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description:</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            />
            {formik.touched.description && formik.errors.description ? (
              <div className="text-danger">{formik.errors.description}</div>
            ) : null}
          </div>

          {/* Секція вибору вправ */}
          <div className="mb-3">
            <label className="form-label">Add Exercises</label>
            <select 
              className="form-control mb-2"
              onChange={(e) => handleAddExercise(Number(e.target.value))}
              value=""
            >
              <option value="">Select exercise to add</option>
              {exercises.map(exercise => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>

          {/* Список вибраних вправ */}
          {selectedExercises.length > 0 && (
            <div className="mb-3">
              <h4>Selected Exercises</h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Exercise</th>
                      <th>Sets</th>
                      <th>Reps</th>
                      <th>Weight (kg)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedExercises.map((exercise, index) => (
                      <tr key={index}>
                        <td>{exercise.name}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={exercise.sets}
                            onChange={(e) => handleExerciseParamChange(index, 'sets', e.target.value)}
                            min="1"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={exercise.reps}
                            onChange={(e) => handleExerciseParamChange(index, 'reps', e.target.value)}
                            min="1"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={exercise.weight}
                            onChange={(e) => handleExerciseParamChange(index, 'weight', e.target.value)}
                            min="0"
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemoveExercise(index)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Plan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkoutPlan;
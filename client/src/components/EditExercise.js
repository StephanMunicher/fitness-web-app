import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import './EditExercise.css';

const EditExercise = ({ exercise, onExerciseUpdated, onCancel }) => {
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    difficultyLevel: Yup.string().required('Difficulty Level is required'),
    targetMuscles: Yup.string().required('Target Muscles is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: exercise.name,
      description: exercise.description,
      category: exercise.category,
      difficultyLevel: exercise.difficultyLevel,
      targetMuscles: exercise.targetMuscles.join(','),
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await api.put(`/exercises/${exercise.id}`, {
          ...values,
          targetMuscles: values.targetMuscles.split(','),
        });
        onExerciseUpdated();
        onCancel();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div className="edit-exercise-form">
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="name" className="form-label">
            Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
            id="name"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="invalid-feedback">{formik.errors.name}</div>
          )}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="description" className="form-label">
            Description <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${formik.touched.description && formik.errors.description ? 'is-invalid' : ''}`}
            id="description"
            name="description"
            rows="3"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="invalid-feedback">{formik.errors.description}</div>
          )}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="category" className="form-label">
            Category <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${formik.touched.category && formik.errors.category ? 'is-invalid' : ''}`}
            id="category"
            name="category"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.category}
          />
          {formik.touched.category && formik.errors.category && (
            <div className="invalid-feedback">{formik.errors.category}</div>
          )}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="difficultyLevel" className="form-label">
            Difficulty Level <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${formik.touched.difficultyLevel && formik.errors.difficultyLevel ? 'is-invalid' : ''}`}
            id="difficultyLevel"
            name="difficultyLevel"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.difficultyLevel}
          >
            <option value="">Select Difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          {formik.touched.difficultyLevel && formik.errors.difficultyLevel && (
            <div className="invalid-feedback">{formik.errors.difficultyLevel}</div>
          )}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="targetMuscles" className="form-label">
            Target Muscles <span className="text-danger">*</span>
            <small className="text-muted ms-2">(comma separated)</small>
          </label>
          <input
            type="text"
            className={`form-control ${formik.touched.targetMuscles && formik.errors.targetMuscles ? 'is-invalid' : ''}`}
            id="targetMuscles"
            name="targetMuscles"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.targetMuscles}
          />
          {formik.touched.targetMuscles && formik.errors.targetMuscles && (
            <div className="invalid-feedback">{formik.errors.targetMuscles}</div>
          )}
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button 
            type="button" 
            className="btn btn-outline-secondary" 
            onClick={onCancel}
          >
            <i className="bi bi-x-circle me-2"></i>
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExercise;
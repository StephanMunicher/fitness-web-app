import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';

const CreateExercise = ({ onExerciseCreated }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    difficultyLevel: Yup.string().required('Difficulty Level is required'),
    targetMuscles: Yup.string().required('Target Muscles is required'),
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Створюємо превью зображення
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      category: '',
      difficultyLevel: '',
      targetMuscles: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('category', values.category);
        formData.append('difficultyLevel', values.difficultyLevel);
        formData.append('targetMuscles', values.targetMuscles.split(','));
        if (image) {
          formData.append('image', image);
        }

        await api.post('/exercises', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        onExerciseCreated();
        formik.resetForm();
        setImage(null);
        setPreview(null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title mb-4">Create Exercise</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name:</label>
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

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description:</label>
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

          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category:</label>
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

          <div className="mb-3">
            <label htmlFor="difficultyLevel" className="form-label">Difficulty Level:</label>
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

          <div className="mb-3">
            <label htmlFor="targetMuscles" className="form-label">Target Muscles (comma separated):</label>
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

          <div className="mb-3">
            <label htmlFor="image" className="form-label">Exercise Image:</label>
            <input
              type="file"
              className="form-control"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {preview && (
            <div className="mb-3">
              <img
                src={preview}
                alt="Preview"
                className="img-thumbnail"
                style={{ maxWidth: '200px' }}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating...
              </>
            ) : (
              'Create Exercise'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateExercise;
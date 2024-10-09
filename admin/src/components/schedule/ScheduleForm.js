import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { addSchedule, fetchSchedules } from '../../features/schedule/scheduleSlice';

const ScheduleForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    category: '',
    location: '',
    driver: '',
    duration: 0
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation: must be at least 3 characters long and contain only letters
    const nameRegex = /^[A-Za-z]+$/;
    if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = 'Name must contain only letters';
    }
  
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
  
    // Driver validation: must be at least 3 characters long and contain only letters
    if (formData.driver.length < 3) {
      newErrors.driver = 'Assigned driver name must be at least 3 characters long';
    } else if (!nameRegex.test(formData.driver)) {
      newErrors.driver = 'Driver name must contain only letters';
    }
  
    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be at least 1 day';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(addSchedule(formData));
      setFormData({
        name: '',
        quantity: 0,
        category: '',
        location: '',
        driver: '',
        duration: 0
      });
      setErrors({});
    }
  };

  return (
    <div className="container mx-auto mt-6">
      {/* Schedule Form Section */}
      <div className="max-w-lg mx-auto bg-blue-100 p-6 rounded-md mb-10">
        <h2 className="text-xl font-bold mb-4">Scheduling Section</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-400 rounded"
              placeholder="Enter item name (e.g., Equipment)"
              required
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-400 rounded"
              placeholder="Enter quantity (e.g., 5)"
              required
              min="1"
            />
            {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity}</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-400 rounded"
              required
            >
              <option value="" disabled>Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Chemicals">Chemicals</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Location:</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-400 rounded"
              required
            >
              <option value="" disabled>Select a location</option>
              <option value="Dankotuwa">Dankotuwa</option>
              <option value="Negombo">Negombo</option>
              <option value="Colombo">Colombo</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Assigned Driver:</label>
            <input
              type="text"
              name="driver"
              value={formData.driver}
              onChange={handleChange}
              className="w-full p-2 border border-gray-400 rounded"
              placeholder="Enter driver's name"
              required
            />
            {errors.driver && <span className="text-red-500 text-sm">{errors.driver}</span>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Estimated Duration (in days):</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-2 border border-gray-400 rounded"
              placeholder="Enter duration in days"
              required
              min="1"
            />
            {errors.duration && <span className="text-red-500 text-sm">{errors.duration}</span>}
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Add Schedule
          </button>
        </form>
        {/* Schedule List Button */}
        <button
          onClick={() => navigate('/schedulelist')}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded"
        >
          Schedule List
        </button>
      </div>
    </div>
  );
};

export default ScheduleForm;

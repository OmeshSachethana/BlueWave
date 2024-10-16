import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addMaintenance } from '../../features/maintenance/maintenanceSlice';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const AddMaintenance = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    technician: '',
  });

  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();  // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Restrict to only letters for name and technician fields
  const handleKeyPress = (e) => {
    const charCode = e.keyCode || e.which;
    const char = String.fromCharCode(charCode);
    const regex = /^[A-Za-z\s]*$/;  // Only allows letters and spaces

    if (!regex.test(char)) {
      e.preventDefault();
    }
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    const namePattern = /^[A-Za-z\s]+$/; // Regex to allow only letters and spaces

    // Name validation (only letters)
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!namePattern.test(formData.name)) {
      newErrors.name = 'Name can only contain letters';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }

    // Date validation (must be a valid date in the future or today)
    const today = new Date().toISOString().split('T')[0]; // Get today's date
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (formData.date < today) {
      newErrors.date = 'Date cannot be in the past';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Technician validation (only letters)
    if (!formData.technician.trim()) {
      newErrors.technician = 'Technician name is required';
    } else if (!namePattern.test(formData.technician)) {
      newErrors.technician = 'Technician name can only contain letters';
    } else if (formData.technician.length < 3) {
      newErrors.technician = 'Technician name must be at least 3 characters long';
    }

    setErrors(newErrors);

    // Return whether form is valid
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Run validation
    if (validate()) {
      dispatch(addMaintenance(formData));
      setFormData({
        name: '',
        date: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        technician: '',
      });
    }
  };

  // Function to handle navigation to Maintenance List
  const goToMaintenanceList = () => {
    navigate('/maintenancelist');  // Adjust the path based on your route
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-8 bg-blue-100 shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Add Maintenance</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onKeyPress={handleKeyPress}  // Restrict to only letters
            placeholder="Enter maintenance name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="Select maintenance date"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
          {errors.date && <p className="text-red-500">{errors.date}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter maintenance description"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          ></textarea>
          {errors.description && <p className="text-red-500">{errors.description}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Priority Level</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Responsible Technician</label>
          <input
            type="text"
            name="technician"
            value={formData.technician}
            onChange={handleChange}
            onKeyPress={handleKeyPress}  // Restrict to only letters
            placeholder="Enter technician's name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
          {errors.technician && <p className="text-red-500">{errors.technician}</p>}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Maintenance
        </button>
      </form>

      {/* Button to navigate to Maintenance List */}
      <button
        onClick={goToMaintenanceList}
        className="w-full py-2 px-4 mt-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        Go to Maintenance List
      </button>
    </div>
  );
};

export default AddMaintenance;

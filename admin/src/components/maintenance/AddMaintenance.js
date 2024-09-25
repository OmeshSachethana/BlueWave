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
    priority: 'Medium', // Default priority
    technician: '',     // Empty technician field
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();  // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addMaintenance(formData));
    setFormData({
      name: '',
      date: '',
      description: '',
      status: 'Pending',
      priority: 'Medium',
      technician: '',
    });
  };

  // Function to handle navigation to Maintenance List
  const goToMaintenanceList = () => {
    navigate('/maintenancelist');  // Adjust the path based on your route
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Add Maintenance</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter maintenance name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
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
            placeholder="Enter technician's name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
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

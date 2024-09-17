import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSchedule, fetchSchedules } from '../../features/schedule/scheduleSlice';

const ScheduleForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    category: '',
    location: ''
  });

  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch schedules when the component is mounted
    dispatch(fetchSchedules());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addSchedule(formData));
    setFormData({
      name: '',
      quantity: 0,
      category: '',
      location: ''
    });
  };

  return (
    <div className="container mx-auto">
      {/* Schedule Form Section */}
      <div className="max-w-lg mx-auto bg-gray-200 p-6 rounded-md mb-10">
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
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-400 rounded"
              required
              min="0"
            />
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
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Add Items
          </button>
        </form>
      </div>

      {/* Separate Schedule Table Section */}
      {/* <div className="max-w-5xl mx-auto bg-gray-100 p-6 rounded-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Schedule Table</h2>
        <ScheduleTable />
      </div> */}
    </div>
  );
};

export default ScheduleForm;

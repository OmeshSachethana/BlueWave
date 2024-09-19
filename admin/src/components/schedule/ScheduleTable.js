import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchedules, updateSchedule, deleteSchedule } from '../../features/schedule/scheduleSlice';
import { Bar } from 'react-chartjs-2'; // Import the Bar chart from react-chartjs-2
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ScheduleTable = () => {
  const dispatch = useDispatch();
  const { schedules, loading } = useSelector((state) => state.schedules);

  const [editItem, setEditItem] = useState(null);
  const [editData, setEditData] = useState({
    quantity: 0,
  });

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  const handleEdit = (schedule) => {
    setEditItem(schedule._id);
    setEditData({ quantity: schedule.quantity });
  };

  const handleDelete = (id) => {
    dispatch(deleteSchedule(id));
  };

  const handleSave = (id) => {
    dispatch(updateSchedule({ id, quantity: editData.quantity }));
    setEditItem(null);
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  // Prepare data for the chart
  const chartData = {
    labels: schedules.map(schedule => schedule.category), // Categories as X-axis labels
    datasets: [
      {
        label: 'Quantity',
        data: schedules.map(schedule => schedule.quantity), // Quantities as Y-axis values
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Category vs Quantity',
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-center text-2xl font-bold mb-6">Schedule Management</h2>

      {/* Render Bar chart */}
      <div className="mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <table className="min-w-full bg-gray-100 border">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Quantity</th>
            <th className="py-2 px-4">Category</th>
            <th className="py-2 px-4">Location</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-4">Loading...</td>
            </tr>
          ) : (
            schedules.map((schedule) => (
              <tr key={schedule._id} className="border-b">
                <td className="py-2 px-4">{schedule._id}</td>
                <td className="py-2 px-4">{schedule.name}</td>
                <td className="py-2 px-4">
                  {editItem === schedule._id ? (
                    <input
                      type="number"
                      name="quantity"
                      value={editData.quantity}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 rounded"
                    />
                  ) : (
                    schedule.quantity
                  )}
                </td>
                <td className="py-2 px-4">{schedule.category}</td>
                <td className="py-2 px-4">{schedule.location}</td>
                <td className="py-2 px-4">
                  {editItem === schedule._id ? (
                    <button
                      onClick={() => handleSave(schedule._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(schedule._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;

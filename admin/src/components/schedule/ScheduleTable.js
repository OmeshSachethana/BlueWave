import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchSchedules, updateSchedule, deleteSchedule } from '../../features/schedule/scheduleSlice';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import logo from '../../assets/bluewave_logo.png'; // Ensure you use the imported logo

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ScheduleTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { schedules, loading } = useSelector((state) => state.schedules);
  const [editItem, setEditItem] = useState(null);
  const [editData, setEditData] = useState({ quantity: 0, driver: '', duration: 0, name: '', category: '', location: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(''); // State for selected location

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  const handleEdit = (schedule) => {
    setEditItem(schedule._id);
    setEditData({
      quantity: schedule.quantity,
      driver: schedule.driver,
      duration: schedule.duration,
      name: schedule.name,
      category: schedule.category,
      location: schedule.location
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteSchedule(id));
  };

  const handleSave = (id) => {
    dispatch(updateSchedule({ 
      id, 
      quantity: editData.quantity, 
      driver: editData.driver, 
      duration: editData.duration,
      name: editData.name,
      category: editData.category,
      location: editData.location
    }));
    setEditItem(null);
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  // Prepare data for the chart based on unique categories
  const categories = ['Electronics', 'Chemicals', 'Other'];
  const statusCounts = {
    Electronics: 0,
    Chemicals: 0,
    Other: 0,
  };

  schedules.forEach(schedule => {
    if (statusCounts[schedule.category] !== undefined) {
      statusCounts[schedule.category] += schedule.quantity;
    }
  });

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Quantity',
        data: [statusCounts.Electronics, statusCounts.Chemicals, statusCounts.Other],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Logo properties
    const logoWidth = 50;
    const logoHeight = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoX = (pageWidth - logoWidth) / 2;

    // Add logo
    doc.addImage(logo, 'PNG', logoX, 10, logoWidth, logoHeight);

    // Add title
    doc.setFontSize(16);
    doc.text('Schedule Table', 14, 40);

    // Get the current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();

    // Add date of report generation
    doc.setFontSize(12);
    doc.text(`Report generated on: ${formattedDate}`, 14, 50);

    // Render the chart to a canvas and then to PDF
    html2canvas(document.querySelector('.chart-container')).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const chartStartY = 60;
      doc.addImage(imgData, 'PNG', 10, chartStartY, 190, 100);

      // Prepare table data
      const tableColumn = ['ID', 'Name', 'Quantity', 'Category', 'Location', 'Driver', 'Duration'];
      const tableRows = schedules.map((schedule, index) => [
        index + 1, 
        schedule.name,
        schedule.quantity,
        schedule.category,
        schedule.location,
        schedule.driver,
        schedule.duration
      ]);

      // Add table to PDF
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: chartStartY + 110,
      });

      // Save the PDF
      doc.save('schedule_table.pdf');
    });
  };

  // Chart options
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

  // Filter schedules based on search term and selected location
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation ? schedule.location === selectedLocation : true;
    return matchesSearch && matchesLocation;
  });

  const locations = ['Negombo', 'Dankotuwa', 'Colombo'];

  return (
    <div className="max-w-6xl mx-auto mt-6">
      <div className="mb-4">
        <button
          onClick={() => navigate('/schedule')} // Navigate to '/schedule'
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
      <h2 className="text-center text-2xl font-bold mb-6">Schedule Management</h2>
      {/* Chart Container */}
      <div className="mb-6 chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Location Filter */}
      <div className="mb-4">
      Filter by Location: 
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Button to download the table as PDF */}
      <div className="mb-4">
        <button
          onClick={downloadPDF}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-100 border border-gray-300 w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4 w-1/4">Name</th>
              <th className="py-2 px-4 w-1/12">Quantity</th>
              <th className="py-2 px-4 w-1/6">Category</th>
              <th className="py-2 px-4 w-1/6">Location</th>
              <th className="py-2 px-4 w-1/6">Assigned Driver</th>
              <th className="py-2 px-4 w-1/12">Duration</th>
              <th className="py-2 px-4 w-1/4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4">Loading...</td>
              </tr>
            ) : (
              filteredSchedules.map((schedule, index) => (
                <tr key={schedule._id} className="border-b">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">
                    {editItem === schedule._id ? (
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleChange}
                        className="p-1 w-24 border border-gray-300 rounded"
                      />
                    ) : (
                      schedule.name
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editItem === schedule._id ? (
                      <input
                        type="number"
                        name="quantity"
                        value={editData.quantity}
                        onChange={handleChange}
                        className="p-1 w-16 border border-gray-300 rounded"
                      />
                    ) : (
                      schedule.quantity
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editItem === schedule._id ? (
                      <select
                        name="category"
                        value={editData.category}
                        onChange={handleChange}
                        className="p-1 border border-gray-300 rounded"
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Chemicals">Chemicals</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      schedule.category
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editItem === schedule._id ? (
                      <select
                        name="location"
                        value={editData.location}
                        onChange={handleChange}
                        className="p-1 w-24 border border-gray-300 rounded"
                      >
                        {locations.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    ) : (
                      schedule.location
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editItem === schedule._id ? (
                      <input
                        type="text"
                        name="driver"
                        value={editData.driver}
                        onChange={handleChange}
                        className="p-1 w-24 border border-gray-300 rounded"
                      />
                    ) : (
                      schedule.driver
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editItem === schedule._id ? (
                      <input
                        type="number"
                        name="duration"
                        value={editData.duration}
                        onChange={handleChange}
                        className="p-1 w-16 border border-gray-300 rounded"
                      />
                    ) : (
                      schedule.duration
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editItem === schedule._id ? (
                      <div>
                        <button
                          onClick={() => handleSave(schedule._id)}
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditItem(null)}
                          className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(schedule._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;

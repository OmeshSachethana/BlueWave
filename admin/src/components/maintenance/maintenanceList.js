import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { fetchAllMaintenance, deleteMaintenance, updateMaintenanceStatus } from '../../features/maintenance/maintenanceSlice';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // Register necessary chart.js components

const MaintenanceList = () => {
  const dispatch = useDispatch();
  const { maintenanceList, error } = useSelector((state) => state.maintenance);

  const [editingId, setEditingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  useEffect(() => {
    dispatch(fetchAllMaintenance());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteMaintenance(id));
  };

  const handleStatusEdit = (id, currentStatus) => {
    setEditingId(id);
    setSelectedStatus(currentStatus);
  };

  const handleStatusUpdate = (id) => {
    dispatch(updateMaintenanceStatus({ id, status: selectedStatus }));
    setEditingId(null);
  };

  const filteredMaintenanceList = maintenanceList.filter((maintenance) => {
    const matchesStatus = filterStatus === '' || maintenance.status === filterStatus;
    const matchesSearch = maintenance.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Generate PDF function
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Maintenance List', 14, 16);

    const tableColumn = ['Name', 'Description', 'Status', 'Priority', 'Technician'];
    const tableRows = [];

    filteredMaintenanceList.forEach(maintenance => {
      const maintenanceData = [
        maintenance.name,
        maintenance.description,
        maintenance.status,
        maintenance.priority,
        maintenance.technician
      ];
      tableRows.push(maintenanceData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('maintenance_list.pdf');
  };

  // Count the occurrences of each status
  const statusCounts = maintenanceList.reduce(
    (acc, maintenance) => {
      acc[maintenance.status] = (acc[maintenance.status] || 0) + 1;
      return acc;
    },
    { Pending: 0, 'In Progress': 0, Completed: 0 }
  );

  const data = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Maintenance Status Count',
        data: [statusCounts.Pending, statusCounts['In Progress'], statusCounts.Completed],
        backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Maintenance List</h2>

      {/* Bar Chart */}
      <div className="mb-8">
        <Bar data={data} options={options} />
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label htmlFor="filterStatus" className="mr-2 text-gray-700 font-semibold">Filter by Status:</label>
        <select
          id="filterStatus"
          className="px-4 py-2 border border-gray-300 rounded-lg"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Generate PDF Button */}
      <div className="mb-4">
        <button
          onClick={generatePDF}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Generate PDF
        </button>
      </div>

      {filteredMaintenanceList.length > 0 ? (
        filteredMaintenanceList.map((maintenance) => (
          <div key={maintenance._id} className="bg-white p-4 mb-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{maintenance.name}</h3>
            <p className="text-gray-700">{maintenance.description}</p>
            <p className="text-gray-500">{new Date(maintenance.date).toLocaleDateString()}</p>
            <p className="text-gray-500">Status: {maintenance.status}</p>
            <p className="text-gray-500">Priority: {maintenance.priority}</p> {/* Display Priority Level */}
            <p className="text-gray-500">Technician: {maintenance.technician}</p> {/* Display Technician */}

            {editingId === maintenance._id ? (
              <div className="mt-4">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <button
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={() => handleStatusUpdate(maintenance._id)}
                >
                  Save
                </button>
                <button
                  className="ml-2 px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between mt-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={() => handleStatusEdit(maintenance._id, maintenance.status)}
                >
                  Update Status
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={() => handleDelete(maintenance._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No maintenance records available</p>
      )}
    </div>
  );
};

export default MaintenanceList;

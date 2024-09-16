import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllMaintenance, deleteMaintenance, updateMaintenanceStatus } from '../../features/maintenance/maintenanceSlice';

const MaintenanceList = () => {
  const dispatch = useDispatch();
  const { maintenanceList, error } = useSelector((state) => state.maintenance);

  // Local state to manage which record is being updated
  const [editingId, setEditingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  // Fetch maintenance records on component mount
  useEffect(() => {
    dispatch(fetchAllMaintenance());
  }, [dispatch]);

  // Handle Delete action
  const handleDelete = (id) => {
    dispatch(deleteMaintenance(id));
  };

  // Handle Status Update action (trigger status change UI)
  const handleStatusEdit = (id, currentStatus) => {
    setEditingId(id); // Set the ID of the record being updated
    setSelectedStatus(currentStatus); // Pre-select the current status
  };

  // Submit the updated status
  const handleStatusUpdate = (id) => {
    dispatch(updateMaintenanceStatus({ id, status: selectedStatus }));
    setEditingId(null); // Close the editing UI after updating
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Maintenance List</h2>
      {maintenanceList.length > 0 ? (
        maintenanceList.map((maintenance) => (
          <div key={maintenance._id} className="bg-white p-4 mb-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{maintenance.name}</h3>
            <p className="text-gray-700">{maintenance.description}</p>
            <p className="text-gray-500">{new Date(maintenance.date).toLocaleDateString()}</p>
            <p className="text-gray-500">Status: {maintenance.status}</p>

            {/* If editing this record, show the dropdown */}
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
                  onClick={() => setEditingId(null)} // Cancel editing
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

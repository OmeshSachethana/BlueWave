import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllMaintenance, deleteMaintenance, updateMaintenanceStatus } from '../../features/maintenance/maintenanceSlice';

const MaintenanceList = () => {
  const dispatch = useDispatch();
  const { maintenanceList, error } = useSelector((state) => state.maintenance);

  // Fetch maintenance records on component mount
  useEffect(() => {
    dispatch(fetchAllMaintenance());
  }, [dispatch]);

  // Handle Delete action
  const handleDelete = (id) => {
    dispatch(deleteMaintenance(id));
  };

  // Handle Status Update action
  const handleStatusUpdate = (id, newStatus) => {
    dispatch(updateMaintenanceStatus({ id, status: newStatus }));
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
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => handleStatusUpdate(maintenance._id, 'In Progress')}
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
          </div>
        ))
      ) : (
        <p className="text-gray-500">No maintenance records available</p>
      )}
    </div>
  );
};

export default MaintenanceList;

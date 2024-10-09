import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntries, updateEntry } from '../../features/pettyCash/pettyCashSlice';

const PettyCashView = () => {
  const dispatch = useDispatch();
  const entries = useSelector((state) => state.pettyCash.entries);
  const entryStatus = useSelector((state) => state.pettyCash.status);
  const error = useSelector((state) => state.pettyCash.error);

  // State for tracking the edit mode
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    receipt: '',
    details: '',
    voucherNumber: '',
    total: '',
    officeExpense: '',
    vanExpense: '',
    cleaningExpense: '',
    sundryExpense: '',
  });

  // Handle edit button click
  const handleEditClick = (entry) => {
    setEditId(entry._id);
    setEditFormData({
      receipt: entry.receipt,
      details: entry.details,
      voucherNumber: entry.voucherNumber,
      total: entry.total,
      officeExpense: entry.officeExpense,
      vanExpense: entry.vanExpense,
      cleaningExpense: entry.cleaningExpense,
      sundryExpense: entry.sundryExpense,
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission to update the entry
  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(updateEntry({ id: editId, updatedEntry: editFormData })).then(() => {
      setEditId(null); // Close the edit form after successful update
    });
  };

  return (
    <div className="p-5">
      {entryStatus === 'loading' && <p>Loading entries...</p>}
      {entryStatus === 'failed' && <p>Error: {error}</p>}
      {entries.length === 0 ? (
        <p>No petty cash entries found.</p>
      ) : (
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Receipt</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Details</th>
              <th className="py-2 px-4 border">Voucher Number</th>
              <th className="py-2 px-4 border">Total</th>
              <th className="py-2 px-4 border">Office Expense</th>
              <th className="py-2 px-4 border">Travelling Expense</th>
              <th className="py-2 px-4 border">Cleaning Expense</th>
              <th className="py-2 px-4 border">Sundry Expense</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id} className="hover:bg-gray-100">
                {editId === entry._id ? (
                  <>
                    {/* Edit form inputs */}
                    <td className="py-2 px-4 border">
                      <input
                        type="text"
                        name="receipt"
                        value={editFormData.receipt}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    </td>
                    <td className="py-2 px-4 border">
                      <input
                        type="text"
                        name="details"
                        value={editFormData.details}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    </td>
                    <td className="py-2 px-4 border">
                      <input
                        type="text"
                        name="voucherNumber"
                        value={editFormData.voucherNumber}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    </td>
                    <td className="py-2 px-4 border">
                      <input
                        type="number"
                        name="total"
                        value={editFormData.total}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    </td>
                    {/* Other inputs */}
                    <td className="py-2 px-4 border">
                      <input
                        type="number"
                        name="officeExpense"
                        value={editFormData.officeExpense}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    </td>
                    <td className="py-2 px-4 border">
                      <input
                        type="number"
                        name="vanExpense"
                        value={editFormData.vanExpense}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    </td>
                    <td className="py-2 px-4 border">
                      <input
                        type="number"
                        name="cleaningExpense"
                        value={editFormData.cleaningExpense}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    </td>
                    <td className="py-2 px-4 border">
                      <input
                        type="number"
                        name="sundryExpense"
                        value={editFormData.sundryExpense}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    </td>
                    <td className="py-2 px-4 border flex space-x-2">
                      <button
                        onClick={handleFormSubmit}
                        className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    {/* Display existing values */}
                    <td className="py-2 px-4 border">{entry.receipt}</td>
                    <td className="py-2 px-4 border">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border">{entry.details}</td>
                    <td className="py-2 px-4 border">{entry.voucherNumber}</td>
                    <td className="py-2 px-4 border">{entry.total}</td>
                    <td className="py-2 px-4 border">{entry.officeExpense}</td>
                    <td className="py-2 px-4 border">{entry.vanExpense}</td>
                    <td className="py-2 px-4 border">{entry.cleaningExpense}</td>
                    <td className="py-2 px-4 border">{entry.sundryExpense}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleEditClick(entry)}
                        className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PettyCashView;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchEntries, updateEntry, deleteEntry } from '../../features/pettyCash/pettyCashSlice';

const PettyCashView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate

  // State for tracking the edit mode and form data
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

  // Get the petty cash entries from the Redux store
  const entries = useSelector((state) => state.pettyCash.entries);
  const entryStatus = useSelector((state) => state.pettyCash.status);
  const error = useSelector((state) => state.pettyCash.error);

  // Fetch the entries when the component mounts
  useEffect(() => {
    if (entryStatus === 'idle') {
      dispatch(fetchEntries());
    }
  }, [entryStatus, dispatch]);

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

  // Handle delete functionality
  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      dispatch(deleteEntry(id));
    }
  };

  // Calculate totals for each column
  const receiptTotal = entries.reduce((acc, entry) => acc + (entry.receipt || 0), 0);
  const totalSum = entries.reduce((acc, entry) => acc + (entry.total || 0), 0);
  const officeExpenseSum = entries.reduce((acc, entry) => acc + (entry.officeExpense || 0), 0);
  const vanExpenseSum = entries.reduce((acc, entry) => acc + (entry.vanExpense || 0), 0);
  const cleaningExpenseSum = entries.reduce((acc, entry) => acc + (entry.cleaningExpense || 0), 0);
  const sundryExpenseSum = entries.reduce((acc, entry) => acc + (entry.sundryExpense || 0), 0);

  // Calculate balance c/d
  const balanceCD = receiptTotal - totalSum;

  // Calculate total of totalsum + balanceCD
  const grandTotal = totalSum + balanceCD;

  return (
    <div className="p-5">
      <button 
        onClick={() => navigate('/pettycash-form')} // Navigate to petty cash form
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back
      </button>
      <h2 className="text-2xl font-bold mb-4 text-center">Petty Cash Book</h2> {/* Title for the table */}
      {entryStatus === 'loading' && <p>Loading entries...</p>}
      {entryStatus === 'failed' && <p>Error: {error}</p>}
      {entries.length === 0 ? (
        <p>No petty cash entries found.</p>
      ) : (
        <table className="min-w-full table-auto bg-white border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Receipt</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Details</th>
              <th className="py-2 px-4 border">Voucher <br />Number</th>
              <th className="py-2 px-4 border">Total</th>
              <th className="py-2 px-4 border">Office <br />Expense</th>
              <th className="py-2 px-4 border">Travelling <br />Expense</th>
              <th className="py-2 px-4 border">Cleaning <br />Expense</th>
              <th className="py-2 px-4 border">Sundry <br />Expense</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id}>
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
                    <td className="py-2 px-4 border">{new Date(entry.date).toLocaleDateString()}</td>
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
                    <td className="py-2 px-4 border flex space-x-2">
                      <button
                        onClick={() => handleEditClick(entry)}
                        className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(entry._id)}
                        className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          {/* Display total row */}
          <tr className="font-bold bg-gray-300">
              <td className="py-2 px-4 border" colSpan="4"></td>
              <td className="py-2 px-4 border">{totalSum}</td>
              <td className="py-2 px-4 border">{officeExpenseSum}</td>
              <td className="py-2 px-4 border">{vanExpenseSum}</td>
              <td className="py-2 px-4 border">{cleaningExpenseSum}</td>
              <td className="py-2 px-4 border">{sundryExpenseSum}</td>
            </tr>
            {/* Display balance c/d row */}
            <tr className="font-bold bg-gray-200">
              <td className="py-2 px-4 border"></td>
              <td className="py-2 px-4 border"></td>
              <td className="py-2 px-4 border">Balance c/d</td>
              <td className="py-2 px-4 border"></td>
              <td className="py-2 px-4 border">{balanceCD}</td>
              <td className="py-2 px-4 border" colSpan="4"></td>
            </tr>
            {/* Display grand total row */}
            <tr className="font-bold bg-gray-300">
              <td className="py-2 px-4 border">{receiptTotal}</td>
              <td className="py-2 px-4 border"></td>
              <td className="py-2 px-4 border"></td>
              <td className="py-2 px-4 border"></td>
              <td className="py-2 px-4 border">{grandTotal}</td>
              <td className="py-2 px-4 border" colSpan="4"></td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PettyCashView;

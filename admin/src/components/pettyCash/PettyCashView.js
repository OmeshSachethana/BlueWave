import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchEntries, deleteEntry } from '../../features/pettyCash/pettyCashSlice';

function PettyCashView() {
  const dispatch = useDispatch();
  const entries = useSelector((state) => state.pettyCash.entries);
  const entryStatus = useSelector((state) => state.pettyCash.status);
  const error = useSelector((state) => state.pettyCash.error);

  useEffect(() => {
    if (entryStatus === 'idle') {
      dispatch(fetchEntries());
    }
  }, [entryStatus, dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteEntry(id));
  };

  return (
    <div>
      <div className="mb-4">
        <Link to="/form" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add New Entry
        </Link>
      </div>

      {entryStatus === 'loading' ? (
        <p>Loading...</p>
      ) : entryStatus === 'failed' ? (
        <p>Error: {error}</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Receipt</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Details</th>
              <th className="py-2 px-4 border">Voucher Number</th>
              <th className="py-2 px-4 border">Total</th>
              <th className="py-2 px-4 border">Office Expense</th>
              <th className="py-2 px-4 border">Van Expense</th>
              <th className="py-2 px-4 border">Cleaning Expense</th>
              <th className="py-2 px-4 border">Sundry Expense</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id}>
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
                  <button className="text-red-500" onClick={() => handleDelete(entry._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PettyCashView;

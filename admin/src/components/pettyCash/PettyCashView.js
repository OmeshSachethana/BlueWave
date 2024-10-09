import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntries } from '../../features/pettyCash/pettyCashSlice';

const PettyCashView = () => {
  const dispatch = useDispatch();
  
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

  // Render the table
  return (
    <div className="p-5">
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
              <th className="py-2 px-4 border">Voucher Number</th>
              <th className="py-2 px-4 border">Total</th>
              <th className="py-2 px-4 border">Office Expense</th>
              <th className="py-2 px-4 border">Van Expense</th>
              <th className="py-2 px-4 border">Cleaning Expense</th>
              <th className="py-2 px-4 border">Sundry Expense</th>
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
              </tr>
            ))}
            {/* Display total row */}
            <tr className="font-bold bg-gray-300">
              <td className="py-2 px-4 border">{receiptTotal}</td>
              <td className="py-2 px-4 border" colSpan="3"></td>
              <td className="py-2 px-4 border">{totalSum}</td>
              <td className="py-2 px-4 border">{officeExpenseSum}</td>
              <td className="py-2 px-4 border">{vanExpenseSum}</td>
              <td className="py-2 px-4 border">{cleaningExpenseSum}</td>
              <td className="py-2 px-4 border">{sundryExpenseSum}</td>
            </tr>
            {/* Display balance c/d row */}
            <tr className="font-bold bg-gray-200">
              <td className="py-2 px-4 border">Balance c/d</td>
              <td className="py-2 px-4 border" colSpan="3"></td>
              <td className="py-2 px-4 border">{balanceCD}</td>
              <td className="py-2 px-4 border" colSpan="4"></td>
            </tr>
            {/* Display grand total row */}
            <tr className="font-bold bg-gray-300">
              <td className="py-2 px-4 border">Grand Total</td>
              <td className="py-2 px-4 border" colSpan="3"></td>
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

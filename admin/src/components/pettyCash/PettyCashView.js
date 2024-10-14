import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { fetchEntries, updateEntry, deleteEntry } from '../../features/pettyCash/pettyCashSlice';
import jsPDF from 'jspdf';
import logo from '../../assets/bluewave_logo.png';
import { downloadCSV } from '../../utils/csvDownloader';

const PettyCashView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

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

  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [categoryFilter, setCategoryFilter] = useState('All'); // State for category filter
  const entries = useSelector((state) => state.pettyCash.entries);
  const entryStatus = useSelector((state) => state.pettyCash.status);
  const error = useSelector((state) => state.pettyCash.error);

  useEffect(() => {
    if (entryStatus === 'idle') {
      dispatch(fetchEntries());
    }
  }, [entryStatus, dispatch]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(updateEntry({ id: editId, updatedEntry: editFormData })).then(() => {
      setEditId(null); 
    });
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      dispatch(deleteEntry(id));
    }
  };

  // Filter entries based on search query and category
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      categoryFilter === 'All' || 
      (categoryFilter === 'Office Expense' && entry.officeExpense > 0) ||
      (categoryFilter === 'Van Expense' && entry.vanExpense > 0) ||
      (categoryFilter === 'Cleaning Expense' && entry.cleaningExpense > 0) ||
      (categoryFilter === 'Sundry Expense' && entry.sundryExpense > 0);
      
    return matchesSearch && matchesCategory;
  });

  const receiptTotal = filteredEntries.reduce((acc, entry) => acc + (entry.receipt || 0), 0);
  const totalSum = filteredEntries.reduce((acc, entry) => acc + (entry.total || 0), 0);
  const officeExpenseSum = filteredEntries.reduce((acc, entry) => acc + (entry.officeExpense || 0), 0);
  const vanExpenseSum = filteredEntries.reduce((acc, entry) => acc + (entry.vanExpense || 0), 0);
  const cleaningExpenseSum = filteredEntries.reduce((acc, entry) => acc + (entry.cleaningExpense || 0), 0);
  const sundryExpenseSum = filteredEntries.reduce((acc, entry) => acc + (entry.sundryExpense || 0), 0);

  const balanceCD = receiptTotal - totalSum;
  const grandTotal = totalSum + balanceCD;

  // Function to generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Logo properties
    const logoWidth = 50; // Width of the logo
    const logoHeight = 20; // Height of the logo
  
    // Centering the logo
    const pageWidth = doc.internal.pageSize.getWidth(); // Get PDF page width
    const logoX = (pageWidth - logoWidth) / 2; // Calculate x position for centering
  
    // Add logo
    doc.addImage(logo, 'PNG', logoX, 10, logoWidth, logoHeight); // Use calculated x position
    
    doc.setFontSize(18);
    doc.text("Petty Cash Book", 14, 40); // Align title to the left
    
    // Get the current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString(); // Format date and time
  
    // Add date of report generation
    doc.setFontSize(12);
    doc.text(`Report generated on: ${formattedDate}`, 14, 50); // Align date to the left
    
    const tableColumn = ["Receipt", "Date", "Details", "Voucher Number", "Total", "Office Expense", "Travelling Expense", "Cleaning Expense", "Sundry Expense"];
    const tableRows = [];

    filteredEntries.forEach(entry => {
      const entryData = [
        entry.receipt,
        new Date(entry.date).toLocaleDateString(),
        entry.details,
        entry.voucherNumber,
        entry.total,
        entry.officeExpense,
        entry.vanExpense,
        entry.cleaningExpense,
        entry.sundryExpense,
      ];
      tableRows.push(entryData);
    });

    // Positioning the table lower in the document
    doc.autoTable(tableColumn, tableRows, { startY: 60 }); // Adjust startY to 60 for more space above the table
    
    // Calculate totals
    const finalY = doc.autoTable.previous.finalY; // Get the Y position after the table
    doc.text(`Total: ${totalSum}`, 14, finalY + 10);
    doc.text(`Balance c/d: ${balanceCD}`, 14, finalY + 20);
    doc.text(`Grand Total: ${grandTotal}`, 14, finalY + 30);
    
    doc.save('petty_cash_report.pdf');
};
  const handleCSVDownload = () => {
    downloadCSV(filteredEntries); // Call the CSV downloader utility with the filtered entries
  };

  return (
    <div className="p-5">
      <button 
        onClick={() => navigate('/pettycash-form')} 
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back
      </button> <br />
      <button 
        onClick={generatePDF}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Generate PDF
      </button> <br />
      <button 
        onClick={handleCSVDownload}
        className="mb-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        Download CSV
      </button>
      <h2 className="text-2xl font-bold mb-4 text-center">Petty Cash Book</h2>
      
      <input
        type="text"
        placeholder="Search by details..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        className="mb-4 p-2 border border-gray-300 rounded"
      />

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      >
        <option value="All">All Categories</option>
        <option value="Office Expense">Office Expense</option>
        <option value="Van Expense">Travelling Expense</option>
        <option value="Cleaning Expense">Cleaning Expense</option>
        <option value="Sundry Expense">Sundry Expense</option>
      </select>

      {entryStatus === 'loading' && <p>Loading entries...</p>}
      {entryStatus === 'failed' && <p>Error: {error}</p>}
      {filteredEntries.length === 0 ? (
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
            {filteredEntries.map((entry) => (
              <tr key={entry._id}>
                {editId === entry._id ? (
                  <>
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

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addEntry } from '../../features/pettyCash/pettyCashSlice';
import { useNavigate } from 'react-router-dom';

function PettyCashForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    receipt: '',
    date: '', // Date as a string for HTML5 input
    details: '',
    voucherNumber: '',
    total: '',
    officeExpense: '',
    vanExpense: '',
    cleaningExpense: '',
    sundryExpense: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addEntry(formData));
    // No navigation on submit
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Add New Petty Cash Entry</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="receipt">
              Receipt
            </label>
            <div>
              <input
                id="receipt"
                type="text"
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter receipt"
                value={formData.receipt}
                onChange={(e) => setFormData({ ...formData, receipt: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="date">
              Date
            </label>
            <div>
              <input
                id="date"
                type="date"
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="details">
              Details
            </label>
            <div>
              <input
                id="details"
                type="text"
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter details"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="voucherNumber">
              Voucher Number
            </label>
            <div>
              <input
                id="voucherNumber"
                type="text"
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter voucher number"
                value={formData.voucherNumber}
                onChange={(e) => setFormData({ ...formData, voucherNumber: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="total">
              Total
            </label>
            <div>
              <input
                id="total"
                type="text"
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter total"
                value={formData.total}
                onChange={(e) => setFormData({ ...formData, total: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="officeExpense">
              Office Expense
            </label>
            <div>
              <input
                id="officeExpense"
                type="text"
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter office expense"
                value={formData.officeExpense}
                onChange={(e) => setFormData({ ...formData, officeExpense: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="vanExpense">
              Van Expense
            </label>
            <div>
              <input
                id="vanExpense"
                type="text"
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter van expense"
                value={formData.vanExpense}
                onChange={(e) => setFormData({ ...formData, vanExpense: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="cleaningExpense">
              Cleaning Expense
            </label>
            <div>
              <input
                id="cleaningExpense"
                type="text"
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter cleaning expense"
                value={formData.cleaningExpense}
                onChange={(e) => setFormData({ ...formData, cleaningExpense: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="sundryExpense">
              Sundry Expense
            </label>
            <div>
              <input
                id="sundryExpense"
                type="text"
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter sundry expense"
                value={formData.sundryExpense}
                onChange={(e) => setFormData({ ...formData, sundryExpense: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-colors duration-300"
            type="submit"
          >
            Add Entry
          </button>
          <button
            type="button"
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors duration-300"
            onClick={() => navigate('/pettycash-view')}
          >
            View Petty Cash
          </button>
        </div>
      </form>
    </div>
  );
}

export default PettyCashForm;

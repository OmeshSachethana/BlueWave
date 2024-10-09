import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addEntry } from '../../features/pettyCash/pettyCashSlice';
import { useNavigate } from 'react-router-dom';

function PettyCashForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    receipt: '',
    date: '',
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
    dispatch(addEntry(formData)).then(() => {
      navigate('/');
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Add New Petty Cash Entry</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['receipt', 'date', 'details', 'voucherNumber', 'total', 'officeExpense', 'vanExpense', 'cleaningExpense', 'sundryExpense'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize" htmlFor={field}>
                {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </label>
              <input
                id={field}
                type="text"
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter ${field}`}
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-colors duration-300"
            type="submit"
          >
            Add Entry
          </button>
        </div>
      </form>
    </div>
  );
}

export default PettyCashForm;

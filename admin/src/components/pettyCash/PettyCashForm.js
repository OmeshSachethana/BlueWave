import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addEntry } from '../features/pettyCash/pettyCashSlice';
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
    <div>
      <h2 className="text-xl font-bold mb-4">Add New Petty Cash Entry</h2>
      <form className="mb-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          {['receipt', 'date', 'details', 'voucherNumber', 'total', 'officeExpense', 'vanExpense', 'cleaningExpense', 'sundryExpense'].map((field) => (
            <input
              key={field}
              type="text"
              className="border p-2 rounded w-full"
              placeholder={field}
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            />
          ))}
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" type="submit">
          Add Entry
        </button>
      </form>
    </div>
  );
}

export default PettyCashForm;

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addRecord, updateRecord } from '../../features/incomeExpenditure/incomeExpenditureSlice';

const IncomeExpenditureForm = ({ isEdit, currentRecord, onCancel }) => {
  const [formData, setFormData] = useState({
    no: '',
    date: '',
    details: '',
    income: '',
    expenses: '',
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (isEdit && currentRecord) {
      // Ensure date is in YYYY-MM-DD format
      const formattedDate = new Date(currentRecord.date).toISOString().split('T')[0];
      setFormData({
        no: currentRecord.no,
        date: formattedDate,
        details: currentRecord.details,
        income: currentRecord.income,
        expenses: currentRecord.expenses,
      });
    } else {
      setFormData({
        no: '',
        date: '',
        details: '',
        income: '',
        expenses: '',
      });
    }
  }, [isEdit, currentRecord]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const profit = formData.income - formData.expenses;

    if (isEdit) {
      await dispatch(updateRecord({ ...formData, profit }));
    } else {
      await dispatch(addRecord({ ...formData, profit }));
    }

    // Reset form after submission
    setFormData({
      no: '',
      date: '',
      details: '',
      income: '',
      expenses: '',
    });
    onCancel(); // Clear the edit mode and current record after submission
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium">NO</label>
        <input
          type="number"
          name="no"
          value={formData.no}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Details</label>
        <input
          type="text"
          name="details"
          value={formData.details}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Income</label>
        <input
          type="number"
          name="income"
          value={formData.income}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Expenses</label>
        <input
          type="number"
          name="expenses"
          value={formData.expenses}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        {isEdit ? 'Update' : 'Add'} Record
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="ml-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
      >
        Cancel
      </button>
    </form>
  );
};

export default IncomeExpenditureForm;

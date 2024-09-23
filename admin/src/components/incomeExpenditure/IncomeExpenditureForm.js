import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRecord, updateRecord } from '../../features/incomeExpenditure/incomeExpenditureSlice';

const IncomeExpenditureForm = ({ isEdit, currentRecord, onCancel }) => {
  const [formData, setFormData] = useState({
    no: '',
    date: '',
    details: '',
    income: '',
    expenses: '',
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const records = useSelector((state) => state.incomeExpenditure.records); // Assuming records are stored in state

  useEffect(() => {
    if (isEdit && currentRecord) {
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

  const validate = () => {
    const newErrors = {};
    const { no, date, details, income, expenses } = formData;

    // Required fields
    if (!no) newErrors.no = 'No is required.';
    if (!date) newErrors.date = 'Date is required.';
    if (!details) newErrors.details = 'Details are required.';
    if (!income) newErrors.income = 'Income is required.';
    if (!expenses) newErrors.expenses = 'Expenses are required.';

    // Numeric validations
    if (income < 0) newErrors.income = 'Income must be a positive number.';
    if (expenses < 0) newErrors.expenses = 'Expenses must be a positive number.';

    // Unique 'no' validation
    if (!isEdit && records.some(record => record.no === Number(no))) {
      newErrors.no = 'Record with this No already exists.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return; // Stop submission if validation fails

    const profit = formData.income - formData.expenses;

    if (isEdit) {
      await dispatch(updateRecord({ id: currentRecord._id, updatedRecord: { ...formData, profit } }));
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
    setErrors({ ...errors, [e.target.name]: null }); // Clear error for that field
  };

  return (
    <div className="max-w-md mx-auto bg-blue-100 p-8 rounded shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">{isEdit ? 'Edit Record' : 'Add New Record'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">No</label>
          <input
            type="number"
            name="no"
            value={formData.no}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.no ? 'border-red-500' : ''}`}
            required
          />
          {errors.no && <p className="text-red-500 text-xs">{errors.no}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.date ? 'border-red-500' : ''}`}
            required
          />
          {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Details</label>
          <input
            type="text"
            name="details"
            value={formData.details}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.details ? 'border-red-500' : ''}`}
            required
          />
          {errors.details && <p className="text-red-500 text-xs">{errors.details}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Income</label>
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.income ? 'border-red-500' : ''}`}
              required
            />
            {errors.income && <p className="text-red-500 text-xs">{errors.income}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expenses</label>
            <input
              type="number"
              name="expenses"
              value={formData.expenses}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.expenses ? 'border-red-500' : ''}`}
              required
            />
            {errors.expenses && <p className="text-red-500 text-xs">{errors.expenses}</p>}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
          >
            {isEdit ? 'Update' : 'Add'} Record
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="ml-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition w-full"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncomeExpenditureForm;

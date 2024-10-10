import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { addRecord } from '../../features/incomeExpenditure/incomeExpenditureSlice';

const IncomeExpenditureForm = ({ isEdit, currentRecord }) => {
  const [formData, setFormData] = useState({
    no: '',
    date: '',
    details: '',
    income: '',
    expenses: '',
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const records = useSelector((state) => state.incomeExpenditure.records);
  const navigate = useNavigate(); // Initialize useNavigate

  // useEffect(() => {
  //   if (isEdit && currentRecord) {
  //     const formattedDate = new Date(currentRecord.date).toISOString().split('T')[0];
  //     setFormData({
  //       no: currentRecord.no,
  //       date: formattedDate,
  //       details: currentRecord.details,
  //       income: currentRecord.income,
  //       expenses: currentRecord.expenses,
  //     });
  //   } else {
  //     setFormData({
  //       no: '',
  //       date: '',
  //       details: '',
  //       income: '',
  //       expenses: '',
  //     });
  //   }
  // }, [isEdit, currentRecord]);

  const validate = () => {
    const newErrors = {};
    const { no, date, details, income, expenses } = formData;

    if (!no) newErrors.no = 'No is required.';
    if (no < 0) newErrors.no = 'No cannot be negative.';
    if (!date) newErrors.date = 'Date is required.';
    if (!details) newErrors.details = 'Details are required.';
    if (!income && !expenses) newErrors.income = 'Either income or expenses must be provided.';

    if (income < 0) newErrors.income = 'Income must be a positive number.';
    if (expenses < 0) newErrors.expenses = 'Expenses must be a positive number.';

    if (!isEdit && records.some(record => record.no === Number(no))) {
      newErrors.no = 'Record with this No already exists.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const profit = formData.income - formData.expenses;

    await dispatch(addRecord({ ...formData, profit }));

    setFormData({
      no: '',
      date: '',
      details: '',
      income: '',
      expenses: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'income' && value !== '') {
      setFormData((prevState) => ({ ...prevState, expenses: '' }));
    }

    if (name === 'expenses' && value !== '') {
      setFormData((prevState) => ({ ...prevState, income: '' }));
    }

    setErrors({ ...errors, [name]: null });
  };

  return (
    <div className="max-w-md mx-auto bg-blue-100 p-8 rounded shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Add New Record</h2>
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
              required={!formData.expenses}
              disabled={!!formData.expenses} // Disable if expenses is filled
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
              required={!formData.income}
              disabled={!!formData.income} // Disable if income is filled
            />
            {errors.expenses && <p className="text-red-500 text-xs">{errors.expenses}</p>}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
          >
            Add Record
          </button>
        </div>
      </form>
      {/* Add the View Statement button */}
      <div className="mt-4">
        <button
          onClick={() => navigate('/in-exp-table')} // Navigate to the in-ex-table route
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-full"
        >
          View Statement
        </button>
      </div>
    </div>
  );
};

export default IncomeExpenditureForm;

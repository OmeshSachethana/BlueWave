import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addRecord, updateRecord } from '../features/incomeExpenditureSlice';

const IncomeExpenditureForm = ({ isEdit, currentRecord, closeForm }) => {
    const [formData, setFormData] = useState(
        isEdit ? currentRecord : { no: '', date: '', details: '', income: '', expenses: '' }
    );
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            dispatch(updateRecord({ id: currentRecord._id, updatedRecord: formData }));
        } else {
            dispatch(addRecord(formData));
        }
        closeForm();
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="mb-4">
                <label className="block text-gray-700">No:</label>
                <input
                    type="number"
                    name="no"
                    value={formData.no}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Date:</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Details:</label>
                <input
                    type="text"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Income:</label>
                <input
                    type="number"
                    name="income"
                    value={formData.income}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Expenses:</label>
                <input
                    type="number"
                    name="expenses"
                    value={formData.expenses}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
                {isEdit ? 'Update Record' : 'Add Record'}
            </button>
        </form>
    );
};

export default IncomeExpenditureForm;

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecords, deleteRecord, updateRecord } from '../../features/incomeExpenditure/incomeExpenditureSlice';
import { useNavigate } from 'react-router-dom';

const IncomeExpenditureTable = ({ onEdit }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Add useNavigate hook
    const records = useSelector((state) => state.incomeExpenditure.records);
    const [searchTerm, setSearchTerm] = useState('');
    const [editableRow, setEditableRow] = useState(null);
    const [editableData, setEditableData] = useState({});

    useEffect(() => {
        dispatch(fetchRecords());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteRecord(id));
    };

    const { totalIncome, totalExpenses, totalProfit } = useMemo(() => {
        return records.reduce((totals, record) => {
            const income = record.income || 0;
            const expenses = record.expenses || 0;
            const profit = record.profit || 0;
            return {
                totalIncome: totals.totalIncome + income,
                totalExpenses: totals.totalExpenses + expenses,
                totalProfit: totals.totalProfit + profit,
            };
        }, { totalIncome: 0, totalExpenses: 0, totalProfit: 0 });
    }, [records]);

    const filteredRecords = records.filter(record =>
        record.details.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditClick = (record) => {
        setEditableRow(record._id);
        setEditableData(record);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableData({
            ...editableData,
            [name]: value,
        });
    };

    const handleUpdate = () => {
        const profit = editableData.income - editableData.expenses;
        dispatch(updateRecord({ id: editableData._id, updatedRecord: { ...editableData, profit } }));
        setEditableRow(null); // Exit edit mode
    };

    return (
        <div className="container mx-auto mt-8">
            {/* Back Button */}
            <button
                onClick={() => navigate('/income-expenditure')}
                className="bg-gray-500 text-white px-3 py-2 rounded mb-4"
            >
                Back
            </button>

            <h2 className="text-2xl font-bold mb-6">Income & Expenditure Statement</h2>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Details"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-1/2 p-2 border border-gray-300 rounded"
                />
            </div>

            <table className="table-auto w-full text-left">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2">NO</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Details</th>
                        <th className="px-4 py-2">Income</th>
                        <th className="px-4 py-2">Expenses</th>
                        <th className="px-4 py-2">Profit/Loss</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRecords.map((record, index) => (
                        <tr key={record._id} className="border-t">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                            <td className="px-4 py-2">
                                {editableRow === record._id ? (
                                    <input
                                        type="text"
                                        name="details"
                                        value={editableData.details}
                                        onChange={handleInputChange}
                                        className="border p-1 rounded"
                                    />
                                ) : (
                                    record.details
                                )}
                            </td>
                            <td className="px-4 py-2">
                                {editableRow === record._id ? (
                                    <input
                                        type="number"
                                        name="income"
                                        value={editableData.income}
                                        onChange={handleInputChange}
                                        className="border p-1 rounded"
                                    />
                                ) : (
                                    record.income
                                )}
                            </td>
                            <td className="px-4 py-2">
                                {editableRow === record._id ? (
                                    <input
                                        type="number"
                                        name="expenses"
                                        value={editableData.expenses}
                                        onChange={handleInputChange}
                                        className="border p-1 rounded"
                                    />
                                ) : (
                                    record.expenses
                                )}
                            </td>
                            <td className="px-4 py-2">
                                {editableRow === record._id ? (
                                    <span>
                                        {editableData.income - editableData.expenses}
                                    </span>
                                ) : (
                                    record.profit
                                )}
                            </td>
                            <td className="px-4 py-2">
                                {editableRow === record._id ? (
                                    <button
                                        onClick={handleUpdate}
                                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleEditClick(record)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(record._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-200 font-bold">
                        <td className="px-4 py-2" colSpan="3">Total</td>
                        <td className="px-4 py-2">{totalIncome}</td>
                        <td className="px-4 py-2">{totalExpenses}</td>
                        <td className="px-4 py-2">{totalProfit}</td>
                        <td className="px-4 py-2"></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default IncomeExpenditureTable;

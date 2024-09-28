import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecords, deleteRecord } from '../../features/incomeExpenditure/incomeExpenditureSlice';

const IncomeExpenditureTable = ({ onEdit }) => {
    const dispatch = useDispatch();
    const records = useSelector((state) => state.incomeExpenditure.records);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    useEffect(() => {
        dispatch(fetchRecords());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteRecord(id));
    };

    // Calculate total income, expenses, and profit
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

    // Filter records based on search term
    const filteredRecords = records.filter(record =>
        record.details.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6">Income & Expenditure Statement</h2>

            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Details"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-1/2 p-2 border border-gray-300 rounded" // Adjust width as needed
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
                            <td className="px-4 py-2">{record.details}</td>
                            <td className="px-4 py-2">{record.income}</td>
                            <td className="px-4 py-2">{record.expenses}</td>
                            <td className="px-4 py-2">{}</td>
                            <td className="px-4 py-2">
                                <button 
                                  onClick={() => onEdit(record)}
                                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                >
                                  Edit
                                </button>
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

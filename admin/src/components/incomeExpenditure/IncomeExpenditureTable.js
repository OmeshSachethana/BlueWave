import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecords, deleteRecord } from '../features/incomeExpenditureSlice';

const IncomeExpenditureTable = () => {
    const dispatch = useDispatch();
    const records = useSelector((state) => state.incomeExpenditure.records);

    useEffect(() => {
        dispatch(fetchRecords());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteRecord(id));
    };

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6">Income & Expenditure Statement</h2>
            <table className="table-auto w-full text-left">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2">NO</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Details</th>
                        <th className="px-4 py-2">Income</th>
                        <th className="px-4 py-2">Expenses</th>
                        <th className="px-4 py-2">Profit</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, index) => (
                        <tr key={record._id} className="border-t">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                            <td className="px-4 py-2">{record.details}</td>
                            <td className="px-4 py-2">{record.income}</td>
                            <td className="px-4 py-2">{record.expenses}</td>
                            <td className="px-4 py-2">{record.profit}</td>
                            <td className="px-4 py-2">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Edit</button>
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
            </table>
        </div>
    );
};

export default IncomeExpenditureTable;

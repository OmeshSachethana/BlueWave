import React, { useState } from 'react';
import IncomeExpenditureForm from '../../components/incomeExpenditure/IncomeExpenditureForm';
import IncomeExpenditureTable from '../../components/incomeExpenditure/IncomeExpenditureTable';
import { useSelector } from 'react-redux';
import { downloadCSV } from '../../utils/downloadUtils'; // Import the utility function

const IncomeExpenditurePage = () => {
    const [currentRecord, setCurrentRecord] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const records = useSelector((state) => state.incomeExpenditure.records);

    const handleEdit = (record) => {
        setCurrentRecord(record);
        setIsEdit(true);
    };

    const handleCancelEdit = () => {
        setCurrentRecord(null);
        setIsEdit(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Income and Expenditure Management</h1>

            {/* Form for adding income/expenditure */}
            <div className="mb-8">
                <IncomeExpenditureForm 
                    isEdit={isEdit}
                    currentRecord={currentRecord}
                    onCancel={handleCancelEdit}
                />
            </div>

            {/* Download button */}
            <div className="mb-4 text-center">
                <button
                    onClick={() => downloadCSV(records)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                    Download Report
                </button>
            </div>

            {/* Table displaying the records */}
            <div>
                <IncomeExpenditureTable onEdit={handleEdit} />
            </div>
        </div>
    );
};

export default IncomeExpenditurePage;

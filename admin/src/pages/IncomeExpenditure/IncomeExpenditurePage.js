import React, { useState } from 'react';
import IncomeExpenditureForm from '../../components/incomeExpenditure/IncomeExpenditureForm';
import IncomeExpenditureTable from '../../components/incomeExpenditure/IncomeExpenditureTable';

const IncomeExpenditurePage = () => {
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

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

      {/* Table displaying the records */}
      <div>
        <IncomeExpenditureTable onEdit={handleEdit} />
      </div>
    </div>
  );
};

export default IncomeExpenditurePage;

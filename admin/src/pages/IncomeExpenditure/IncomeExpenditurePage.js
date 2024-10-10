import React from 'react';
import IncomeExpenditureForm from '../../components/incomeExpenditure/IncomeExpenditureForm';

const IncomeExpenditurePage = () => {

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Income and Expenditure Management</h1>

            {/* Form for adding income/expenditure */}
            <div className="mb-8">
                <IncomeExpenditureForm />
            </div>            
        </div>
    );
};

export default IncomeExpenditurePage;

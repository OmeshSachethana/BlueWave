import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployeeSalary } from '../features/employee/salarySlice';

const EmployeeSalaryForm = () => {
  const dispatch = useDispatch();
  const { status, error, salaryDetails } = useSelector((state) => state.salary);

  const [formData, setFormData] = useState({
    employeeID: '',
    employeeName: '',
    basicSalary: '',
    allowances: '',
    overtimeHours: '',
    overtimeRate: '',
    deductions: '',
    epfRate: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const salaryData = {
      employeeID: formData.employeeID,
      basicSalary: parseFloat(formData.basicSalary),
      allowances: parseFloat(formData.allowances),
      overtimeHours: parseFloat(formData.overtimeHours),
      overtimeRate: parseFloat(formData.overtimeRate),
      deductions: parseFloat(formData.deductions),
      epfRate: parseFloat(formData.epfRate),
    };
    dispatch(createEmployeeSalary(salaryData));
  };

  const calculateGrossSalary = () => {
    const basicSalary = parseFloat(formData.basicSalary) || 0;
    const allowances = parseFloat(formData.allowances) || 0;
    const overtimeHours = parseFloat(formData.overtimeHours) || 0;
    const overtimeRate = parseFloat(formData.overtimeRate) || 0;
    return basicSalary + allowances + (overtimeHours * overtimeRate);
  };

  const calculateEPFContribution = () => {
    const grossSalary = calculateGrossSalary();
    const epfRate = parseFloat(formData.epfRate) || 0;
    return (grossSalary * epfRate) / 100;
  };

  const calculateTotalDeductions = () => {
    const deductions = parseFloat(formData.deductions) || 0;
    return deductions + calculateEPFContribution();
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-blue-100 rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Employee Salary Calculation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['employeeID', 'employeeName', 'basicSalary', 'allowances', 'overtimeHours', 'overtimeRate', 'deductions', 'epfRate'].map((field) => (
          <div key={field}>
            <label className="block text-gray-700">{field.replace(/([A-Z])/g, ' $1')}:</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      {/* Display salary details */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Salary Details</h2>
        {status === 'loading' && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {status === 'succeeded' && (
          <div>
            <p><strong>Gross Salary:</strong> ${calculateGrossSalary().toFixed(2)}</p>
            <p><strong>EPF Contribution:</strong> ${calculateEPFContribution().toFixed(2)}</p>
            <p><strong>Total Deductions:</strong> ${calculateTotalDeductions().toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSalaryForm;

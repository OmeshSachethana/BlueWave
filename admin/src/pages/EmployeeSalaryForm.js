import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployeeSalary, updateEmployeeSalary, deleteEmployeeSalary, fetchEmployeeSalaries } from '../features/employee/salarySlice';
import { convertToCSV, downloadCSV } from '../utils/salaryUtils';

const EmployeeSalaryForm = () => {
  const dispatch = useDispatch();
  const { salaryList, status, error } = useSelector((state) => state.salary);

  const [formData, setFormData] = useState({
    employeeID: '',
    basicSalary: '',
    allowances: '',
    overtimeHours: '',
    overtimeRate: '',
    deductions: '',
    epfRate: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Added search term state

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    dispatch(fetchEmployeeSalaries());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const netSalary = calculateNetSalary();
    const salaryData = {
      employeeID: formData.employeeID,
      basicSalary: parseFloat(formData.basicSalary),
      allowances: parseFloat(formData.allowances),
      overtimeHours: parseFloat(formData.overtimeHours),
      overtimeRate: parseFloat(formData.overtimeRate),
      deductions: parseFloat(formData.deductions),
      epfRate: parseFloat(formData.epfRate),
      netSalary,
    };
    if (isEditing) {
      dispatch(updateEmployeeSalary(salaryData));
      setIsEditing(false);
    } else {
      dispatch(createEmployeeSalary(salaryData));
    }
    setFormData({
      employeeID: '',
      basicSalary: '',
      allowances: '',
      overtimeHours: '',
      overtimeRate: '',
      deductions: '',
      epfRate: '',
    });
  };

  const handleEdit = (employee) => {
    setFormData({
      employeeID: employee.employeeID,
      basicSalary: employee.basicSalary,
      allowances: employee.allowances,
      overtimeHours: employee.overtimeHours,
      overtimeRate: employee.overtimeRate,
      deductions: employee.deductions,
      epfRate: employee.epfRate,
    });
    setIsEditing(true);
  };

  const handleDelete = (employeeID) => {
    dispatch(deleteEmployeeSalary(employeeID));
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

  const calculateNetSalary = () => {
    const grossSalary = calculateGrossSalary();
    const totalDeductions = calculateTotalDeductions();
    return grossSalary - totalDeductions;
  };

  const handleDownloadReport = () => {
    const headers = ['employeeID', 'basicSalary', 'allowances', 'overtimeHours', 'overtimeRate', 'deductions', 'epfRate', 'netSalary'];
    const csvContent = convertToCSV(salaryList, headers);
    downloadCSV(csvContent, 'employee_salary_report.csv');
  };

  const filteredSalaryList = salaryList.filter(employee =>
    employee.employeeID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-lg mx-auto bg-blue-100 p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Employee Salary Calculation</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['employeeID', 'basicSalary', 'allowances', 'overtimeHours', 'overtimeRate', 'deductions', 'epfRate'].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}:</label>
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
            {isEditing ? 'Update' : 'Submit'}
          </button>
        </form>
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Salary Details</h2>
          {status === 'loading' && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {status === 'succeeded' && (
            <div>
              <p><strong>Gross Salary:</strong> ${calculateGrossSalary().toFixed(2)}</p>
              <p><strong>EPF Contribution:</strong> ${calculateEPFContribution().toFixed(2)}</p>
              <p><strong>Total Deductions:</strong> ${calculateTotalDeductions().toFixed(2)}</p>
              <p><strong>Net Salary:</strong> ${calculateNetSalary().toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-center mb-6">Employee Salary Records</h2>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Employee ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-2 border border-gray-300">EID</th>
                <th className="p-2 border border-gray-300">Basic Salary</th>
                <th className="p-2 border border-gray-300">Allowances</th>
                <th className="p-2 border border-gray-300">OT Hours</th>
                <th className="p-2 border border-gray-300">OT Rate</th>
                <th className="p-2 border border-gray-300">Deductions</th>
                <th className="p-2 border border-gray-300">EPF Rate</th>
                <th className="p-2 border border-gray-300">Net Salary</th>
                <th className="p-2 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalaryList.length > 0 ? (
                filteredSalaryList.map((employee) => (
                  <tr key={employee.employeeID} className="text-center">
                    <td className="p-2 border border-gray-300">{employee.employeeID}</td>
                    <td className="p-2 border border-gray-300">{employee.basicSalary}</td>
                    <td className="p-2 border border-gray-300">{employee.allowances}</td>
                    <td className="p-2 border border-gray-300">{employee.overtimeHours}</td>
                    <td className="p-2 border border-gray-300">{employee.overtimeRate}</td>
                    <td className="p-2 border border-gray-300">{employee.deductions}</td>
                    <td className="p-2 border border-gray-300">{employee.epfRate}</td>
                    <td className="p-2 border border-gray-300">{employee.netSalary}</td>
                    <td className="p-2 border border-gray-300">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee.employeeID)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="p-4 text-center text-gray-500">
                    No employee salary records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleDownloadReport}
          className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
        >
          Download Salary Report as CSV
        </button>
      </div>
    </div>
  );
};

export default EmployeeSalaryForm;

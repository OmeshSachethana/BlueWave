import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployeeSalary, updateEmployeeSalary, deleteEmployeeSalary, fetchEmployeeSalaries } from '../features/employee/salarySlice';
import { convertToCSV, downloadCSV } from '../utils/salaryUtils';
import jsPDF from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import autoTable for table support
import logo from '../assets/bluewave_logo.png'; // Adjust the path to your logo image

const EmployeeSalaryForm = () => {
  const dispatch = useDispatch();
  const { salaryList, status, error } = useSelector((state) => state.salary);
  const [employees, setEmployees] = useState([]); // State for employee dropdown
  const [formData, setFormData] = useState({
    employeeID: '',
    basicSalary: '',
    allowances: '',
    overtimeHours: '',
    overtimeRate: '',
    deductions: '',
    epfRate: '9', //default
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Added search term state
  const [formErrors, setFormErrors] = useState({}); // For form validation errors
  const [duplicateError, setDuplicateError] = useState(''); 

  // Fetch employees for the dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employees'); // Adjust the API endpoint as necessary
        const data = await response.json();
        
        // Access the employees array from the response object
        if (Array.isArray(data.employees)) {
          setEmployees(data.employees);
        } else {
          console.error('Expected employees to be an array, but got:', data.employees);
          setEmployees([]); // Reset to empty array in case of unexpected format
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        setEmployees([]); // Reset to empty array on error
      }
    };
  
    fetchEmployees();
    dispatch(fetchEmployeeSalaries());
  }, [dispatch]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'employeeID') {
      const selectedEmployee = employees.find(emp => emp.employeeID === value);
      if (selectedEmployee) {
        setFormData({
          ...formData,
          employeeID: value,
          basicSalary: selectedEmployee.basicSalary, // Automatically fill basic salary
        });
      } else {
        setFormData({
          ...formData,
          employeeID: value,
          basicSalary: '', // Reset basic salary if employee is not found
        });
      }
    } else {
      // Validate numeric fields
      if (['basicSalary', 'allowances', 'overtimeHours', 'overtimeRate', 'deductions', 'epfRate'].includes(name)) {
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
          setFormData({
            ...formData,
            [name]: value,
          });
        }
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    // Employee ID validation
    const employeeIDPattern = /^E\d{5}$/;
    if (!formData.employeeID) {
      errors.employeeID = 'Employee ID is required';
    } else if (!employeeIDPattern.test(formData.employeeID)) {
      errors.employeeID = 'Employee ID must start with "E" followed by 5 digits';
    }

    // Other validations
    if (!formData.basicSalary || parseFloat(formData.basicSalary) <= 0) 
      errors.basicSalary = 'Basic salary must be a positive number';
    if (!formData.allowances || parseFloat(formData.allowances) < 0) 
      errors.allowances = 'Allowances cannot be negative';
    if (!formData.overtimeHours || parseFloat(formData.overtimeHours) < 0) 
      errors.overtimeHours = 'Overtime hours cannot be negative';
    if (!formData.overtimeRate || parseFloat(formData.overtimeRate) <= 0) 
      errors.overtimeRate = 'Overtime rate must be a positive number';
    if (!formData.deductions || parseFloat(formData.deductions) < 0) 
      errors.deductions = 'Deductions cannot be negative';
    if (!formData.epfRate || parseFloat(formData.epfRate) < 0) 
      errors.epfRate = 'EPF rate cannot be negative';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!validateForm()) return; // Prevent form submission if validation fails
  
    // Check if the employee ID already exists in the salary list when adding a new employee
    if (!isEditing) {
      const existingEmployee = salaryList.find(emp => emp.employeeID === formData.employeeID);
      if (existingEmployee) {
        setFormErrors({ employeeID: `Employee ID ${formData.employeeID} is already added` });
        return; // Prevent form submission if employee ID is already added
      }
    }
  
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
  
    // Clear form data after submission
    setFormData({
      employeeID: '',
      basicSalary: '',
      allowances: '',
      overtimeHours: '',
      overtimeRate: '',
      deductions: '',
      epfRate: '',
    });
  
    // Clear form errors after successful submission
    setFormErrors({});

    // Clear duplicate error message
    setDuplicateError('');
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
    const basicSalary = parseFloat(formData.basicSalary) || 0; // EPF based on basic salary only
    const epfRate = parseFloat(formData.epfRate) || 0;
    return (basicSalary * epfRate) / 100;
  };

  const calculateTotalDeductions = () => {
    const deductions = parseFloat(formData.deductions) || 0;
    return deductions + calculateEPFContribution(); // Total deductions including EPF
  };

  const calculateNetSalary = () => {
    const grossSalary = calculateGrossSalary();
    const totalDeductions = calculateTotalDeductions();
    return grossSalary - totalDeductions; // Net salary after deductions
  };  

  const handleDownloadReport = () => {
    const headers = ['employeeID', 'basicSalary', 'allowances', 'overtimeHours', 'overtimeRate', 'deductions', 'epfRate', 'netSalary'];
    const csvContent = convertToCSV(salaryList, headers);
    downloadCSV(csvContent, 'employee_salary_report.csv');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
  
    // Logo properties
    const logoWidth = 50; // Width of the logo
    const logoHeight = 20; // Height of the logo
  
    // Centering the logo
    const pageWidth = doc.internal.pageSize.getWidth(); // Get PDF page width
    const logoX = (pageWidth - logoWidth) / 2; // Calculate x position for centering
  
    // Add logo at the top
    doc.addImage(logo, 'PNG', logoX, 10, logoWidth, logoHeight);
  
    // Add title below the logo, centered
    doc.setFontSize(18);
    doc.text('Employee Salary Report', pageWidth / 2, 40, { align: 'center' });
  
    // Get the current date and time for the report generation date
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString(); // Format date and time
  
    // Add date of report generation below the title
    doc.setFontSize(12);
    doc.text(`Report generated on: ${formattedDate}`, 14, 50); // Adjust X and Y position as needed
  
    // Define the table columns
    const tableColumn = [
      'Employee ID',
      'Basic Salary',
      'Allowances',
      'Overtime Hours',
      'Overtime Rate',
      'Deductions',
      'EPF Rate',
      'Net Salary'
    ];
  
    // Map through the salary list to populate the table rows
    const tableRows = salaryList.map((employee) => [
      employee.employeeID,
      employee.basicSalary,
      employee.allowances,
      employee.overtimeHours,
      employee.overtimeRate,
      employee.deductions,
      employee.epfRate,
      employee.netSalary,
    ]);
  
    // Add the table to the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60, // Adjust startY to avoid overlapping with title and date
      styles: { fontSize: 9 }, // Set the font size of the table content to 9
      headStyles: { fontSize: 10 } // Set the header font size to 10
    });
  
    // Save the generated PDF
    doc.save('employee_salary_report.pdf');
  };
  

  const filteredSalaryList = salaryList.filter(employee =>
    employee.employeeID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-lg mx-auto bg-blue-100 p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Employee Salary Calculation</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Employee ID:</label>
            <select
              name="employeeID"
              value={formData.employeeID}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.employeeID} value={employee.employeeID}>
                  {employee.employeeID}
                </option>
              ))}
            </select>
            {formErrors.employeeID && <span className="text-red-500 text-sm">{formErrors.employeeID}</span>}
          </div>
          {duplicateError && <span className="text-red-500 text-sm">{duplicateError}</span>}
          {['basicSalary', 'allowances', 'overtimeHours', 'overtimeRate', 'deductions', 'epfRate'].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}:</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
              {formErrors[field] && <span className="text-red-500 text-sm">{formErrors[field]}</span>}
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
              <p><strong>Gross Salary:</strong> Rs. {calculateGrossSalary().toFixed(2)}</p>
              <p><strong>EPF Contribution:</strong> Rs. {calculateEPFContribution().toFixed(2)}</p>
              <p><strong>Total Deductions:</strong> Rs. {calculateTotalDeductions().toFixed(2)}</p>
              <p><strong>Net Salary:</strong> Rs. {calculateNetSalary().toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-center mb-6">Employee Salary Records</h2>
        
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Employee ID"
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
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
              {filteredSalaryList.map((employee) => (
                <tr key={employee.employeeID}>
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
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Download CSV
          </button> <br /><br />
          <button onClick={handleDownloadPDF} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSalaryForm;

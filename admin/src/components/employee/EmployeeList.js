import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../features/employee/employeeSlice';
import EmployeeItem from './EmployeeItem';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const EmployeeList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.employees);
  const status = useSelector((state) => state.employees.status);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEmployees());
    }
  }, [status, dispatch]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesFilter = filter === 'All' || employee.department === filter;
    const matchesSearch = employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Generate PDF using jsPDF and autoTable
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Employee List', 105, 20, { align: 'center' });

    const tableColumn = ['EID', 'First Name', 'Last Name', 'Position', 'Department', 'Gender', 'NIC', 'Email', 'Basic Salary'];
    const tableRows = filteredEmployees.map((employee) => [
      employee.employeeID || employee._id, // If 'eid' does not exist, use '_id' instead
      employee.firstName, 
      employee.lastName, 
      employee.position, 
      employee.department, 
      employee.gender, 
      employee.nic, 
      employee.email, 
      employee.basicSalary
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 8 },  // Set table font size to 10
      headStyles: { fontSize: 11 }  // Optionally, you can set the header font size slightly larger
    });

    doc.save('employee-list.pdf');
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-center mb-4">View Employees</h2>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search by Name" 
          value={searchTerm} 
          onChange={handleSearchChange} 
          className="p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="department-filter" className="mr-2">Filter by Department:</label>
        <select id="department-filter" value={filter} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded">
          <option value="All">All</option>
          <option value="Sales">Sales</option>
          <option value="HR">HR</option>
          <option value="Marketing">Marketing</option>
          <option value="Production">Production</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      <div className="mb-4">
        <button onClick={handleDownloadPDF} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          Download as PDF
        </button>
      </div>

      <table id="employee-table" className="table-auto w-full border-collapse bg-gray-50 shadow-lg">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-2 border border-gray-300">EID</th>
            <th className="p-2 border border-gray-300">First Name</th>
            <th className="p-2 border border-gray-300">Last Name</th>
            <th className="p-2 border border-gray-300">Position</th>
            <th className="p-2 border border-gray-300">Department</th>
            <th className="p-2 border border-gray-300">Gender</th>
            <th className="p-2 border border-gray-300">NIC</th>
            <th className="p-2 border border-gray-300">Email</th>
            <th className="p-2 border border-gray-300">Basic Salary</th>
            <th className="p-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <EmployeeItem key={employee._id} employee={employee} onEdit={onEdit} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;

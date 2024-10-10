import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../features/employee/employeeSlice';
import EmployeeItem from './EmployeeItem';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  // pdf handling
  const handleDownloadPDF = () => {
    const input = document.getElementById('employee-table');
    const actionCells = document.querySelectorAll('#employee-table th:last-child, #employee-table td:last-child');
    actionCells.forEach(cell => cell.style.display = 'none');

    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 190;
        const pageHeight = 290;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 30;

        pdf.setFontSize(18);
        pdf.text('Employee List', 105, 20, { align: 'center' });

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('employee-list.pdf');
      })
      .finally(() => {
        actionCells.forEach(cell => cell.style.display = '');
      })
      .catch((err) => console.error('Failed to download PDF', err));
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
            <th className="p-2 border border-gray-300">Basic Salary</th> {/* Added Basic Salary */}
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

// src/components/employee/EmployeeList.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../features/employee/employeeSlice';
import EmployeeItem from './EmployeeItem';

const EmployeeList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.employees);
  const status = useSelector((state) => state.employees.status);
  const [filter, setFilter] = useState('All'); // Added filter state

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEmployees());
    }
  }, [status, dispatch]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredEmployees = filter === 'All' ? employees : employees.filter(employee => employee.department === filter);

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-center mb-4">View Employees</h2>
      <div className="mb-4">
        <label htmlFor="department-filter" className="mr-2">Filter by Department:</label>
        <select id="department-filter" value={filter} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded">
          <option value="All">All</option>
          <option value="HR">HR</option>
          <option value="Engineering">Engineering</option>
          <option value="Sales">Sales</option>
        </select>
      </div>
      <table className="table-auto w-full border-collapse bg-gray-50 shadow-lg">
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

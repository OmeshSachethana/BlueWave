// src/components/employee/EmployeeList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../features/employee/employeeSlice';
import EmployeeItem from './EmployeeItem';

const EmployeeList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.employees);
  const status = useSelector((state) => state.employees.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEmployees());
    }
  }, [status, dispatch]);

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">View Employees</h2>
      <table className="table-auto w-full border-collapse bg-gray-50 shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2">EID</th>
            <th className="px-4 py-2">First Name</th>
            <th className="px-4 py-2">Last Name</th>
            <th className="px-4 py-2">Position</th>
            <th className="px-4 py-2">Department</th>
            <th className="px-4 py-2">Gender</th>
            <th className="px-4 py-2">NIC</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <EmployeeItem key={employee._id} employee={employee} onEdit={onEdit} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;

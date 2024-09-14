// src/pages/Employee.js
import React, { useState } from 'react';
import EmployeeForm from '../components/employee/EmployeeForm';
import EmployeeList from '../components/employee/EmployeeList';

const Employee = () => {
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  // Handle the employee edit
  const handleEditEmployee = (employee) => {
    setEmployeeToEdit(employee);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl text-center font-bold mb-6">Employee Management</h1>
      
      {/* Employee Form */}
      <EmployeeForm employeeToEdit={employeeToEdit} />

      {/* Employee List */}
      <EmployeeList onEdit={handleEditEmployee} />
    </div>
  );
};

export default Employee;

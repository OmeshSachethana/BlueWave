// src/components/EmployeeForm.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addEmployee } from '../../features/employee/employeeSlice';

const EmployeeForm = () => {
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState({
    employeeID: '',
    firstName: '',
    lastName: '',
    position: '',
    department: '',
    gender: '',
    nic: '',
    email: ''
  });

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addEmployee(employee));
    setEmployee({
      employeeID: '',
      firstName: '',
      lastName: '',
      position: '',
      department: '',
      gender: '',
      nic: '',
      email: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="employeeID" value={employee.employeeID} onChange={handleChange} placeholder="Employee ID" />
      <input type="text" name="firstName" value={employee.firstName} onChange={handleChange} placeholder="First Name" />
      <input type="text" name="lastName" value={employee.lastName} onChange={handleChange} placeholder="Last Name" />
      <input type="text" name="position" value={employee.position} onChange={handleChange} placeholder="Position" />
      <input type="text" name="department" value={employee.department} onChange={handleChange} placeholder="Department" />
      <input type="text" name="gender" value={employee.gender} onChange={handleChange} placeholder="Gender" />
      <input type="text" name="nic" value={employee.nic} onChange={handleChange} placeholder="NIC" />
      <input type="email" name="email" value={employee.email} onChange={handleChange} placeholder="Email" />
      <button type="submit">Add Employee</button>
    </form>
  );
};

export default EmployeeForm;

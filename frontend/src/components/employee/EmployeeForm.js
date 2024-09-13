import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addEmployee, updateEmployee } from '../../features/employee/employeeSlice';

const EmployeeForm = ({ employeeToEdit }) => {
  const dispatch = useDispatch();
  
  // Form state
  const [formData, setFormData] = useState({
    employeeID: '',
    firstName: '',
    lastName: '',
    position: '',
    department: '',
    gender: '',
    nic: '',
    email: '',
  });

  // Load employee data into the form if editing
  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        employeeID: employeeToEdit.employeeID || '',
        firstName: employeeToEdit.firstName || '',
        lastName: employeeToEdit.lastName || '',
        position: employeeToEdit.position || '',
        department: employeeToEdit.department || '',
        gender: employeeToEdit.gender || '',
        nic: employeeToEdit.nic || '',
        email: employeeToEdit.email || '',
      });
    }
  }, [employeeToEdit]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (employeeToEdit) {
      // If editing, update the employee
      dispatch(updateEmployee({ id: employeeToEdit._id, updatedEmployee: formData }));
    } else {
      // Otherwise, add a new employee
      dispatch(addEmployee(formData));
    }
    // Reset the form after submission
    setFormData({
      employeeID: '',
      firstName: '',
      lastName: '',
      position: '',
      department: '',
      gender: '',
      nic: '',
      email: '',
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-blue-100 p-6 rounded-lg">
      <h2 className="text-center text-2xl font-bold mb-4">
        {employeeToEdit ? 'Edit Employee' : 'Add New Employee'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-gray-700">Employee ID:</label>
          <input
            type="text"
            name="employeeId"
            className="w-full px-2 py-1 border rounded-md"
            value={formData.employeeID}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-gray-700">First Name:</label>
            <input
              type="text"
              name="firstName"
              className="w-full px-2 py-1 border rounded-md"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Last Name:</label>
            <input
              type="text"
              name="lastName"
              className="w-full px-2 py-1 border rounded-md"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-gray-700">Position:</label>
          <input
            type="text"
            name="position"
            className="w-full px-2 py-1 border rounded-md"
            value={formData.position}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700">Department:</label>
          <select
            name="department"
            className="w-full px-2 py-1 border rounded-md"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-gray-700">Gender:</label>
          <select
            name="gender"
            className="w-full px-2 py-1 border rounded-md"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-gray-700">NIC:</label>
          <input
            type="text"
            name="nic"
            className="w-full px-2 py-1 border rounded-md"
            value={formData.nic}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            className="w-full px-2 py-1 border rounded-md"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          {employeeToEdit ? 'Update' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;

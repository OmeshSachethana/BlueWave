import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addEmployee } from '../../features/employee/employeeSlice';

const EmployeeForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    position: '',
    department: '',
    gender: '',
    nic: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addEmployee(formData));
    setFormData({
      employeeId: '',
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
      <h2 className="text-center text-2xl font-bold mb-4">Add New Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-gray-700">Employee ID:</label>
          <input
            type="text"
            name="employeeID"
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
          Submit
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;

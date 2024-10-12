import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addEmployee, updateEmployee } from '../../features/employee/employeeSlice';

const EmployeeForm = ({ employeeToEdit }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    employeeID: '',
    firstName: '',
    lastName: '',
    position: '',
    department: '',
    gender: '',
    nic: '',
    email: '',
    basicSalary: '', // Added Basic Salary
  });

  const [errors, setErrors] = useState({});

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
        basicSalary: employeeToEdit.basicSalary || '', // Added Basic Salary
      });
    }
  }, [employeeToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only letters in firstName, lastName, and position fields
    if ((name === 'firstName' || name === 'lastName' || name === 'position') && /[^a-zA-Z\s]/.test(value)) {
      return; // Prevent updating the state if value contains non-letter characters
    }
    // Limit NIC to 12 characters
    if (name === 'nic' && value.length > 12) {
      return; // Prevent updating if length exceeds 12
    }
    // Limit NIC to 12 characters
    if (name === 'employeeID' && value.length > 6) {
      return; // Prevent updating if length exceeds 12
    }

    // Limit basicSalary to numeric values
    if (name === 'basicSalary' && !/^\d*\.?\d*$/.test(value)) {
      return; // Prevent updating the state if the value is not numeric
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors = {};

    // Validate Employee ID
    if (!/^E\d{5}$/.test(formData.employeeID)) {
      errors.employeeID = 'Employee ID must start with "E" followed by 5 digits.';
    }

    // Validate NIC
    if (!/^\d{9}[Vv]|\d{12}$/.test(formData.nic)) {
      errors.nic = 'NIC must be either 12 digits or 9 digits followed by "v" or "V".';
    }

    // Validate Email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address.';
    }

    // Validate First Name (only letters, between 2-50 characters)
    if (!/^[a-zA-Z]{2,25}$/.test(formData.firstName)) {
      errors.firstName = 'First name must only contain letters and be between 2 and 25 characters.';
    }

    // Validate Last Name (only letters, between 2-50 characters)
    if (!/^[a-zA-Z]{2,25}$/.test(formData.lastName)) {
      errors.lastName = 'Last name must only contain letters and be between 2 and 25 characters.';
    }

    // Validate Position (only letters)
    if (!/^[a-zA-Z\s]+$/.test(formData.position)) {
      errors.position = 'Position must only contain letters.';
    }

    // Validate Basic Salary (numeric value)
    if (!/^\d+(\.\d{1,2})?$/.test(formData.basicSalary)) {
      errors.basicSalary = 'Basic salary must be a valid number (up to two decimal places).';
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (employeeToEdit) {
      dispatch(updateEmployee({ id: employeeToEdit._id, updatedEmployee: formData }));
    } else {
      dispatch(addEmployee(formData));
    }

    setFormData({
      employeeID: '',
      firstName: '',
      lastName: '',
      position: '',
      department: '',
      gender: '',
      nic: '',
      email: '',
      basicSalary: '', // Reset Basic Salary
    });
    setErrors({});
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
            name="employeeID"
            className="w-full px-2 py-1 border rounded-md"
            value={formData.employeeID}
            onChange={handleChange}
            required
            placeholder="E12345"
          />
          {errors.employeeID && <p className="text-red-500">{errors.employeeID}</p>}
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
              placeholder="Nalin"
            />
            {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
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
              placeholder="Fernando"
            />
            {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
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
            placeholder="Manager"
          />
          {errors.position && <p className="text-red-500">{errors.position}</p>}
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
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
            <option value="Marketing">Marketing</option>
            <option value="Production">Production</option>
            <option value="Finance">Finance</option>
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
            placeholder="20013471229 or 857825532V"
          />
          {errors.nic && <p className="text-red-500">{errors.nic}</p>}
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
            placeholder="example@mail.com"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        <div className="mb-3">
          <label className="block text-gray-700">Basic Salary:</label>
          <input
            type="text"
            name="basicSalary"
            className="w-full px-2 py-1 border rounded-md"
            value={formData.basicSalary}
            onChange={handleChange}
            required
            placeholder="Enter basic salary"
          />
          {errors.basicSalary && <p className="text-red-500">{errors.basicSalary}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          {employeeToEdit ? 'Update' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;

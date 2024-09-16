import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteEmployee } from '../../features/employee/employeeSlice';

const EmployeeItem = ({ employee, onEdit }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteEmployee(employee._id));
  };

  return (
    <tr>
      <td className="p-2 border border-gray-300">{employee.employeeID}</td>
      <td className="p-2 border border-gray-300">{employee.firstName}</td>
      <td className="p-2 border border-gray-300">{employee.lastName}</td>
      <td className="p-2 border border-gray-300">{employee.position}</td>
      <td className="p-2 border border-gray-300">{employee.department}</td>
      <td className="p-2 border border-gray-300">{employee.gender}</td>
      <td className="p-2 border border-gray-300">{employee.nic}</td>
      <td className="p-2 border border-gray-300">{employee.email}</td>
      <td className="p-2 border border-gray-300">
        <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600" onClick={() => onEdit(employee)}>Edit</button> 
        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2" onClick={handleDelete}>Delete</button>
      </td>
    </tr>
  );
};

export default EmployeeItem;

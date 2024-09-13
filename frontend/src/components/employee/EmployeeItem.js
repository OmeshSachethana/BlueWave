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
      <td className="border px-4 py-2">{employee.employeeID}</td>
      <td className="border px-4 py-2">{employee.firstName}</td>
      <td className="border px-4 py-2">{employee.lastName}</td>
      <td className="border px-4 py-2">{employee.position}</td>
      <td className="border px-4 py-2">{employee.department}</td>
      <td className="border px-4 py-2">{employee.gender}</td>
      <td className="border px-4 py-2">{employee.nic}</td>
      <td className="border px-4 py-2">{employee.email}</td>
      <td className="border px-4 py-2">
        <button className="btn-yellow mr-2" onClick={() => onEdit(employee)}>Edit</button> 
        <button className="btn-red" onClick={handleDelete}>Delete</button>
      </td>
    </tr>
  );
};

export default EmployeeItem;

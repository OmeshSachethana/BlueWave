// src/components/EmployeeList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, deleteEmployee } from '../../features/employee/employeeSlice';

const EmployeeList = () => {
  const dispatch = useDispatch();
  const { employees, status, error } = useSelector(state => state.employees);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEmployees());
    }
  }, [dispatch, status]);

  const handleDelete = (id) => {
    dispatch(deleteEmployee(id));
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Employees List</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee._id}>
            {employee.firstName} {employee.lastName} - {employee.position}
            <button onClick={() => handleDelete(employee._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
